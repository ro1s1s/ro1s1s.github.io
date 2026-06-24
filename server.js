const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    const visitorIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log("Visitor IP: " + visitorIp);
    
    res.redirect('https://t.me/uUl8iPwh5iYTVk');
});

app.listen(PORT, () => {
    console.log("Server is running...");
});
