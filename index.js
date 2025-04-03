const express = require('express');
const cors = require('cors');
const client = require('./whatsappClient');

const app = express();

// Configure CORS with specific options
app.use(cors({
    origin: 'http://localhost:5173', // Allow your frontend origin
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

app.listen(3001, () => console.log("Server running on port 3001"));
