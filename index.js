const express = require('express');
const cors = require('cors');
const { client, isReady } = require('./whatsappClient');
const path = require('path');

const app = express();

// Configure CORS with specific options
app.use(cors({
    origin: 'http://13.60.87.164:3000', // Allow your frontend origin
    methods: ['POST', 'GET', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type'], // Allowed headers
    credentials: true // Allow credentials
}));

// Make sure this comes after CORS configuration
app.use(express.json());

// API to send a message
app.post('/send', async (req, res) => {
    const { numbers, message } = req.body;

    if (!numbers || !message) {
        return res.status(400).json({ error: "Numbers and message are required" });
    }

    try {
        for (const number of numbers) {
            // नंबर को फॉर्मैट करें
            const formattedNumber = number.startsWith('91') ? number : `91${number}`;
            let chatId = `${formattedNumber}@c.us`;
            await client.sendMessage(chatId, message);
        }

        res.json({ success: true, message: "Messages sent successfully!" });
    } catch (error) {
        console.error("Error sending messages:", error);
        res.status(500).json({ error: "Failed to send messages" });
    }
});

// Add status endpoint
app.get('/status', (req, res) => {
    try {
        const connected = isReady();
        console.log('WhatsApp connection status:', connected);
        res.json({ 
            connected: connected,
            serverStatus: 'running'
        });
    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({ 
            connected: false,
            error: error.message,
            serverStatus: 'error'
        });
    }
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


app.listen(3000, () => console.log("Server running on port 3000"));
