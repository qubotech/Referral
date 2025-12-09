import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import './Deposit.css';

const Deposit = () => {
    const navigate = useNavigate();
    const { showToast, Toast } = useToast();
    const [selectedPlan, setSelectedPlan] = useState(null);

    const plans = [
        {
            name: 'Starter',
            amount: 100,
            bonus: 50,
            features: ['Activate referral link', '₹50 per referral', 'Access to games']
        },
        {
            name: 'Popular',
            amount: 500,
            bonus: 250,
            featured: true,
            features: ['Activate referral link', '₹250 per referral', 'Access to games', 'Priority support']
        },
        {
            name: 'Premium',
            amount: 1000,
            bonus: 500,
            features: ['Activate referral link', '₹500 per referral', 'Access to games', 'VIP support', 'Bonus rewards']
        }
    ];

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        sessionStorage.setItem('selectedPlan', JSON.stringify(plan));
        navigate('/payment');
    };

    return (
        <div className="deposit-container">
            <Toast />
            <div className="deposit-header">
                <h2>Choose Your Plan</h2>
                <p>Select an initial deposit to activate your referral link</p>
            </div>

            <div className="deposit-plans">
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className={`plan-card ${plan.featured ? 'featured' : ''}`}
                        onClick={() => handleSelectPlan(plan)}
                    >
                        <div className={`plan-badge ${plan.featured ? 'popular' : ''}`}>
                            {plan.featured ? 'Popular' : plan.name}
                        </div>
                        <div className="plan-amount">₹{plan.amount}</div>
                        <ul className="plan-features">
                            {plan.features.map((feature, i) => (
                                <li key={i}>✓ {feature}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Deposit;
