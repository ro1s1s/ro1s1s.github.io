const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. تجاهل طلبات الأيقونات وملفات النظام تلقائياً لمنع التكرار
app.use((req, res, next) => {
    if (req.url.includes('favicon.ico') || req.url.includes('robots.txt')) {
        return res.status(204).end();
    }
    next();
});

app.get('*', async (req, res) => {
    const visitorIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const to = req.query.to; 
    const path = req.path;

    const telegramUrl = "https://t.me/uUl8iPwh5iYTVk";
    const snapUrl = "https://www.snapchat.com/add/rossan2682";
    const oldInstaUrl = "https://ig.me/j/AbapZ-hZJ16gK_d4/";
    const newInstaChannelUrl = "https://www.instagram.com/channel/AbYsIbwIHyJ3tWZq/";

    let targetUrl = telegramUrl;
    let destinationName = 'Telegram';

    // منطق التوجيه
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

    // 2. إرسال التنبيه بشرط أن يكون الزائر حقيقياً (ليس بوت)
    const userAgent = (req.headers['user-agent'] || '').toLowerCase();
    const isBot = userAgent.includes('bot') || userAgent.includes('spider') || userAgent.includes('crawl');

    if (!isBot && visitorIp) {
        const token = process.env.TELEGRAM_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        
        if (token && chatId) {
            // استخدام fetch بشكل آمن
            fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(`🚨 New Visitor!\nTo: ${destinationName}\nIP: ${visitorIp}`)}`)
            .catch(() => {});
        }
    }
});

module.exports = app;
app.listen(PORT);
