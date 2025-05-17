import React from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '../context/GameContext';
import GameControls from './GameControls';
import GameBoard from './GameBoard';
import Stats from './Stats';
import Settings from './Settings';
import { Container, Box, Typography, Paper } from '@mui/material';

const Game = () => {
  const { playerName, timeAttack } = useGameContext();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h2" align="center" gutterBottom>
            Rock Paper Scissors
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" gutterBottom>
            Welcome, {playerName}!
          </Typography>
          
          {timeAttack.active && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 2, 
                  mb: 3, 
                  maxWidth: 300, 
                  margin: '0 auto',
                  background: (theme) => theme.palette.mode === 'dark' ? '#1a237e' : '#3f51b5',
                  color: 'white'
                }}
              >
                <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                  Time Attack Mode
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                  <Typography variant="h5">
                    Time: {timeAttack.timeLeft}s
                  </Typography>
                  <Typography variant="h5">
                    Score: {timeAttack.score}
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          )}
        </motion.div>

        <Box sx={{ mt: 4 }}>
          <GameBoard />
        </Box>

        <Box sx={{ mt: 4 }}>
          <GameControls />
        </Box>

        <Box sx={{ mt: 4 }}>
          <Stats />
        </Box>

        <Box sx={{ mt: 4 }}>
          <Settings />
        </Box>
      </Box>
    </Container>
  );
};

export default Game; 