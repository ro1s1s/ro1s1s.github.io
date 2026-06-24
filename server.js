const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// ضع رابط قناتك الحقيقي على التليجرام هنا بين علامات التنصيص
const TELEGRAM_URL = "https://t.me/your_channel_name"; 

app.get('*', (req, res) => {
    // سحب الـ IP الحقيقي للزائر عبر السيرفر
    const visitorIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const logEntry = `Date: ${new Date().toISOString()} - IP: ${visitorIp}\n`;

    // حفظ الـ IP في ملف نصي سري على السيرفر
    fs.appendFile('visitors_log.txt', logEntry, (err) => {
        if (err) console.error("Error writing to file", err);
    });

    // تحويل الزائر فوراً وبشكل تلقائي إلى قناة التليجرام
    res.redirect(TELEGRAM_URL);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
