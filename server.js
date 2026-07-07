const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// تجاهل طلبات الأيقونات لمنع الرسائل المتكررة
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('*', async (req, res) => {
    const visitorIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const to = req.query.to; // التقاط القيمة الموجودة بعد ?to=
    const path = req.path; // التقاط المسار (مثل /AbYsIbwIHyJ3tWZq)

    // الروابط
    const telegramUrl = "https://t.me/uUl8iPwh5iYTVk";
    const snapUrl = "https://www.snapchat.com/add/rossan2682";
    const oldInstaUrl = "https://ig.me/j/AbapZ-hZJ16gK_d4/";
    const newInstaChannelUrl = "https://www.instagram.com/channel/AbYsIbwIHyJ3tWZq/";

    let targetUrl = telegramUrl;
    let destinationName = 'Telegram';

    // منطق التوجيه بناءً على الرابط المكتوب
    if (path.includes('AbYsIbwIHyJ3tWZq')) {
        targetUrl = newInstaChannelUrl;
        destinationName = 'Instagram Channel';
    } else if (to === 'insta') {
        targetUrl = oldInstaUrl;
        destinationName = 'Instagram';
    } else if (to === 'snap') {
        targetUrl = snapUrl;
        destinationName = 'Snapchat';
    }

    // التوجيه الفوري
    res.redirect(302, targetUrl);

    // التنبيه في الخلفية
    try {
        const userAgent = (req.headers['user-agent'] || '').toLowerCase();
        const isBot = userAgent.includes('bot') || userAgent.includes('crawl') || userAgent.includes('python');

        if (!isBot) {
            const token = process.env.TELEGRAM_TOKEN;
            const chatId = process.env.TELEGRAM_CHAT_ID;
            if (token && chatId) {
                fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: chatId, text: `🚨 New Visitor!\nTo: ${destinationName}\nIP: ${visitorIp}` })
                }).catch(() => {});
            }
        }
    } catch (err) {}
});

module.exports = app;
app.listen(PORT);
