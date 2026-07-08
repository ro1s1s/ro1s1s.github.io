const express = require('express');
const https = require('https');
const app = express();
const PORT = process.env.PORT || 3000;

// دالة تحليل الجهاز والمتصفح
const getDeviceDetails = (ua) => {
    let device = "Desktop/Unknown";
    let browser = "Unknown";
    
    if (ua.includes("iphone")) device = "iPhone";
    else if (ua.includes("android")) device = "Android";
    else if (ua.includes("ipad")) device = "iPad";
    else if (ua.includes("macintosh")) device = "Mac";
    
    if (ua.includes("chrome") && !ua.includes("edge")) browser = "Chrome";
    else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
    else if (ua.includes("firefox")) browser = "Firefox";
    else if (ua.includes("edg/")) browser = "Edge";
    
    return { device, browser };
};

app.get('*', async (req, res) => {
    // تجاهل الأيقونات
    if (req.url.includes('favicon.ico') || req.url.includes('robots.txt')) {
        return res.status(204).end();
    }

    // جلب البيانات
    const xRealIp = req.headers['x-real-ip'];
    const xForwardedFor = req.headers['x-forwarded-for'];
    const visitorIp = xRealIp || (xForwardedFor ? xForwardedFor.split(',')[0].trim() : req.socket.remoteAddress) || 'Unknown IP';
    
    const userAgent = (req.headers['user-agent'] || '').toLowerCase();
    const details = getDeviceDetails(userAgent);
    const to = req.query.to; 
    const path = req.path;

    // الروابط
    const telegramUrl = "https://t.me/uUl8iPwh5iYTVk";
    const snapUrl = "https://www.snapchat.com/add/rossan2682";
    const oldInstaUrl = "https://ig.me/j/AbapZ-hZJ16gK_d4/";
    const newInstaChannelUrl = "https://www.instagram.com/channel/AbYsIbwIHyJ3tWZq/";

    let targetUrl = telegramUrl;
    let destinationName = 'Telegram';

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

    // فلتر البوتات
    const isBot = userAgent.includes('bot') || userAgent.includes('facebookexternalhit');

    // الإرسال للتليجرام
    if (!isBot) {
        const token = process.env.TELEGRAM_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        
        if (token && chatId) {
            const messageText = `🚨 New Visitor!\nTo: ${destinationName}\nIP: ${visitorIp}\n📱 Device: ${details.device}\n🌐 Browser: ${details.browser}`;
            const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(messageText)}`;
            
            try {
                await fetch(url);
            } catch (err) {}
        }
    }

    res.redirect(302, targetUrl);
});

module.exports = app;
app.listen(PORT);
