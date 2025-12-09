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

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/referearn';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected (Real Database)'))
    .catch(err => console.error('❌ Database Connection Error:', err));

// Basic Route
app.get('/', (req, res) => {
    res.send('ReferEarn Backend is Running!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
