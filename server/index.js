require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json()); // Allow sending JSON data
app.use(cors()); // Allow React app to communicate

// Routes
app.use('/api/auth', require('./routes/auth'));

// Database Connection - Using Google Sheets instead of MongoDB
console.log('📊 Using Google Sheets as database');
console.log('📍 Sheet URL:', process.env.GOOGLE_SHEET_URL ? '✅ Configured' : '❌ Not configured');



// Basic Route
app.get('/', (req, res) => {
    res.send('ReferEarn Backend is Running!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
