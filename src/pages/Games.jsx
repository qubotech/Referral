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
    const [activeGame, setActiveGame] = useState(null);

    // Secure redirection
    useEffect(() => {
        const currentTask = referralTasks[currentTaskLevel];
        // Allow access for testing, but in prod would check requirements
    }, [referralTasks, currentTaskLevel]);

    const handlePlayGame = (index, type) => {
        if (gamesProgress[index]) {
            showToast('Already completed this game!', 'custom-toast info'); // Custom style logic could be added
            return;
        }
        setActiveGame(type);
    };

    const handleGameComplete = (index) => {
        const newProgress = [...gamesProgress];
        newProgress[index] = true;
        setGamesProgress(newProgress);

        setTimeout(() => {
            setActiveGame(null);
            const completedCount = newProgress.filter(Boolean).length;
            if (completedCount === 3) {
                showToast('🎉 All Missions Complete! Unlocking Rewards...', 'success');
                setTimeout(() => {
                    completeGames();
                    navigate('/dashboard');
                }, 2000);
            } else {
                showToast('🌟 Game Won! Progress Saved.', 'success');
            }
        }, 1500); // Delay closing to show win state
    };

    /* --- GAME ENGINES --- */

    // 1. REAL SPIN WHEEL
    const SpinGame = ({ onComplete }) => {
        const [spinning, setSpinning] = useState(false);
        const [rotation, setRotation] = useState(0);

        const spin = () => {
            if (spinning) return;
            setSpinning(true);

            // Random spin between 5 and 10 full rotations (1800-3600 deg)
            const randomSpin = 1800 + Math.floor(Math.random() * 1800);
            const newRotation = rotation + randomSpin;

            setRotation(newRotation);

            setTimeout(() => {
                setSpinning(false);
                onComplete();
            }, 5000); // 5s spin duration matches CSS
        };

        return (
            <div className="game-modal-overlay">
                <div className="game-modal-content spin-theme">
                    <h3 className="game-title">Lucky Wheel</h3>

                    <div className="wheel-container">
                        <div className="wheel-pointer">▼</div>
                        <div
                            className="wheel"
                            style={{ transform: `rotate(${rotation}deg)` }}
                        >
                            <div className="wheel-segment seg-1"><span>💰</span></div>
                            <div className="wheel-segment seg-2"><span>💎</span></div>
                            <div className="wheel-segment seg-3"><span>🎁</span></div>
                            <div className="wheel-segment seg-4"><span>✨</span></div>
                            <div className="wheel-segment seg-5"><span>🎯</span></div>
                            <div className="wheel-segment seg-6"><span>🎲</span></div>
                        </div>
                        <div className="wheel-center"></div>
                    </div>

                    <p className="game-instruction">{spinning ? 'Good luck...' : 'Spin to Win!'}</p>

                    <button
                        className="btn-game-primary"
                        onClick={spin}
                        disabled={spinning}
                    >
                        {spinning ? 'Spinning...' : 'SPIN'}
                    </button>

                    {!spinning && <button className="btn-close-game" onClick={() => setActiveGame(null)}>Exit</button>}
                </div>
            </div>
        );
    };

    // 2. SLIDING PUZZLE (15-Puzzle style but 3x3)
    const PuzzleGame = ({ onComplete }) => {
        // Initial solved state: [1,2,3,4,5,6,7,8,null]
        // We shuffle by simulating valid moves to ensure solvability
        const [tiles, setTiles] = useState([1, 2, 3, 4, 5, 6, 7, 8, null]);
        const [isSolved, setIsSolved] = useState(false);

        useEffect(() => {
            shuffleBoard();
        }, []);

        const shuffleBoard = () => {
            let currentTiles = [1, 2, 3, 4, 5, 6, 7, 8, null];
            let emptyIdx = 8;
            let previousIdx = -1;

            // Simulate 100 random valid moves
            for (let i = 0; i < 100; i++) {
                const moves = getValidMoves(emptyIdx);
                // Don't modify previousIdx immediately to avoid simple backtracking loops
                const validMoves = moves.filter(idx => idx !== previousIdx);
                const nextIdx = validMoves[Math.floor(Math.random() * validMoves.length)] || moves[0];

                // Swap
                currentTiles[emptyIdx] = currentTiles[nextIdx];
                currentTiles[nextIdx] = null;
                previousIdx = emptyIdx;
                emptyIdx = nextIdx;
            }
            setTiles([...currentTiles]);
        };

        const getValidMoves = (emptyIdx) => {
            const moves = [];
            const row = Math.floor(emptyIdx / 3);
            const col = emptyIdx % 3;

            if (row > 0) moves.push(emptyIdx - 3); // Up
            if (row < 2) moves.push(emptyIdx + 3); // Down
            if (col > 0) moves.push(emptyIdx - 1); // Left
            if (col < 2) moves.push(emptyIdx + 1); // Right
            return moves;
        };

        const handleTileClick = (index) => {
            if (isSolved) return;

            const emptyIdx = tiles.indexOf(null);
            const validMoves = getValidMoves(emptyIdx);

            if (validMoves.includes(index)) {
                const newTiles = [...tiles];
                newTiles[emptyIdx] = newTiles[index];
                newTiles[index] = null;
                setTiles(newTiles);

                checkWin(newTiles);
            }
        };

        const checkWin = (currentTiles) => {
            const winState = [1, 2, 3, 4, 5, 6, 7, 8, null];
            const won = currentTiles.every((val, idx) => val === winState[idx]);
            if (won) {
                setIsSolved(true);
                setTimeout(onComplete, 1000);
            }
        };

        return (
            <div className="game-modal-overlay">
                <div className="game-modal-content puzzle-theme">
                    <h3 className="game-title">Number Slide</h3>
                    <p className="game-instruction">Order tiles 1 to 8</p>

                    <div className="puzzle-board">
                        {tiles.map((tile, idx) => (
                            <div
                                key={idx}
                                className={`puzzle-tile ${tile === null ? 'empty' : ''} ${isSolved ? 'solved' : ''}`}
                                onClick={() => handleTileClick(idx)}
                            >
                                {tile}
                            </div>
                        ))}
                    </div>

                    <button className="btn-close-game" onClick={() => setActiveGame(null)}>Exit</button>
                </div>
            </div>
        );
    };

    // 3. GLOSSY MEMORY MATCH
    const MemoryGame = ({ onComplete }) => {
        const [cards, setCards] = useState(() =>
            ['🦁', '🚀', '🌈', '🎸', '🦁', '🚀', '🌈', '🎸']
                .sort(() => Math.random() - 0.5)
                .map((emoji, id) => ({ id, emoji, flipped: false, matched: false }))
        );
        const [flippedIndices, setFlippedIndices] = useState([]);

        useEffect(() => {
            if (flippedIndices.length === 2) {
                const [first, second] = flippedIndices;
                if (cards[first].emoji === cards[second].emoji) {
                    setCards(prev => prev.map((c, i) => i === first || i === second ? { ...c, matched: true } : c));
                    setFlippedIndices([]);
                } else {
                    setTimeout(() => {
                        setCards(prev => prev.map((c, i) => i === first || i === second ? { ...c, flipped: false } : c));
                        setFlippedIndices([]);
                    }, 800);
                }
            }
        }, [flippedIndices, cards]);

        useEffect(() => {
            if (cards.every(c => c.matched)) setTimeout(onComplete, 800);
        }, [cards, onComplete]);

        const handleClick = (idx) => {
            if (flippedIndices.length < 2 && !cards[idx].flipped && !cards[idx].matched) {
                setCards(prev => prev.map((c, i) => i === idx ? { ...c, flipped: true } : c));
                setFlippedIndices(prev => [...prev, idx]);
            }
        };

        return (
            <div className="game-modal-overlay">
                <div className="game-modal-content memory-theme">
                    <h3 className="game-title">Memory Match</h3>
                    <div className="memory-grid-real">
                        {cards.map((card, idx) => (
                            <div
                                key={idx}
                                className={`memory-card-real ${card.flipped || card.matched ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
                                onClick={() => handleClick(idx)}
                            >
                                <div className="card-face card-front">?</div>
                                <div className="card-face card-back">{card.emoji}</div>
                            </div>
                        ))}
                    </div>
                    <button className="btn-close-game" onClick={() => setActiveGame(null)}>Exit</button>
                </div>
            </div>
        );
    };

    return (
        <div className="games-container">
            <Toast />
            <div className="games-header">
                <button className="btn-back" onClick={() => navigate('/dashboard')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                </button>
                <h2>Arcade Zone</h2>
            </div>

            <div className="games-progress-bar">
                <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${(gamesProgress.filter(Boolean).length / 3) * 100}%` }}></div>
                </div>
                <span>{gamesProgress.filter(Boolean).length}/3 Complete</span>
            </div>

            <div className="games-grid">
                <div className={`game-card-premium ${gamesProgress[0] ? 'done' : ''}`} onClick={() => handlePlayGame(0, 'spin')}>
                    <div className="card-bg spin-bg"></div>
                    <div className="card-content">
                        <span className="card-icon">🎰</span>
                        <h3>Lucky Spin</h3>
                        <p>Win Jackpot</p>
                        {gamesProgress[0] && <div className="check-badge">✓</div>}
                    </div>
                </div>

                <div className={`game-card-premium ${gamesProgress[1] ? 'done' : ''}`} onClick={() => handlePlayGame(1, 'puzzle')}>
                    <div className="card-bg puzzle-bg"></div>
                    <div className="card-content">
                        <span className="card-icon">🧩</span>
                        <h3>Slide Puzzle</h3>
                        <p>Brain Teaser</p>
                        {gamesProgress[1] && <div className="check-badge">✓</div>}
                    </div>
                </div>

                <div className={`game-card-premium ${gamesProgress[2] ? 'done' : ''}`} onClick={() => handlePlayGame(2, 'memory')}>
                    <div className="card-bg memory-bg"></div>
                    <div className="card-content">
                        <span className="card-icon">🃏</span>
                        <h3>Memory Pro</h3>
                        <p>Find Pairs</p>
                        {gamesProgress[2] && <div className="check-badge">✓</div>}
                    </div>
                </div>
            </div>

            {activeGame === 'spin' && <SpinGame onComplete={() => handleGameComplete(0)} />}
            {activeGame === 'puzzle' && <PuzzleGame onComplete={() => handleGameComplete(1)} />}
            {activeGame === 'memory' && <MemoryGame onComplete={() => handleGameComplete(2)} />}
        </div>
    );
};

export default Games;
