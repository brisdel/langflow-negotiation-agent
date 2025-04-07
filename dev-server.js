const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

// Enable CORS
app.use(cors());

// Serve static files
app.use(express.static('./'));

// Parse JSON bodies
app.use(express.json());

// Proxy endpoint for Langflow
app.post('/api/langflow-proxy', async (req, res) => {
    try {
        console.log('Received request:', req.body);

        const response = await fetch(
            'https://api.langflow.astra.datastax.com/lf/ed6c45f6-6029-47a5-a6ee-86d7caf24d60/api/v1/run/c4369450-5685-4bb4-85b3-f47b7dd0e917?stream=false',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.LANGFLOW_API_TOKEN}`
                },
                body: JSON.stringify(req.body)
            }
        );

        const data = await response.json();
        console.log('Langflow API Response:', JSON.stringify(data, null, 2));

        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: error.message,
            stack: error.stack 
        });
    }
});

const PORT = 9000;
app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});