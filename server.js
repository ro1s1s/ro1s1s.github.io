const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// استخدمنا النجمة '*' لكي يقبل السيرفر أي رابط أو مسار
app.get('*', async (req, res) => {
    const visitorIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const host = req.headers.host || ''; 
    const url = req.originalUrl || ''; // استخدام originalUrl لضمان التقاط الرمز بدقة

    const telegramUrl = "https://t.me/uUl8iPwh5iYTVk";
    const snapUrl = "https://www.snapchat.com/add/rossan2682";
    const oldInstaUrl = "https://ig.me/j/AbapZ-hZJ16gK_d4/";
    const newInstaChannelUrl = "https://www.instagram.com/channel/AbYsIbwIHyJ3tWZq/";

    let targetUrl = telegramUrl; 
    let destinationName = 'Telegram';

    // 1. فحص المسار الجديد أولاً بمرونة عالية
    if (url.includes('AbYsIbwIHyJ3tWZq')) {
        targetUrl = newInstaChannelUrl;
        destinationName = 'Instagram Channel';
    } 
    // 2. فحص روابط الدومينات الفرعية
    else if (host.includes('instagram') || host.includes('ig')) {
        targetUrl = oldInstaUrl;
        destinationName = 'Instagram';
    } 
    else if (host.includes('snap')) {
        targetUrl = snapUrl;
        destinationName = 'Snapchat';
    }

    // التوجيه الفوري والصامت (لن تظهر أي صفحة بيضاء أو كلام للمستخدم)
    res.redirect(302, targetUrl);

    // إرسال التنبيه لتليجرام في الخلفية
    try {
        const userAgent = (req.headers['user-agent'] || '').toLowerCase();
        
        const isBot = userAgent.includes('bot') || 
                      userAgent.includes('vercel') || 
                      userAgent.includes('spider') || 
                      userAgent.includes('crawl') || 
                      userAgent.includes('facebookexternalhit') || 
                      userAgent.includes('telegrambot');

        if (!isBot) {
            const token = process.env.TELEGRAM_TOKEN;
            const chatId = process.env.TELEGRAM_CHAT_ID;
            
            const message = `🚨 New Visitor!\nTo: ${destinationName}\nIP: ${visitorIp}`;
            
            fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: message })
            }).catch(err => console.log(err));
        }
    } catch (err) {
        console.log("Error: ", err);
    }
});

module.exports = app;
app.listen(PORT, () => console.log("Server is running..."));
