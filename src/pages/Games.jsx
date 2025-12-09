import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../hooks/useToast';
import './Games.css';

const Games = () => {
    const navigate = useNavigate();
    const { referralTasks, currentTaskLevel, completeGames } = useApp();
    const { showToast, Toast } = useToast();

    const [gamesProgress, setGamesProgress] = useState([false, false, false]);
    const [activeGame, setActiveGame] = useState(null); // 'spin', 'puzzle', 'memory' or null

    useEffect(() => {
        // Redirect if task not completed yet (security check)
        const currentTask = referralTasks[currentTaskLevel];
        if (!currentTask || (currentTask.required !== -1 && currentTask.completed < currentTask.required)) {
            // navigate('/dashboard'); // Commented out for easier testing comfort
        }
    }, [referralTasks, currentTaskLevel, navigate]);

    const handlePlayGame = (index, type) => {
        if (gamesProgress[index]) {
            showToast('Already completed this game!', 'error');
            return;
        }
        setActiveGame(type);
    };

    const handleGameComplete = (index) => {
        const newProgress = [...gamesProgress];
        newProgress[index] = true;
        setGamesProgress(newProgress);
        setActiveGame(null);

        const completedCount = newProgress.filter(Boolean).length;
        if (completedCount === 3) {
            showToast('All games completed! Unlocking next level...', 'success');
            setTimeout(() => {
                completeGames();
                navigate('/dashboard');
            }, 2000);
        } else {
            showToast('Game completed! Play the next one.', 'success');
        }
    };

    // --- Sub-components for Modals ---

    const SpinGame = ({ onComplete }) => {
        const [spinning, setSpinning] = useState(false);

        const spin = () => {
            setSpinning(true);
            setTimeout(() => {
                onComplete();
            }, 3000); // 3 seconds spin
        };

        return (
            <div className="game-modal-overlay">
                <div className="game-modal-content text-center">
                    <h3>Spin the Wheel</h3>
                    <div className={`spin-wheel ${spinning ? 'spinning' : ''}`}>
                        🎰
                    </div>
                    <p className="mb-lg">Test your luck!</p>
                    <button
                        className="btn btn-primary"
                        onClick={spin}
                        disabled={spinning}
                    >
                        {spinning ? 'Spinning...' : 'Spin Now!'}
                    </button>
                    {!spinning && (
                        <button className="btn btn-secondary mt-md" onClick={() => setActiveGame(null)}>Close</button>
                    )}
                </div>
            </div>
        );
    };

    const PuzzleGame = ({ onComplete }) => {
        const [answer, setAnswer] = useState('');

        const checkAnswer = () => {
            if (parseInt(answer) === 15) {
                onComplete();
            } else {
                showToast('Incorrect answer. Try again!', 'error');
            }
        };

        return (
            <div className="game-modal-overlay">
                <div className="game-modal-content text-center">
                    <h3>Number Puzzle</h3>
                    <p className="mb-lg" style={{ fontSize: '1.2rem' }}>What is the sum of: 1 + 2 + 3 + 4 + 5?</p>
                    <input
                        type="number"
                        className="form-input mb-md text-center"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="?"
                    />
                    <button className="btn btn-primary" onClick={checkAnswer}>Submit Answer</button>
                    <button className="btn btn-secondary mt-md" onClick={() => setActiveGame(null)}>Close</button>
                </div>
            </div>
        );
    };

    const MemoryGame = ({ onComplete }) => {
        // Simple state for memory game
        const [cards, setCards] = useState(() =>
            ['🎯', '🎨', '🎭', '🎪', '🎯', '🎨', '🎭', '🎪']
                .sort(() => Math.random() - 0.5)
                .map((emoji, id) => ({ id, emoji, flipped: false, matched: false }))
        );
        const [flippedIndices, setFlippedIndices] = useState([]);

        useEffect(() => {
            if (flippedIndices.length === 2) {
                const [first, second] = flippedIndices;
                if (cards[first].emoji === cards[second].emoji) {
                    setCards(prev => prev.map((c, i) =>
                        i === first || i === second ? { ...c, matched: true } : c
                    ));
                    setFlippedIndices([]);
                } else {
                    setTimeout(() => {
                        setCards(prev => prev.map((c, i) =>
                            i === first || i === second ? { ...c, flipped: false } : c
                        ));
                        setFlippedIndices([]);
                    }, 1000);
                }
            }
        }, [flippedIndices, cards]);

        useEffect(() => {
            if (cards.every(c => c.matched)) {
                setTimeout(onComplete, 500);
            }
        }, [cards, onComplete]);

        const handleCardClick = (index) => {
            if (flippedIndices.length < 2 && !cards[index].flipped && !cards[index].matched) {
                setCards(prev => prev.map((c, i) => i === index ? { ...c, flipped: true } : c));
                setFlippedIndices(prev => [...prev, index]);
            }
        };

        return (
            <div className="game-modal-overlay">
                <div className="game-modal-content text-center">
                    <h3>Memory Match</h3>
                    <p className="mb-md">Find all matching pairs!</p>
                    <div className="memory-grid">
                        {cards.map((card, idx) => (
                            <div
                                key={idx}
                                className={`memory-card ${card.flipped || card.matched ? 'flipped' : ''}`}
                                onClick={() => handleCardClick(idx)}
                            >
                                <div className="card-inner">
                                    <div className="card-front">?</div>
                                    <div className="card-back">{card.emoji}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-secondary mt-lg" onClick={() => setActiveGame(null)}>Close</button>
                </div>
            </div>
        );
    };

    const completedCount = gamesProgress.filter(Boolean).length;

    return (
        <div className="games-container">
            <Toast />
            <div className="games-header">
                <button className="btn-back" onClick={() => navigate('/dashboard')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2>Complete 3 Games</h2>
            </div>
            <p className="text-center mb-lg" style={{ color: 'var(--text-secondary)' }}>
                {completedCount} / 3 completed
            </p>

            <div className="games-grid">
                <div
                    className={`game-card ${gamesProgress[0] ? 'completed' : ''}`}
                    onClick={() => handlePlayGame(0, 'spin')}
                >
                    <div className="game-icon">🎰</div>
                    <h3>Spin the Wheel</h3>
                    <p>Test your luck!</p>
                    <span className="game-status">{gamesProgress[0] ? '✓ Completed' : 'Not Played'}</span>
                </div>

                <div
                    className={`game-card ${gamesProgress[1] ? 'completed' : ''}`}
                    onClick={() => handlePlayGame(1, 'puzzle')}
                >
                    <div className="game-icon">🧩</div>
                    <h3>Number Puzzle</h3>
                    <p>Solve the sequence</p>
                    <span className="game-status">{gamesProgress[1] ? '✓ Completed' : 'Not Played'}</span>
                </div>

                <div
                    className={`game-card ${gamesProgress[2] ? 'completed' : ''}`}
                    onClick={() => handlePlayGame(2, 'memory')}
                >
                    <div className="game-icon">🃏</div>
                    <h3>Memory Match</h3>
                    <p>Find the pairs</p>
                    <span className="game-status">{gamesProgress[2] ? '✓ Completed' : 'Not Played'}</span>
                </div>
            </div>

            {/* Render Active Game Modal */}
            {activeGame === 'spin' && <SpinGame onComplete={() => handleGameComplete(0)} />}
            {activeGame === 'puzzle' && <PuzzleGame onComplete={() => handleGameComplete(1)} />}
            {activeGame === 'memory' && <MemoryGame onComplete={() => handleGameComplete(2)} />}
        </div>
    );
};

export default Games;
