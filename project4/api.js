const cors = require('cors');
const express = require('express');

const app = express();
app.use(cors());

app.get('/api/member-count', async (req, res) => {
    try {
        const groupId = '117269013';

        const response = await fetch(`https://api.groupme.com/v3/groups/${groupId}`, {
            headers: { 'X-Access-Token': 'e6e9a2109e43013f6855427ac8914653' }
        });

        const data = await response.json();
        const memberCount = data.response.members.length; // Length of members array

        res.json({ count: memberCount });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch member count' });
    }
});

app.listen(8008, () => console.log('Proxy API running on port 8008'));