import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameContext } from '../context/GameContext';
import { Box, Grid, Paper, Typography, Avatar } from '@mui/material';
import confetti from 'canvas-confetti';

const GameBoard = () => {
  const {
    playerName,
    playerAvatar,
    computerAvatar,
    soundEnabled,
    voiceEnabled,
    getComputerMove,
    determineWinner,
    updateStats,
    computerMessage,
    timeAttack,
    setTimeAttack,
  } = useGameContext();

  const [playerMove, setPlayerMove] = useState(null);
  const [computerMove, setComputerMove] = useState(null);
  const [result, setResult] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Create audio contexts for sounds
  const playMoveSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      oscillator.connect(audioContext.destination);
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('Move sound failed:', error);
    }
  }, [soundEnabled]);

  const playWinSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      oscillator.connect(audioContext.destination);
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5 note
      oscillator.start();
      setTimeout(() => {
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5 note
      }, 100);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.log('Win sound failed:', error);
    }
  }, [soundEnabled]);

  const playLoseSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      oscillator.connect(audioContext.destination);
      oscillator.frequency.setValueAtTime(392.00, audioContext.currentTime); // G4 note
      oscillator.start();
      setTimeout(() => {
        oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime); // F4 note
      }, 100);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.log('Lose sound failed:', error);
    }
  }, [soundEnabled]);

  const moves = ['rock', 'paper', 'scissors'];

  const handleMove = async (move) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setPlayerMove(move);
    playMoveSound();

    // Get computer's move
    const compMove = getComputerMove(move);
    
    // Set computer's move
    setComputerMove(compMove);

    // Calculate result AFTER setting computer move
    const gameResult = determineWinner(move, compMove);
    setResult(gameResult);
    updateStats(gameResult, move);

    // Handle win/lose effects and update Time Attack score
    if (gameResult === 'win') {
      playWinSound();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Update Time Attack score if active
      if (timeAttack.active) {
        setTimeAttack(prev => ({
          ...prev,
          score: prev.score + 1
        }));
      }
    } else if (gameResult === 'lose') {
      playLoseSound();
    }

    // Voice feedback
    if (voiceEnabled && computerMessage) {
      try {
        const speech = new SpeechSynthesisUtterance(computerMessage);
        window.speechSynthesis.speak(speech);
      } catch (error) {
        console.log('Voice synthesis failed:', error);
      }
    }

    // Reset after delay
    setTimeout(() => {
      setIsAnimating(false);
      setPlayerMove(null);
      setComputerMove(null);
      setResult(null);
    }, 2000);
  };

  const getMoveEmoji = (move) => {
    switch (move) {
      case 'rock': return '✊';
      case 'paper': return '✋';
      case 'scissors': return '✌';
      default: return '❔';
    }
  };

  // Default avatar fallback
  const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iI2U4ZWFmNiIvPjxwYXRoIGQ9Ik0xMiA2YTIgMiAwIDEgMSAwIDQgMiAyIDAgMCAxIDAtNHptMCA2YTQgNCAwIDAgMSA0IDR2MmgtOHYtMmE0IDQgMCAwIDEgNC00eiIgZmlsbD0iIzVjNmJjMCIvPjwvc3ZnPg==';

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        {/* Player Side */}
        <Grid item xs={12} md={5} textAlign="center">
          <Avatar
            src={`/avatars/${playerAvatar}.png`}
            alt={playerName}
            sx={{ width: 80, height: 80, margin: '0 auto' }}
            onError={(e) => {
              e.target.src = defaultAvatar;
            }}
          />
          <Typography variant="h6" gutterBottom>{playerName}</Typography>
          <Box sx={{ fontSize: '4rem' }}>
            <AnimatePresence mode="wait">
              {playerMove && (
                <motion.div
                  key={playerMove}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {getMoveEmoji(playerMove)}
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Grid>

        {/* VS */}
        <Grid item xs={12} md={2} textAlign="center">
          <Typography variant="h4" color="primary">VS</Typography>
        </Grid>

        {/* Computer Side */}
        <Grid item xs={12} md={5} textAlign="center">
          <Avatar
            src={`/avatars/${computerAvatar}.png`}
            alt="Computer"
            sx={{ width: 80, height: 80, margin: '0 auto' }}
            onError={(e) => {
              e.target.src = defaultAvatar;
            }}
          />
          <Typography variant="h6" gutterBottom>Computer</Typography>
          <Box sx={{ fontSize: '4rem' }}>
            <AnimatePresence mode="wait">
              {computerMove && (
                <motion.div
                  key={computerMove}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {getMoveEmoji(computerMove)}
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Grid>

        {/* Move Buttons */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            {moves.map((move) => (
              <motion.div
                key={move}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Paper
                  elevation={2}
                  onClick={() => handleMove(move)}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    fontSize: '2rem',
                    minWidth: 80,
                    textAlign: 'center'
                  }}
                >
                  {getMoveEmoji(move)}
                </Paper>
              </motion.div>
            ))}
          </Box>
        </Grid>

        {/* Result Message */}
        <Grid item xs={12} textAlign="center">
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Typography variant="h5" color={result === 'win' ? 'success.main' : result === 'lose' ? 'error.main' : 'info.main'}>
                  {result === 'win' ? 'You Win!' : result === 'lose' ? 'You Lose!' : 'It\'s a Tie!'}
                </Typography>
                {computerMessage && (
                  <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                    {computerMessage}
                  </Typography>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default GameBoard; 