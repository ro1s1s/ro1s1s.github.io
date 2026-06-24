const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// هذا السطر يمسك الرابط عندما يكتب الزائر الكود في آخر الدومين الخاص بك
app.get('/uUl8iPwh5iYTVk', (req, res) => {
    // سحب الآي بي الخاص بالزائر
    const visitorIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log("Target Link Clicked! Visitor IP: " + visitorIp);
    
    // تحويل الزائر فوراً إلى رابط التليغرام الأصلي
    res.redirect('https://t.me/uUl8iPwh5iYTVk');
});

// صفحة احتياطية في حال دخل شخص على الدومين الرئيسي مباشرة بدون الكود
app.get('/', (req, res) => {
    res.send('Server is active.');
});

app.listen(PORT, () => {
    console.log("Server is running...");
});
