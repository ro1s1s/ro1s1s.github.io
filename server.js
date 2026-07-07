const express = require('express');
const https = require('https'); // استخدام مكتبة النظام لضمان استقرار الإرسال
const app = express();
const PORT = process.env.PORT || 3000;

// 1. تجاهل طلبات الأيقونات وملفات النظام تلقائياً لمنع التكرار والرسائل العشوائية
app.use((req, res, next) => {
    if (req.url.includes('favicon.ico') || req.url.includes('robots.txt')) {
        return res.status(204).end();
    }
    next();
});

app.get('*', async (req, res) => {
    // جلب الآي بي الحقيقي للزائر
    const xRealIp = req.headers['x-real-ip'];
    const xForwardedFor = req.headers['x-forwarded-for'];
    const visitorIp = xRealIp || (xForwardedFor ? xForwardedFor.split(',')[0].trim() : req.socket.remoteAddress);

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

    // التوجيه الفوري والصامت للزائر دون تأخير
    res.redirect(302, targetUrl);

    // 2. فلترة ذكية ومتوازنة: حظر بوتات المعاينة الفورية للتطبيقات فقط
    const userAgent = (req.headers['user-agent'] || '').toLowerCase();
    const isBot = userAgent.includes('facebookexternalhit') || // سيرفرات فيسبوك وإنستغرام
                  userAgent.includes('telegrambot') ||          // بوتات تليجرام المباشرة
                  userAgent.includes('twitterbot') ||           // سيرفرات إكس
                  userAgent.includes('slackbot');               // سيرفرات سلاك

    // إذا لم يكن بوتاً لتطبيق، أرسل التنبيه فوراً
    if (!isBot && visitorIp) {
        const token = process.env.TELEGRAM_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        
        if (token && chatId) {
            const messageText = `🚨 New Visitor!\nTo: ${destinationName}\nIP: ${visitorIp}`;
            const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(messageText)}`;
            
            // استخدام طريقة الإرسال المستقرة عبر طلب GET بسيط
            https.get(url, (response) => {
                // تم الطلب بنجاح في الخلفية
            }).on('error', (e) => {
                console.error("Telegram Send Error:", e);
            });
        }
    }
});

module.exports = app;
app.listen(PORT);
