const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Increase function timeout
    context.callbackWaitsForEmptyEventLoop = false;
    
    // Handle preflight CORS requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Max-Age': '86400'
            },
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        // Parse the incoming request body
        const payload = JSON.parse(event.body);
        console.log('Sending request to Langflow...');

        // Set timeout for fetch
        const controller = new AbortController();
        const timeout = setTimeout(() => {
            controller.abort();
        }, 25000); // 25 second timeout

        try {
            const response = await fetch(
                'https://api.langflow.astra.datastax.com/lf/ed6c45f6-6029-47a5-a6ee-86d7caf24d60/api/v1/run/c4369450-5685-4bb4-85b3-f47b7dd0e917?stream=false',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.LANGFLOW_API_TOKEN}`
                    },
                    body: JSON.stringify(payload),
                    signal: controller.signal
                }
            );

            clearTimeout(timeout);

            if (!response.ok) {
                throw new Error(`Langflow API responded with status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('Received response from Langflow');

            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(responseData)
            };
        } catch (fetchError) {
            clearTimeout(timeout);
            throw fetchError;
        }

    } catch (error) {
        console.error('Error in lambda function:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: 'Internal Server Error',
                message: error.message,
                details: error.stack
            })
        };
    }
};