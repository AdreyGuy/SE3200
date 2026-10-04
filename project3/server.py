import os
import json
from flask import Flask, request, jsonify, Response
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS server-wide for all origins/routes
CORS(app)

MESSAGES_FILE = 'messages.txt'

# Ensure the messages file exists
if not os.path.exists(MESSAGES_FILE):
    with open(MESSAGES_FILE, 'w', encoding='utf-8') as f:
        pass


@app.route('/messages', methods=['POST'])
def add_message():
    # Expecting plain text or JSON { "message": "..." }
    if request.is_json:
        data = request.get_json(silent=True) or {}
        message = data.get('message', '').strip()
    else:
        message = request.get_data(as_text=True).strip()

    if not message:
        return Response("Message cannot be empty", status=400, mimetype='text/plain')

    # Append to local file
    with open(MESSAGES_FILE, 'a', encoding='utf-8') as f:
        f.write(message + '\n')

    # 201 Created with no response body
    return Response(status=201)


@app.route('/messages', methods=['GET'])
def get_messages():
    # Read messages from local file
    messages = []
    if os.path.exists(MESSAGES_FILE):
        with open(MESSAGES_FILE, 'r', encoding='utf-8') as f:
            messages = [line.rstrip('\r\n') for line in f if line.rstrip('\r\n')]

    # 200 OK with Content-Type: application/json and JSON array body
    return jsonify(messages), 200


# GroupMe member count
@app.route('/api/member-count', methods=['GET'])
def get_member_count():
    import urllib.request
    try:
        group_id = '117269013'
        req = urllib.request.Request(
            f'https://api.groupme.com/v3/groups/{group_id}',
            headers={'X-Access-Token': 'e6e9a2109e43013f6855427ac8914653'}
        )
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            return jsonify({'count': len(data['response']['members'])}), 200
    except Exception:
        return jsonify({'error': 'Failed to fetch member count'}), 500


@app.errorhandler(404)
def not_found(e):
    # Appropriate Not Found response explaining reason with plain text or HTML
    return Response(
        "404 Not Found: The requested URL does not match any configured route on this server.",
        status=404,
        mimetype='text/plain'
    )


if __name__ == '__main__':
    # Run server on port 8008 or 5000
    app.run(port=8008, debug=True)
