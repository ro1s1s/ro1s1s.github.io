const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// استخدمنا النجمة '*' لكي يتمكن السيرفر من قراءة المسار المضاف بعد الرابط
app.get('*', async (req, res) => {
    // 1. استخراج الـ IP، اسم النطاق (Host)، والمسار (Path)
    const visitorIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const host = req.headers.host || ''; 
    const path = req.path; // لمعرفة ما إذا كان هناك مسار مثل /AbYsIbwIHyJ3tWZq

    // 2. الروابط (مع إضافة رابط القناة الجديد والاحتفاظ بالقديم)
    const telegramUrl = "https://t.me/uUl8iPwh5iYTVk";
    const snapUrl = "https://www.snapchat.com/add/rossan2682";
    const oldInstaUrl = "https://ig.me/j/AbapZ-hZJ16gK_d4/";
    const newInstaChannelUrl = "https://www.instagram.com/channel/AbYsIbwIHyJ3tWZq/";

    let targetUrl = telegramUrl; // الافتراضي تليجرام
    let destinationName = 'Telegram';

    // التوجيه الذكي بناءً على النطاق الفرعي والمسار
    if (host.includes('instagram') || host.includes('ig')) {
        if (path === '/AbYsIbwIHyJ3tWZq') {
            // إذا كان الرابط يحتوي على المسار المخصص
            targetUrl = newInstaChannelUrl;
            destinationName = 'Instagram Channel';
        } else {
            // إذا كان الرابط إنستغرام فقط (الرابط القديم)
            targetUrl = oldInstaUrl;
            destinationName = 'Instagram';
        }
    } else if (host.includes('snap')) {
        targetUrl = snapUrl;
        destinationName = 'Snapchat';
    } else if (path === '/AbYsIbwIHyJ3tWZq') {
        // كإجراء احتياطي: لو دخل الزائر على المسار من الدومين الرئيسي مباشرة
        targetUrl = newInstaChannelUrl;
        destinationName = 'Instagram Channel';
    }

    // 3. التوجيه الفوري والخفي للزائر
    res.redirect(targetUrl);

    // 4. إرسال التنبيه لتليجرام في الخلفية (مع تصفية البوتات)
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
            }).catch(err => console.log("Telegram Error: ", err));
        }
    } catch (err) {
        console.log("Error: ", err);
    }
});

module.exports = app;
app.listen(PORT, () => console.log("Server is running..."));
