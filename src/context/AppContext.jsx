import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api'; // Import API Service

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [referralTasks, setReferralTasks] = useState([
        { level: 1, required: 1, completed: 0, unlocked: false, gamesCompleted: false },
        { level: 2, required: 6, completed: 0, unlocked: false, gamesCompleted: false },
        { level: 3, required: 12, completed: 0, unlocked: false, gamesCompleted: false },
        { level: 4, required: 18, completed: 0, unlocked: false, gamesCompleted: false },
        { level: 5, required: -1, completed: 0, unlocked: false, gamesCompleted: false }
    ]);
    const [currentTaskLevel, setCurrentTaskLevel] = useState(0);
    const [teamMembers, setTeamMembers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [bonusPerReferral, setBonusPerReferral] = useState(0);

    // Load User from API on mount
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await api.loadUser();
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to load user', error);
                    localStorage.removeItem('token');
                }
            }
        };
        fetchUser();
    }, []);

    // Save strictly local state (Tasks/Transactions) if needed
    // But for Real App, these should also be in DB. 
    // We will keep them local for now until we build those endpoints.

    const login = async (email, password) => {
        try {
            const data = await api.login(email, password);
            setUser(data.user);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (userData) => {
        try {
            const data = await api.register(userData);
            setUser(data.user);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        api.logout(); // Clear token
        setUser(null);
        setReferralTasks([
            { level: 1, required: 1, completed: 0, unlocked: false, gamesCompleted: false },
            { level: 2, required: 6, completed: 0, unlocked: false, gamesCompleted: false },
            { level: 3, required: 12, completed: 0, unlocked: false, gamesCompleted: false },
            { level: 4, required: 18, completed: 0, unlocked: false, gamesCompleted: false },
            { level: 5, required: -1, completed: 0, unlocked: false, gamesCompleted: false }
        ]);
        setCurrentTaskLevel(0);
        setTeamMembers([]);
        setTransactions([]);
        setBonusPerReferral(0);
        localStorage.removeItem('referralAppState'); // Clean up old data if any
    };

    const updateProfile = (profileData) => {
        setUser(prev => ({
            ...prev,
            profile: { ...prev.profile, ...profileData }
        }));
    };

    const confirmDeposit = (amount) => {
        const bonus = amount === 100 ? 50 : amount === 500 ? 250 : 500;

        setUser(prev => ({
            ...prev,
            hasDeposited: true,
            depositAmount: amount,
            wallet: {
                ...prev.wallet,
                deposited: amount
            }
        }));

        setBonusPerReferral(bonus);

        // Unlock first task
        setReferralTasks(prev => {
            const updated = [...prev];
            updated[0].unlocked = true;
            return updated;
        });

        addTransaction('Deposit', amount, 'debit', 'Initial deposit');
    };

    const addReferral = (name = null) => {
        const names = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Gupta', 'Vikas Singh', 'Anjali Reddy'];
        const memberName = name || names[Math.floor(Math.random() * names.length)];

        const newMember = {
            id: 'MEMBER' + Date.now(),
            name: memberName,
            joinDate: new Date().toISOString(),
            status: 'Active'
        };

        setTeamMembers(prev => [...prev, newMember]);

        // Update current task
        const currentTask = referralTasks[currentTaskLevel];
        if (currentTask && currentTask.unlocked) {
            setReferralTasks(prev => {
                const updated = [...prev];
                updated[currentTaskLevel].completed++;
                return updated;
            });

            // Add referral bonus
            setUser(prev => ({
                ...prev,
                wallet: {
                    ...prev.wallet,
                    total: prev.wallet.total + bonusPerReferral,
                    withdrawable: prev.wallet.withdrawable + bonusPerReferral
                }
            }));

            addTransaction('Referral Bonus', bonusPerReferral, 'credit', `From ${memberName}`);

            return memberName;
        }
    };

    const completeGames = () => {
        const currentTask = referralTasks[currentTaskLevel];
        if (!currentTask) return;

        setReferralTasks(prev => {
            const updated = [...prev];
            updated[currentTaskLevel].gamesCompleted = true;
            return updated;
        });

        // Unlock next level
        if (currentTaskLevel < referralTasks.length - 1) {
            setCurrentTaskLevel(prev => prev + 1);
            setReferralTasks(prev => {
                const updated = [...prev];
                updated[currentTaskLevel + 1].unlocked = true;
                return updated;
            });
        }
    };

    const addTransaction = (type, amount, direction, description) => {
        const transaction = {
            id: 'TXN' + Date.now(),
            type,
            amount,
            direction,
            description,
            date: new Date().toISOString()
        };
        setTransactions(prev => [transaction, ...prev]);
    };

    const withdraw = (amount, bankDetails) => {
        if (amount > user.wallet.withdrawable) {
            return { success: false, error: 'Insufficient balance' };
        }

        if (amount < 100) {
            return { success: false, error: 'Minimum withdrawal is ₹100' };
        }

        setUser(prev => ({
            ...prev,
            wallet: {
                ...prev.wallet,
                total: prev.wallet.total - amount,
                withdrawable: prev.wallet.withdrawable - amount
            }
        }));

        addTransaction('Withdrawal', amount, 'debit', `To account ${bankDetails.account.slice(-4)}`);

        return { success: true };
    };

    const generateReferralCode = () => {
        return 'REF' + Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    const value = {
        user,
        referralTasks,
        currentTaskLevel,
        teamMembers,
        transactions,
        bonusPerReferral,
        login,
        register,
        logout,
        updateProfile,
        confirmDeposit,
        addReferral,
        completeGames,
        addTransaction,
        withdraw
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
