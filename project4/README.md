# project4

## Resource

**messages**

Attributes:

* content (string)
* member_status (string)
* sex (string)
* d_number (integer)
* skill_level (string)

## Schema

```sql
CREATE TABLE IF NOT EXISTS messages (
id INTEGER PRIMARY KEY AUTOINCREMENT,
content TEXT NOT NULL,
member_status TEXT,
sex TEXT,
d_number TEXT,
skill_level TEXT)
```

## REST Endpoints

Name                           | Method | Path
-------------------------------|--------|------------------
Retrieve messages collection | GET    | /messages
Retrieve messages member     | GET    | /messages/<id>
Create messages member       | POST   | /messages
Update messages member       | PUT    | /messages/<id>
Delete messages member       | DELETE | /messages/<id>
