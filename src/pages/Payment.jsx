import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../hooks/useToast';
import Button from '../components/Button';
import './Payment.css';

const Payment = () => {
    const navigate = useNavigate();
    const { confirmDeposit } = useApp();
    const { showToast, Toast } = useToast();
    const [plan, setPlan] = useState(null);
    const [virtualAccount, setVirtualAccount] = useState({});

    useEffect(() => {
        const savedPlan = sessionStorage.getItem('selectedPlan');
        if (savedPlan) {
            const planData = JSON.parse(savedPlan);
            setPlan(planData);
            generateVirtualAccount();
        } else {
            navigate('/deposit');
        }
    }, []);

    const generateVirtualAccount = () => {
        setVirtualAccount({
            name: 'ReferEarn Services',
            number: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
            ifsc: 'KKBK0005678',
            upi: `ref${Math.random().toString(36).substring(2, 8)}@kotak`
        });
    };

    const copyText = (text) => {
        navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!', 'success');
    };

    const handleConfirmPayment = () => {
        if (plan) {
            confirmDeposit(plan.amount);
            sessionStorage.removeItem('selectedPlan');
            showToast('Payment confirmed! Start referring now!', 'success');
            setTimeout(() => navigate('/dashboard'), 1000);
        }
    };

    if (!plan) return null;

    return (
        <div className="payment-container">
            <Toast />
            <div className="payment-header">
                <button className="btn-back" onClick={() => navigate('/deposit')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2>Complete Payment</h2>
            </div>

            <div className="payment-summary">
                <div className="summary-row">
                    <span>Selected Plan</span>
                    <span>{plan.name}</span>
                </div>
                <div className="summary-row">
                    <span>Amount</span>
                    <span>₹{plan.amount}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                    <span>Total Payable</span>
                    <span>₹{plan.amount}</span>
                </div>
            </div>

            <div className="payment-info">
                <p className="info-text">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    For security, use the account details shown below
                </p>
            </div>

            <div className="bank-details">
                <h3>Transfer to:</h3>
                <div className="detail-row">
                    <span className="label">Account Name</span>
                    <span className="value">{virtualAccount.name}</span>
                    <button className="copy-btn" onClick={() => copyText(virtualAccount.name)}>Copy</button>
                </div>
                <div className="detail-row">
                    <span className="label">Account Number</span>
                    <span className="value">{virtualAccount.number}</span>
                    <button className="copy-btn" onClick={() => copyText(virtualAccount.number)}>Copy</button>
                </div>
                <div className="detail-row">
                    <span className="label">IFSC Code</span>
                    <span className="value">{virtualAccount.ifsc}</span>
                    <button className="copy-btn" onClick={() => copyText(virtualAccount.ifsc)}>Copy</button>
                </div>
                <div className="detail-row">
                    <span className="label">UPI ID</span>
                    <span className="value">{virtualAccount.upi}</span>
                    <button className="copy-btn" onClick={() => copyText(virtualAccount.upi)}>Copy</button>
                </div>
            </div>

            <div className="payment-actions">
                <Button fullWidth onClick={handleConfirmPayment}>
                    I've Made the Payment
                </Button>
                <Button variant="secondary" fullWidth onClick={() => navigate('/deposit')}>
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default Payment;
