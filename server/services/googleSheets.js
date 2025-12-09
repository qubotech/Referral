const axios = require('axios');

// Simple Google Sheets integration - no authentication needed!
// Just make your sheet public and paste the link

const SHEET_URL = process.env.GOOGLE_SHEET_URL;

/**
 * Parse CSV data from Google Sheets
 */
const parseCSV = (csv) => {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((header, index) => {
            obj[header.trim()] = values[index]?.trim() || '';
        });
        return obj;
    });
};

/**
 * Get all users from Google Sheet
 */
const getAllUsers = async () => {
    try {
        if (!SHEET_URL) {
            console.warn('⚠️ Google Sheet URL not configured');
            return [];
        }

        // Convert Google Sheets URL to CSV export URL
        const csvUrl = SHEET_URL.replace('/edit#gid=', '/export?format=csv&gid=')
            .replace('/edit?usp=sharing', '/export?format=csv');

        const response = await axios.get(csvUrl);
        const users = parseCSV(response.data);

        return users.map((user, index) => ({
            rowNumber: index + 2,
            ...user
        }));
    } catch (error) {
        console.error('❌ Error fetching Google Sheet:', error.message);
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
 * Add user - For now, just log (can't write to public sheet)
 * You'll need to manually add users or use Google Forms
 */
const addUser = async (userData) => {
    console.log('⚠️ New user registration (add to Google Sheet manually):', {
        name: userData.name,
        email: userData.email,
        referralCode: userData.referralCode
    });

    // Return user data as if it was saved
    return {
        ...userData,
        createdAt: new Date().toISOString()
    };
};

module.exports = {
    getAllUsers,
    findUserByEmail,
    findUserByReferralCode,
    findUserById,
    addUser,
};
