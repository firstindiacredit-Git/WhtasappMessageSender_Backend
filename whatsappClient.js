const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Create WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth(), // Stores session to avoid repeated logins
    puppeteer: {
        headless: true, // Run in the background
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

// Generate QR Code for Authentication
client.on('qr', (qr) => {
    console.log("Scan the QR code below to login:");
    qrcode.generate(qr, { small: true });
});

// Confirm when logged in
client.on('ready', () => {
    console.log("WhatsApp Client is ready!");
});

// Start client
client.initialize();

module.exports = client;
