const axios = require('axios');

const SHEET_API_URL = process.env.GOOGLE_SHEET_URL;

/**
 * Get all users from SheetDB
 */
const getAllUsers = async () => {
    try {
        if (!SHEET_API_URL) return [];
        const response = await axios.get(SHEET_API_URL);
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching SheetDB:', error.message);
        return [];
    }
};

/**
 * Find user by email
 */
const findUserByEmail = async (email) => {
    const users = await getAllUsers();
    return users.find(user => user.email?.toLowerCase() === email.toLowerCase());
};

/**
 * Find user by referral code
 */
const findUserByReferralCode = async (referralCode) => {
    const users = await getAllUsers();
    return users.find(user => user.referralCode === referralCode);
};

/**
 * Find user by ID
 */
const findUserById = async (id) => {
    const users = await getAllUsers();
    return users.find(user => user.id === id);
};

/**
 * Add user to SheetDB (Reading & Writing now supported!)
 */
const addUser = async (userData) => {
    try {
        // SheetDB expects { data: [ { ... } ] }
        // Adding createdAt timestamp
        const newUser = {
            ...userData,
            createdAt: new Date().toISOString()
        };

        await axios.post(SHEET_API_URL, {
            data: [newUser]
        });

        console.log('✅ User added to SheetDB:', newUser.email);
        return newUser;
    } catch (error) {
        console.error('❌ Error adding user to SheetDB:', error.message);
        throw new Error('Failed to save user to database');
    }
};

module.exports = {
    getAllUsers,
    findUserByEmail,
    findUserByReferralCode,
    findUserById,
    addUser,
};
