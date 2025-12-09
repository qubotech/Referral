import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../hooks/useToast';
import Button from '../components/Button';
import Input from '../components/Input';
import './ProfileSetup.css';

const ProfileSetup = () => {
    const navigate = useNavigate();
    const { user, updateProfile } = useApp();
    const { showToast, Toast } = useToast();
    const [formData, setFormData] = useState({
        avatar: user?.profile?.avatar || '👤',
        bio: user?.profile?.bio || '',
        city: user?.profile?.city || ''
    });

    const avatars = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓'];

    const selectAvatar = () => {
        const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
        setFormData({ ...formData, avatar: randomAvatar });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile(formData);
        showToast('Profile completed!', 'success');
        setTimeout(() => navigate('/deposit'), 500);
    };

    return (
        <div className="profile-setup-container">
            <Toast />
            <div className="setup-header">
                <h2>Complete Your Profile</h2>
                <p>Tell us a bit more about yourself</p>
            </div>

            <div className="profile-avatar-section">
                <div className="avatar-placeholder">
                    <div style={{ fontSize: '3rem' }}>{formData.avatar}</div>
                </div>
                <Button variant="secondary" size="sm" onClick={selectAvatar}>
                    Choose Avatar
                </Button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea
                        className="form-textarea"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        rows="3"
                    />
                </div>

                <Input
                    label="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Your city"
                />

                <Button type="submit" fullWidth>
                    Continue to Deposit
                </Button>
            </form>
        </div>
    );
};

export default ProfileSetup;
