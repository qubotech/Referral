import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../hooks/useToast';
import Input from '../components/Input';
import Button from '../components/Button';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useApp();
    const { showToast, Toast } = useToast();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        const result = await login(formData.email, formData.password);

        if (result.success) {
            showToast('Welcome back!', 'success');
            navigate('/dashboard');
        } else {
            showToast(result.error || 'Login failed', 'error');
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
                <h2>Welcome Back!</h2>
                <p className="form-subtitle">Sign in to continue earning</p>

                <form onSubmit={handleSubmit}>
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
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        required
                    />

                    <Button type="submit" fullWidth>
                        Sign In
                    </Button>
                </form>

                <p className="form-toggle">
                    Don't have an account?{' '}
                    <a href="#" onClick={() => navigate('/register')}>
                        Register Now
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
