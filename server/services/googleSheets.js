const axios = require('axios');

const SHEET_API_URL = process.env.GOOGLE_SHEET_URL;

/**
 * Helper: Normalize User Data
 * Converts flat Sheet columns back to nested objects for the App
 */
const normalizeUser = (user) => {
    if (!user) return null;
    return {
        ...user,
        // Ensure wallet object exists (default to 0 if missing)
        wallet: user.wallet || {
            withdrawable: Number(user.wallet_withdrawable || user.walletWithdrawable || 0),
            deposited: Number(user.wallet_deposited || user.walletDeposited || 0)
        }
    };
};

/**
 * Get all users from SheetDB
 */
const getAllUsers = async () => {
    try {
        if (!SHEET_API_URL) return [];
        const response = await axios.get(SHEET_API_URL);
        // Map raw sheet data to normalized user objects
        return response.data.map(normalizeUser);
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
 * Add user to SheetDB
 */
const addUser = async (userData) => {
    try {
        // Flatten nested objects for SheetDB columns
        const flatUser = {
            ...userData,
            wallet_withdrawable: 0,
            wallet_deposited: 0,
            createdAt: new Date().toISOString()
        };

        // Remove any unintentional nested objects before sending to Sheet
        delete flatUser.wallet;

        await axios.post(SHEET_API_URL, {
            data: [flatUser]
        });

        console.log('✅ User added to SheetDB:', flatUser.email);

        // Return normalized version for the App to use immediately
        return normalizeUser(flatUser);
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
