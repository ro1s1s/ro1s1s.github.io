const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('*', async (req, res) => {
    // 1. تجاهل أيقونات الموقع تماماً لمنع التكرار
    if (req.url.includes('favicon.ico') || req.url.includes('robots.txt')) {
        return res.status(204).end();
    }

    // جلب الآي بي
    const xRealIp = req.headers['x-real-ip'];
    const xForwardedFor = req.headers['x-forwarded-for'];
    const visitorIp = xRealIp || (xForwardedFor ? xForwardedFor.split(',')[0].trim() : req.socket.remoteAddress) || 'Unknown IP';

    const to = req.query.to; 
    const path = req.path;

    const telegramUrl = "https://t.me/uUl8iPwh5iYTVk";
    const snapUrl = "https://www.snapchat.com/add/rossan2682";
    const oldInstaUrl = "https://ig.me/j/AbapZ-hZJ16gK_d4/";
    const newInstaChannelUrl = "https://www.instagram.com/channel/AbYsIbwIHyJ3tWZq/";

    let targetUrl = telegramUrl;
    let destinationName = 'Telegram';

    // مسارات التوجيه
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

    // 2. فلتر البوتات (يمنع معاينات الواتساب وتليجرام وانستغرام من إرسال رسائل وهمية)
    const userAgent = (req.headers['user-agent'] || '').toLowerCase();
    const isBot = userAgent.includes('bot') || userAgent.includes('facebookexternalhit');

    // 3. الإرسال إلى تليجرام **أولاً** قبل التوجيه
    if (!isBot) {
        const token = process.env.TELEGRAM_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        
        if (token && chatId) {
            const messageText = `🚨 New Visitor!\nTo: ${destinationName}\nIP: ${visitorIp}`;
            const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(messageText)}`;
            
            try {
                // استخدام await هنا يمنع Vercel من إغلاق العملية قبل وصول التنبيه
                await fetch(url);
            } catch (err) {
                console.error("Error:", err);
            }
        }
    }

    // 4. أخيراً: توجيه الزائر (بعد التأكد من إرسال التنبيه لك)
    res.redirect(302, targetUrl);
});

module.exports = app;
app.listen(PORT);
