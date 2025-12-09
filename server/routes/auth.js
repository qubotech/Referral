const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const {
    findUserByEmail,
    findUserByReferralCode,
    findUserById,
    addUser,
} = require('../services/googleSheets');
const router = express.Router();

// HELPER: Generate Referral Code
const generateCode = () => 'REF' + Math.random().toString(36).substr(2, 6).toUpperCase();

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, referralCode } = req.body;

        // 1. Check if user exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // 2. Validate Referral Code (Real Logic)
        let referrer = null;
        if (referralCode) {
            referrer = await findUserByReferralCode(referralCode);
            if (!referrer) {
                return res.status(400).json({ msg: 'Invalid referral code' });
            }
        }

        // 3. Encrypt Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create User
        const newUserCode = generateCode();
        const userId = uuidv4(); // Generate unique ID

        const userData = {
            id: userId,
            name,
            email,
            password: hashedPassword,
            referralCode: newUserCode,
            referredBy: referrer ? referrer.referralCode : '',
        };

        // 5. Save to Google Sheets
        const savedUser = await addUser(userData);

        // 6. Create Token
        const payload = { user: { id: savedUser.id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;

                // Return user without password
                const { password, ...userWithoutPassword } = savedUser;
                res.json({ token, user: userWithoutPassword });
            }
        );
    } catch (err) {
        console.error('Register Error:', err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check User
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 2. Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 3. Return Token
        const payload = { user: { id: user.id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;

                // Return user without password
                const { password, ...userWithoutPassword } = user;
                res.json({ token, user: userWithoutPassword });
            }
        );
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

const auth = require('../middleware/auth');

// @route   GET /api/auth/me
// @desc    Get logged in user
router.get('/me', auth, async (req, res) => {
    try {
        const user = await findUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Return user without password
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (err) {
        console.error('Get Me Error:', err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

module.exports = router;
