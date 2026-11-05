import os
import json
import sqlite3
from flask import Flask, request, jsonify, Response
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS server-wide for all origins/routes and methods
CORS(app, resources={r"/*": {"origins": "*"}}, methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

DB_FILE = 'messages.db'


# ============================================================================
# DATABASE ENCAPSULATION CLASS
# ============================================================================
class ReviewDatabase:
    """Encapsulates all SQLite database logic for the Feedback / Reviews resource."""

    def __init__(self, db_path=DB_FILE):
        self.db_path = db_path
        self.init_db()

    def get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row  # Return dict-accessible rows
        return conn

    def init_db(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    content TEXT NOT NULL,
                    member_status TEXT,
                    sex TEXT,
                    d_number TEXT,
                    skill_level TEXT
                )
            ''')
            # Check existing columns and migrate if necessary
            cursor.execute("PRAGMA table_info(messages)")
            existing_cols = [col["name"] for col in cursor.fetchall()]
            for col_name in ['member_status', 'sex', 'd_number', 'skill_level']:
                if col_name not in existing_cols:
                    cursor.execute(f"ALTER TABLE messages ADD COLUMN {col_name} TEXT")
            conn.commit()

    def list(self):
        """List: returns all records ordered by ID."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM messages ORDER BY id ASC")
            return [dict(row) for row in cursor.fetchall()]

    def retrieve(self, item_id):
        """Retrieve: returns a single record by unique ID or None."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM messages WHERE id = ?", (item_id,))
            row = cursor.fetchone()
            return dict(row) if row else None

    def create(self, content, member_status=None, sex=None, d_number=None, skill_level=None):
        """Create: inserts a new record and returns the created representation."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO messages (content, member_status, sex, d_number, skill_level)
                VALUES (?, ?, ?, ?, ?)
            ''', (content, member_status, sex, d_number, skill_level))
            conn.commit()
            new_id = cursor.lastrowid
            return self.retrieve(new_id)

    def replace(self, item_id, content, member_status=None, sex=None, d_number=None, skill_level=None):
        """Replace: updates all attributes of an existing record by unique ID."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE messages
                SET content = ?, member_status = ?, sex = ?, d_number = ?, skill_level = ?
                WHERE id = ?
            ''', (content, member_status, sex, d_number, skill_level, item_id))
            conn.commit()
            if cursor.rowcount == 0:
                return None
            return self.retrieve(item_id)

    def delete(self, item_id):
        """Delete: deletes an existing record by unique ID."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM messages WHERE id = ?", (item_id,))
            conn.commit()
            return cursor.rowcount > 0


# Instantiate the database layer
db = ReviewDatabase()


# ============================================================================
# 5 RESTFUL API ROUTES FOR RESOURCE: /messages
# ============================================================================

# 1. LIST: Returns a JSON array of all members in the collection
@app.route('/messages', methods=['GET'])
def list_messages():
    items = db.list()
    return jsonify(items), 200


# 2. RETRIEVE: Returns a JSON representation of a single member by ID
@app.route('/messages/<int:item_id>', methods=['GET'])
def get_message(item_id):
    item = db.retrieve(item_id)
    if item is None:
        return jsonify({
            "error": "Not Found",
            "message": f"Feedback record with ID {item_id} does not exist."
        }), 404
    return jsonify(item), 200


# 3. CREATE: Creates a new member within the collection
@app.route('/messages', methods=['POST'])
def create_message():
    if not request.is_json:
        return jsonify({
            "error": "Bad Request",
            "message": "Request body must be valid JSON with a Content-Type of application/json."
        }), 400

    data = request.get_json(silent=True) or {}
    content = (data.get('content') or data.get('message') or '').strip()

    if not content:
        return jsonify({
            "error": "Bad Request",
            "message": "The 'content' attribute is required and cannot be empty."
        }), 400

    item = db.create(
        content=content,
        member_status=(data.get('member_status') or '').strip() or None,
        sex=(data.get('sex') or '').strip() or None,
        d_number=(data.get('d_number') or '').strip() or None,
        skill_level=(data.get('skill_level') or '').strip() or None
    )

    response = jsonify(item)
    response.status_code = 201
    response.headers['Location'] = f"/messages/{item['id']}"
    return response


# 4. REPLACE: Updates an existing member in the collection
@app.route('/messages/<int:item_id>', methods=['PUT'])
def replace_message(item_id):
    if not request.is_json:
        return jsonify({
            "error": "Bad Request",
            "message": "Request body must be valid JSON with a Content-Type of application/json."
        }), 400

    data = request.get_json(silent=True) or {}
    content = (data.get('content') or data.get('message') or '').strip()

    if not content:
        return jsonify({
            "error": "Bad Request",
            "message": "The 'content' attribute is required and cannot be empty."
        }), 400

    updated_item = db.replace(
        item_id=item_id,
        content=content,
        member_status=(data.get('member_status') or '').strip() or None,
        sex=(data.get('sex') or '').strip() or None,
        d_number=(data.get('d_number') or '').strip() or None,
        skill_level=(data.get('skill_level') or '').strip() or None
    )

    if updated_item is None:
        return jsonify({
            "error": "Not Found",
            "message": f"Cannot replace: feedback record with ID {item_id} does not exist."
        }), 404

    return jsonify(updated_item), 200


# 5. DELETE: Removes an existing member from the collection
@app.route('/messages/<int:item_id>', methods=['DELETE'])
def delete_message(item_id):
    deleted = db.delete(item_id)
    if not deleted:
        return jsonify({
            "error": "Not Found",
            "message": f"Cannot delete: feedback record with ID {item_id} does not exist."
        }), 404

    return jsonify({
        "message": f"Feedback record with ID {item_id} was successfully removed."
    }), 200


# ============================================================================
# AUXILIARY ROUTES & ERROR HANDLERS
# ============================================================================

# GroupMe member count for hero section counter
@app.route('/api/member-count', methods=['GET'])
def get_member_count():
    import urllib.request
    try:
        group_id = '117269013'
        req = urllib.request.Request(
            f'https://api.groupme.com/v3/groups/{group_id}',
            headers={'X-Access-Token': 'e6e9a2109e43013f6855427ac8914653'}
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode())
            return jsonify({'count': len(data['response']['members'])}), 200
    except Exception:
        return jsonify({'error': 'Failed to fetch member count'}), 500


@app.errorhandler(404)
def not_found(e):
    return jsonify({
        "error": "Not Found",
        "message": "The requested URL or resource does not exist on this server."
    }), 404


@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({
        "error": "Method Not Allowed",
        "message": "The HTTP method is not allowed for the requested path."
    }), 405


if __name__ == '__main__':
    # Run server on port 8008
    app.run(port=8008, debug=True)
