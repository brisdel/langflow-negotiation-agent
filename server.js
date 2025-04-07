const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Enable CORS
app.use(cors());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const PORT = 5000;
app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
    console.log(`Serving files from: ${__dirname}`);
});