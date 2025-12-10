const API_URL = import.meta.env.PROD
    ? 'https://referral-eight.vercel.app/api'
    : 'http://localhost:5000/api';

// API Helper
const api = async (endpoint, method = 'GET', data = null) => {
    const token = localStorage.getItem('token');

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };

    if (data) options.body = JSON.stringify(data);

    const response = await fetch(`${API_URL}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) throw new Error(result.msg || 'Something went wrong');

    return result;
};

// Auth Services
export const register = async (userData) => {
    const result = await api('/auth/register', 'POST', userData);
    if (result.token) localStorage.setItem('token', result.token);
    return result;
};

export const login = async (email, password) => {
    const result = await api('/auth/login', 'POST', { email, password });
    if (result.token) localStorage.setItem('token', result.token);
    return result;
};

export const loadUser = async () => {
    return await api('/auth/me', 'GET');
};

export const logout = () => {
    localStorage.removeItem('token');
};
