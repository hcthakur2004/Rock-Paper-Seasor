import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

const INITIAL_STATS = {
  totalGames: 0,
  wins: 0,
  losses: 0,
  ties: 0,
  moveHistory: [],
  mostUsedMove: null,
  winStreak: 0,
  maxWinStreak: 0,
  timeAttackHighScore: 0,
};

const COMPUTER_MESSAGES = {
  win: [
    "I saw that coming!",
    "Just as planned!",
    "You're getting predictable!",
    "Better luck next time!",
  ],
  lose: [
    "Well played!",
    "You got me there!",
    "Impressive move!",
    "I didn't see that coming!",
  ],
  tie: [
    "Great minds think alike!",
    "This is getting interesting!",
    "We're evenly matched!",
    "Let's go again!",
  ],
};

export const GameProvider = ({ children }) => {
  // Game Settings
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('playerName') || 'Player');
  const [playerAvatar, setPlayerAvatar] = useState(() => localStorage.getItem('playerAvatar') || '1');
  const [computerAvatar, setComputerAvatar] = useState(() => Math.floor(Math.random() * 5 + 1).toString());
  const [gameMode, setGameMode] = useState('easy');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('soundEnabled') !== 'false');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [colorBlindMode, setColorBlindMode] = useState(false);

  // Game State
  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem('gameStats');
    return savedStats ? JSON.parse(savedStats) : INITIAL_STATS;
  });
  const [timeAttack, setTimeAttack] = useState({
    active: false,
    timeLeft: 30,
    score: 0,
  });
  const [computerMessage, setComputerMessage] = useState('');

  // AI Logic
  const predictNextMove = (moveHistory) => {
    if (moveHistory.length < 5) return null;
    
    const lastFiveMoves = moveHistory.slice(-5);
    const moveCounts = lastFiveMoves.reduce((acc, move) => {
      acc[move] = (acc[move] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(moveCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
  };

  const getComputerMove = (playerHistory) => {
    const moves = ['rock', 'paper', 'scissors'];
    
    switch (gameMode) {
      case 'easy':
        return moves[Math.floor(Math.random() * moves.length)];
      
      case 'medium': {
        const prediction = predictNextMove(playerHistory);
        if (prediction) {
          const counters = {
            rock: 'paper',
            paper: 'scissors',
            scissors: 'rock'
          };
          return Math.random() < 0.7 ? counters[prediction] : moves[Math.floor(Math.random() * moves.length)];
        }
        return moves[Math.floor(Math.random() * moves.length)];
      }
      
      case 'hard':
        // 30% chance to "cheat" by waiting for player's move
        return Math.random() < 0.3 ? 'waiting' : moves[Math.floor(Math.random() * moves.length)];
      
      default:
        return moves[Math.floor(Math.random() * moves.length)];
    }
  };

  const determineWinner = (playerMove, computerMove) => {
    if (playerMove === computerMove) return 'tie';
    if (
      (playerMove === 'rock' && computerMove === 'scissors') ||
      (playerMove === 'paper' && computerMove === 'rock') ||
      (playerMove === 'scissors' && computerMove === 'paper')
    ) {
      return 'win';
    }
    return 'lose';
  };

  const updateStats = (result, playerMove) => {
    // Get the message first
    const message = COMPUTER_MESSAGES[result][Math.floor(Math.random() * COMPUTER_MESSAGES[result].length)];
    
    // Immediately handle voice feedback
    if (voiceEnabled && message) {
      try {
        const speech = new SpeechSynthesisUtterance(message);
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        window.speechSynthesis.speak(speech);
      } catch (error) {
        console.log('Voice synthesis failed:', error);
      }
    }

    // Update stats
    setStats(prev => {
      const newStats = {
        ...prev,
        totalGames: prev.totalGames + 1,
        [result + 's']: prev[result + 's'] + 1,
        moveHistory: [...prev.moveHistory, playerMove].slice(-20),
        winStreak: result === 'win' ? prev.winStreak + 1 : 0,
      };

      // Update most used move
      const moveCounts = newStats.moveHistory.reduce((acc, move) => {
        acc[move] = (acc[move] || 0) + 1;
        return acc;
      }, {});
      newStats.mostUsedMove = Object.entries(moveCounts)
        .sort((a, b) => b[1] - a[1])[0][0];

      // Update max win streak
      newStats.maxWinStreak = Math.max(newStats.winStreak, prev.maxWinStreak);

      return newStats;
    });

    // Update computer message
    setComputerMessage(message);
  };

  // Persistence
  useEffect(() => {
    localStorage.setItem('gameStats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('playerName', playerName);
  }, [playerName]);

  useEffect(() => {
    localStorage.setItem('playerAvatar', playerAvatar);
  }, [playerAvatar]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('soundEnabled', soundEnabled);
  }, [soundEnabled]);

  // Time Attack Mode
  useEffect(() => {
    let timer;
    if (timeAttack.active && timeAttack.timeLeft > 0) {
      timer = setInterval(() => {
        setTimeAttack(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (timeAttack.timeLeft === 0) {
      setTimeAttack(prev => ({
        ...prev,
        active: false,
        score: Math.max(prev.score, stats.timeAttackHighScore)
      }));
    }
    return () => clearInterval(timer);
  }, [timeAttack.active, timeAttack.timeLeft, stats.timeAttackHighScore]);

  const resetStats = () => {
    setStats(INITIAL_STATS);
  };

  const value = {
    playerName,
    setPlayerName,
    playerAvatar,
    setPlayerAvatar,
    computerAvatar,
    setComputerAvatar,
    gameMode,
    setGameMode,
    theme,
    setTheme,
    soundEnabled,
    setSoundEnabled,
    voiceEnabled,
    setVoiceEnabled,
    highContrastMode,
    setHighContrastMode,
    colorBlindMode,
    setColorBlindMode,
    stats,
    timeAttack,
    setTimeAttack,
    computerMessage,
    getComputerMove,
    determineWinner,
    updateStats,
    resetStats,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}; 