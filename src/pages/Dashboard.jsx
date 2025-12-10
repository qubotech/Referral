import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../hooks/useToast';
import Button from '../components/Button';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const {
        user,
        referralTasks,
        currentTaskLevel,
        teamMembers,
        addReferral,
        logout,
        transactions,
        withdraw
    } = useApp();
    const { showToast, Toast } = useToast();
    const [activeTab, setActiveTab] = useState('home');

    // Wallet state
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [bankDetails, setBankDetails] = useState({ account: '', ifsc: '' });

    useEffect(() => {
        if (user && !user.hasDeposited) {
            navigate('/deposit');
        }
    }, [user, navigate]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                const name = addReferral();
                if (name) {
                    showToast(`+₹${user.wallet.withdrawable} - ${name} joined your team!`, 'success');
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [addReferral, showToast, user]);

    if (!user) return null;

    const currentTask = referralTasks[currentTaskLevel];
    const progress = currentTask ?
        (currentTask.required === -1 ? 100 : (currentTask.completed / currentTask.required) * 100) : 0;

    const copyReferralLink = () => {
        const link = `https://referearn.app/ref/${user.referralCode}`;
        navigator.clipboard.writeText(link);
        showToast('Referral link copied!', 'success');
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/login');
        }
    };

    const handleWithdraw = () => {
        const result = withdraw(parseFloat(withdrawAmount), bankDetails);
        if (result.success) {
            showToast('Withdrawal request submitted!', 'success');
            setIsWithdrawModalOpen(false);
            setWithdrawAmount('');
            setBankDetails({ account: '', ifsc: '' });
        } else {
            showToast(result.error, 'error');
        }
    };

    const playGameButton = () => {
        // Always show button, but disable if not unlocked
        const unlocked = currentTask.required !== -1 && currentTask.completed >= currentTask.required;
        const className = unlocked ? "mt-md" : "mt-md opacity-50";

        return (
            <Button
                fullWidth
                onClick={() => unlocked ? navigate('/games') : showToast("Identify more people to unlock games!", "info")}
                className={className}
                variant={unlocked ? 'primary' : 'secondary'}
            >
                {unlocked ? '🎮 Play Games & Earn' : '🔒 Unlock Games (Refer More)'}
            </Button>
        )
    }

    return (
        <div className="dashboard">
            <Toast />

            {/* Header */}
            <header className="app-header">
                <div className="header-content">
                    <div className="header-left">
                        <h1 className="app-title">ReferEarn</h1>
                        <p className="user-greeting">Welcome, {user.name}!</p>
                    </div>
                    <div className="header-right">
                        <button className="btn-icon">
                            <span className="notification-badge">3</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                        </button>
                        <button className="btn-icon" onClick={handleLogout}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="app-main">

                {/* --- HOME TAB --- */}
                {activeTab === 'home' && (
                    <div className="tab-content active">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon earnings">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="12" y1="1" x2="12" y2="23"></line>
                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <p className="stat-label">Total Earnings</p>
                                    <h3 className="stat-value">₹{user.wallet.withdrawable}</h3>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon team">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    </svg>
                                </div>
                                <div className="stat-info">
                                    <p className="stat-label">Team Size</p>
                                    <h3 className="stat-value">{teamMembers.length}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="current-task-card">
                            <div className="task-header">
                                <h3>Current Mission</h3>
                                <span className="task-level">
                                    Level {currentTask ? currentTask.level : 'Complete'}
                                </span>
                            </div>
                            <div className="task-progress">
                                <div className="progress-info">
                                    <p className="task-description">
                                        {currentTask
                                            ? currentTask.required === -1
                                                ? 'Unlimited referrals - Keep growing!'
                                                : `Refer ${currentTask.required} ${currentTask.required === 1 ? 'person' : 'people'} to unlock games`
                                            : 'All levels complete!'}
                                    </p>
                                    <p className="task-status">
                                        {currentTask
                                            ? `${currentTask.completed} / ${currentTask.required === -1 ? '∞' : currentTask.required} completed`
                                            : 'Keep earning!'}
                                    </p>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>

                            {/* Action Button: Share or Play Games */}
                            {playGameButton() || (
                                <Button fullWidth onClick={copyReferralLink} disabled={!currentTask?.unlocked}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                        <polyline points="16 6 12 2 8 6"></polyline>
                                        <line x1="12" y1="2" x2="12" y2="15"></line>
                                    </svg>
                                    {currentTask?.unlocked ? 'Share Referral Link' : 'Locked'}
                                </Button>
                            )}
                        </div>

                        <div className="referral-link-card">
                            <p className="card-label">Your Referral Link</p>
                            <div className="link-box">
                                <input
                                    type="text"
                                    value={`https://referearn.app/ref/${user.referralCode}`}
                                    readOnly
                                />
                                <button className="btn-copy" onClick={copyReferralLink}>Copy</button>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="quick-actions">
                            <button className="action-btn" onClick={() => navigate('/games')}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                                    <polyline points="17 2 12 7 7 2"></polyline>
                                </svg>
                                <span>Play Games</span>
                            </button>
                            <button className="action-btn" onClick={() => setActiveTab('wallet')}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                    <line x1="1" y1="10" x2="23" y2="10"></line>
                                </svg>
                                <span>Wallet</span>
                            </button>
                            <button className="action-btn" onClick={() => setActiveTab('team')}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                </svg>
                                <span>My Team</span>
                            </button>
                        </div>
                    </div>
                )}


                {/* --- TEAM TAB --- */}
                {activeTab === 'team' && (
                    <div className="tab-content active">
                        <div className="tab-header mb-lg">
                            <h2>My Team</h2>
                            <p className="text-secondary">People you've referred</p>
                        </div>

                        <div className="team-stats mb-xl">
                            <div className="team-stat">
                                <span className="stat-number gradient-text">{teamMembers.length}</span>
                                <span className="stat-label">Direct Referrals</span>
                            </div>
                            <div className="team-stat">
                                <span className="stat-number gradient-text">{teamMembers.length}</span>
                                <span className="stat-label">Total Team</span>
                            </div>
                        </div>

                        <div className="team-list">
                            {teamMembers.length === 0 ? (
                                <div className="empty-state">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    </svg>
                                    <p>No team members yet</p>
                                    <p className="empty-subtitle">Start referring to build your team</p>
                                </div>
                            ) : (
                                teamMembers.map((member) => (
                                    <div key={member.id} className="team-member">
                                        <div className="member-avatar">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="member-info">
                                            <div className="member-name">{member.name}</div>
                                            <div className="member-date">Joined {new Date(member.joinDate).toLocaleDateString()}</div>
                                        </div>
                                        <span className="member-status">{member.status}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}


                {/* --- WALLET TAB --- */}
                {activeTab === 'wallet' && (
                    <div className="tab-content active">
                        <div className="tab-header mb-lg">
                            <h2>My Wallet</h2>
                            <p className="text-secondary">Manage your earnings</p>
                        </div>

                        <div className="wallet-balance-card">
                            <p className="balance-label">Available Balance</p>
                            <h2 className="balance-amount">₹{user.wallet.withdrawable}</h2>
                            <div className="balance-actions">
                                <Button onClick={() => setIsWithdrawModalOpen(true)} className="btn-white">Withdraw</Button>
                                <Button variant="secondary" className="btn-transparent">Add Funds</Button>
                            </div>
                        </div>

                        <div className="wallet-info">
                            <div className="info-row">
                                <span>Initial Deposit</span>
                                <span>₹{user.wallet.deposited}</span>
                            </div>
                            <div className="info-row">
                                <span>Withdrawable Amount</span>
                                <span className="highlight">₹{user.wallet.withdrawable}</span>
                            </div>
                        </div>

                        <h3 className="section-title">Transaction History</h3>
                        <div className="transaction-list">
                            {transactions.length === 0 ? (
                                <div className="empty-state">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="12" y1="1" x2="12" y2="23"></line>
                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                    </svg>
                                    <p>No transactions yet</p>
                                </div>
                            ) : (
                                transactions.map(t => (
                                    <div key={t.id} className="transaction-item">
                                        <div className="transaction-info">
                                            <h4>{t.type}</h4>
                                            <p className="transaction-date">{new Date(t.date).toLocaleDateString()}</p>
                                            <p className="transaction-desc">{t.description}</p>
                                        </div>
                                        <div className={`transaction-amount ${t.direction}`}>
                                            {t.direction === 'credit' ? '+' : '-'}₹{t.amount}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Demo Helper */}
                <div className="demo-helper mt-xl">
                    <p>💡 <strong>Testing tip:</strong> Press <kbd>Ctrl + R</kbd> to simulate a referral</p>
                </div>

            </main>

            {/* Bottom Navigation */}
            <nav className="bottom-nav">
                <button
                    className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
                    onClick={() => setActiveTab('home')}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span>Home</span>
                </button>
                <button
                    className={`nav-item ${activeTab === 'team' ? 'active' : ''}`}
                    onClick={() => setActiveTab('team')}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>Team</span>
                </button>
                <button
                    className={`nav-item ${activeTab === 'wallet' ? 'active' : ''}`}
                    onClick={() => setActiveTab('wallet')}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    <span>Wallet</span>
                </button>
            </nav>

            {/* Withdraw Modal */}
            {isWithdrawModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Withdraw Funds</h3>
                            <button className="modal-close" onClick={() => setIsWithdrawModalOpen(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="text-center mb-lg">
                                <p className="text-secondary">Available Balance</p>
                                <h1 className="text-gradient">₹{user.wallet.withdrawable}</h1>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Amount</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Enter amount"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Account Number</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter account number"
                                    value={bankDetails.account}
                                    onChange={(e) => setBankDetails({ ...bankDetails, account: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">IFSC Code</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter IFSC"
                                    value={bankDetails.ifsc}
                                    onChange={(e) => setBankDetails({ ...bankDetails, ifsc: e.target.value })}
                                />
                            </div>
                            <Button fullWidth onClick={handleWithdraw}>Confirm Withdrawal</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
