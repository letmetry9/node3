const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/gold-price', async (req, res) => {
    try {
        // Fetching list of recent prices
        const response = await axios.get('https://logam-mulia-api.vercel.app/prices/antam');
        
        // Data contains an array of recent updates
        const history = response.data.data; 
        const latest = history[0];

        res.json({
            success: true,
            current: {
                price: latest.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }),
                date: latest.date
            },
            history: history.slice(0, 10) // Send the last 10 updates
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Gagal mengambil data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
