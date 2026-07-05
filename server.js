const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    // 1. استخراج المتغير والـ IP
    const destination = req.query.to;
    const visitorIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // 2. الروابط (تمت إضافة الإنستغرام)
    const telegramUrl = "https://t.me/uUl8iPwh5iYTVk";
    const snapUrl = "https://www.snapchat.com/add/rossan2682";
    const instaUrl = "https://ig.me/j/AbapZ-hZJ16gK_d4/";
    
    let targetUrl = telegramUrl; // الافتراضي تليجرام

    if (destination === 'snap') {
        targetUrl = snapUrl;
    } else if (destination === 'insta') {
        targetUrl = instaUrl;
    }

    // 3. إرسال التنبيه لتليجرام مع تصفية البوتات
    try {
        const userAgent = (req.headers['user-agent'] || '').toLowerCase();
        const isBot = userAgent.includes('bot') || userAgent.includes('vercel') || userAgent.includes('spider') || userAgent.includes('crawl') || userAgent.includes('facebookexternalhit');

        if (!isBot) {
            const token = process.env.TELEGRAM_TOKEN;
            const chatId = process.env.TELEGRAM_CHAT_ID;
            const message = `🚨 New Visitor!\nTo: ${destination || 'Telegram'}\nIP: ${visitorIp}`;
            
            await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: message })
            });
        }
    } catch (err) {
        console.log("Telegram Error: ", err);
    }

    // 4. التوجيه
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <script>
                window.location.href = "${targetUrl}";
            </script>
        </head>
        <body>
            <p style="text-align: center; margin-top: 50px;">جاري التحويل...</p>
        </body>
        </html>
    `);
});

module.exports = app;
app.listen(PORT, () => console.log("Server is running..."));
