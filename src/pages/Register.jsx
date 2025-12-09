import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../hooks/useToast';
import Input from '../components/Input';
import Button from '../components/Button';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useApp();
    const { showToast, Toast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        referredBy: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.phone || !formData.password) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        // Map frontend 'referredBy' to backend 'referralCode'
        const payload = {
            ...formData,
            referralCode: formData.referredBy
        };

        const result = await register(payload);

        if (result.success) {
            showToast('Account created successfully!', 'success');
            setTimeout(() => navigate('/profile-setup'), 500);
        } else {
            showToast(result.error || 'Registration failed', 'error');
        }
    };

    return (
        <div className="auth-container">
            <Toast />
            <div className="auth-header">
                <div className="logo-container">
                    <div className="logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <h1 className="logo-text">ReferEarn</h1>
                </div>
                <p className="tagline">Grow Your Network, Grow Your Wealth</p>
            </div>

            <div className="auth-form">
                <h2>Create Account</h2>
                <p className="form-subtitle">Join thousands earning daily</p>

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Full Name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                    />

                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                    />

                    <Input
                        label="Phone Number"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create password"
                        required
                    />

                    <Input
                        label="Referral Code (Optional)"
                        type="text"
                        name="referredBy"
                        value={formData.referredBy}
                        onChange={handleChange}
                        placeholder="REFER123"
                    />

                    <Button type="submit" fullWidth>
                        Create Account
                    </Button>
                </form>

                <p className="form-toggle">
                    Already have an account?{' '}
                    <a href="#" onClick={() => navigate('/login')}>
                        Sign In
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;
