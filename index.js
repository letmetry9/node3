const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/gold-price', async (req, res) => {
    try {
        // We add 'headers' to pretend we are a real Chrome browser
        const response = await axios.get('https://logam-mulia-api.vercel.app/prices/antam', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            }
        });
        
        const history = response.data.data;
        const latest = history[0];

        res.json({
            success: true,
            current: {
                price: latest.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }),
                date: latest.date
            },
            history: history.slice(0, 10)
        });

    } catch (error) {
        console.error("API Error Details:", error.message);
        
        // This will print the REAL error to your screen so we can debug
        res.status(500).json({ 
            success: false, 
            message: "Gagal mengambil data", 
            error_details: error.message,
            status_code: error.response ? error.response.status : "N/A"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
