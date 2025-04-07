// Add this function at the top of your script.js
function countTokens(text) {
    // More accurate token estimation
    // Average word length is about 4.5 characters, and we add 1 for spaces/punctuation
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const tokens = words.reduce((acc, word) => {
        // Each word is roughly 1.3 tokens on average
        return acc + Math.ceil(word.length / 4.5) + 1;
    }, 0);
    return tokens;
}

// Update the generateStrategy function
async function generateStrategy() {
    const chatInput = document.getElementById("chatInput").value.trim();
    const supplierBehavior = document.getElementById("supplierBehavior").value;

    if (!chatInput) {
        alert("Please enter your negotiation context");
        return;
    }

    // Check input length with more conservative limits
    const inputText = `Style: ${supplierBehavior}. Context: ${chatInput}`;
    const estimatedTokens = countTokens(inputText);
    
    if (estimatedTokens > 400) { // More conservative limit
        alert(`Your input is too long (${estimatedTokens} tokens). Please provide a shorter description (maximum 400 tokens).`);
        return;
    }

    // Show loading state
    const outputSection = document.getElementById("output");
    const chatOutput = document.getElementById("chatOutput");
    outputSection.style.display = 'block';
    chatOutput.textContent = "Generating strategy... This may take up to 30 seconds.";

    const payload = {
        "input_value": inputText,
        "output_type": "chat",
        "input_type": "chat",
        "tweaks": {
            "Agent-cfbu4": {},
            "ChatInput-URWrQ": {},
            "ChatOutput-8jfCH": {},
            "AstraDBToolComponent-HX1wm": {},
            "AstraDB-1zteC": {},
            "ParseDataFrame-uutq1": {}
        }
    };

    try {
        console.log('Sending request with payload:', payload);
        
        const response = await fetch(API_CONFIG.URL, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify(payload)
        });

        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Raw response text:', responseText);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
        }

        const result = JSON.parse(responseText);
        console.log('Parsed result:', result);

        // Handle error in the response
        if (result.detail) {
            const errorDetail = JSON.parse(result.detail);
            throw new Error(errorDetail.message || 'Error from Langflow API');
        }

        // Handle different response formats
        let strategyText;
        if (result.outputs && result.outputs[0] && result.outputs[0].outputs && 
            result.outputs[0].outputs[0] && result.outputs[0].outputs[0].results && 
            result.outputs[0].outputs[0].results.message && 
            result.outputs[0].outputs[0].results.message.text) {
            strategyText = result.outputs[0].outputs[0].results.message.text;
        } else if (result.message) {
            strategyText = result.message;
        } else if (typeof result === 'string') {
            strategyText = result;
        } else {
            strategyText = JSON.stringify(result, null, 2);
        }
        
        // Format and display the response
        chatOutput.innerHTML = formatMarkdown(strategyText);
        outputSection.style.display = 'block';

    } catch (error) {
        console.error('Detailed error:', error);
        chatOutput.innerHTML = `
            <div class="error">
                <strong>Error Details:</strong><br>
                ${error.message}<br><br>
                <small>Try using a shorter input text or simpler description.</small>
            </div>
        `;
    }
}
// Configuration for the API
const API_CONFIG = {
    URL: 'https://your-project-name.up.railway.app/api/v1/run', // Replace with your actual Railway URL
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// Helper function to format markdown-like text
function formatMarkdown(text) {
    if (!text) return '';
    
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/### (.*?)\n/g, '<h3>$1</h3>')
        .replace(/## (.*?)\n/g, '<h2>$1</h2>')
        .replace(/# (.*?)\n/g, '<h1>$1</h1>')
        .replace(/\n/g, '<br>')
        .replace(/\|/g, ' | ')
        .replace(/---/g, '<hr>');
}

async function generateStrategy() {
    const chatInput = document.getElementById("chatInput").value;
    const supplierBehavior = document.getElementById("supplierBehavior").value;

    if (!chatInput.trim()) {
        alert("Please enter your negotiation context");
        return;
    }

    // Show loading state
    const outputSection = document.getElementById("output");
    const chatOutput = document.getElementById("chatOutput");
    outputSection.style.display = 'block';
    chatOutput.textContent = "Generating strategy... This may take up to 30 seconds.";

    const payload = {
        "input_value": `Style: ${supplierBehavior}. Context: ${chatInput}`,
        "output_type": "chat",
        "input_type": "chat",
        "tweaks": {
            "Agent-cfbu4": {},
            "ChatInput-URWrQ": {},
            "ChatOutput-8jfCH": {},
            "AstraDBToolComponent-HX1wm": {},
            "AstraDB-1zteC": {},
            "ParseDataFrame-uutq1": {}
        }
    };

    try {
        console.log('Sending request with payload:', payload);
        
        const response = await fetch(API_CONFIG.URL, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify(payload)
        });

        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Raw response text:', responseText);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
        }

        const result = JSON.parse(responseText);
        console.log('Parsed result:', result);

        // Handle different response formats
        let strategyText;
        if (result.outputs && result.outputs[0] && result.outputs[0].outputs && 
            result.outputs[0].outputs[0] && result.outputs[0].outputs[0].results && 
            result.outputs[0].outputs[0].results.message && 
            result.outputs[0].outputs[0].results.message.text) {
            strategyText = result.outputs[0].outputs[0].results.message.text;
        } else if (result.message) {
            strategyText = result.message;
        } else if (typeof result === 'string') {
            strategyText = result;
        } else {
            strategyText = JSON.stringify(result, null, 2);
        }
        
        // Format and display the response
        chatOutput.innerHTML = formatMarkdown(strategyText);
        outputSection.style.display = 'block';

    } catch (error) {
        console.error('Detailed error:', error);
        chatOutput.innerHTML = `
            <div class="error">
                <strong>Error Details:</strong><br>
                ${error.message}<br><br>
                Please check the browser console for more details.
            </div>
        `;
    }
}

// Add event listeners when the document loads
document.addEventListener('DOMContentLoaded', function() {
    // Add enter key support for the textarea
    document.getElementById("chatInput").addEventListener("keypress", function(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            generateStrategy();
        }
    });

    // Add click handler for export button
    document.getElementById("exportBtn").addEventListener("click", function() {
        const content = document.getElementById("chatOutput").textContent;
        exportToPDF(content);
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...

    // Add character counter
    const chatInput = document.getElementById("chatInput");
    const charCount = document.getElementById("charCount");
    
    chatInput.addEventListener('input', function() {
        const text = this.value;
        const chars = text.length;
        const tokens = countTokens(text);
        charCount.textContent = `Characters: ${chars} / Estimated tokens: ${tokens}`;
        
        if (tokens > 450) {
            charCount.style.color = '#ff0000';
        } else {
            charCount.style.color = '#666';
        }
    });
});
function exportToPDF(content) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(content, 180);
    doc.text(splitText, 10, 10);
    doc.save('negotiation-strategy.pdf');
}