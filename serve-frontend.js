const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve the frontend test file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend-test.html'));
});

app.listen(port, () => {
    console.log(`Frontend test server running on http://localhost:${port}`);
    console.log(`API server should be running on http://localhost:4005`);
});
