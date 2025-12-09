const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    referralCode: { type: String, unique: true },
    referredBy: { type: String, default: null },

    // Real Wallet Logic
    wallet: {
        balance: { type: Number, default: 0 },
        deposited: { type: Number, default: 0 },
        withdrawable: { type: Number, default: 0 }
    },
    hasDeposited: { type: Boolean, default: false },

    // Game & Task Progression
    taskLevel: { type: Number, default: 0 },

    // Profile Data
    profile: {
        bio: { type: String, default: '' },
        city: { type: String, default: '' },
        avatar: { type: String, default: '' }
    },

    // Timestamps
    taskLevel: { type: Number, default: 0 },

    // Timestamps
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
