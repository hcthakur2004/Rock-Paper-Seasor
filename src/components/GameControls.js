import React from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '../context/GameContext';
import {
  Paper,
  Box,
  Button,
  ButtonGroup,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  Casino as CasinoIcon,
  Timer as TimerIcon,
  Psychology as PsychologyIcon,
  RestartAlt as RestartIcon,
} from '@mui/icons-material';

const GameControls = () => {
  const {
    gameMode,
    setGameMode,
    timeAttack,
    setTimeAttack,
    resetStats,
  } = useGameContext();

  const handleModeChange = (mode) => {
    setGameMode(mode);
    if (timeAttack.active) {
      setTimeAttack({ active: false, timeLeft: 30, score: 0 });
    }
  };

  const handleTimeAttack = () => {
    if (!timeAttack.active) {
      setTimeAttack({
        active: true,
        timeLeft: 30,
        score: 0,
      });
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Game Controls
        </Typography>

        <Box sx={{ mb: 3 }}>
          <ButtonGroup variant="contained" size="large">
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Tooltip title="Easy Mode - Random moves">
                <Button
                  onClick={() => handleModeChange('easy')}
                  color={gameMode === 'easy' ? 'primary' : 'inherit'}
                  startIcon={<CasinoIcon />}
                >
                  Easy
                </Button>
              </Tooltip>
            </motion.div>

            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Tooltip title="Medium Mode - Basic pattern recognition">
                <Button
                  onClick={() => handleModeChange('medium')}
                  color={gameMode === 'medium' ? 'primary' : 'inherit'}
                  startIcon={<PsychologyIcon />}
                >
                  Medium
                </Button>
              </Tooltip>
            </motion.div>

            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Tooltip title="Hard Mode - Advanced AI with prediction">
                <Button
                  onClick={() => handleModeChange('hard')}
                  color={gameMode === 'hard' ? 'primary' : 'inherit'}
                  startIcon={<PsychologyIcon />}
                >
                  Hard
                </Button>
              </Tooltip>
            </motion.div>
          </ButtonGroup>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Tooltip title="Start Time Attack Mode - 30 seconds to score as many wins as possible">
              <Button
                variant="contained"
                color={timeAttack.active ? 'secondary' : 'primary'}
                onClick={handleTimeAttack}
                disabled={timeAttack.active}
                startIcon={<TimerIcon />}
              >
                Time Attack
              </Button>
            </Tooltip>
          </motion.div>

          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Tooltip title="Reset all game statistics">
              <Button
                variant="outlined"
                color="error"
                onClick={resetStats}
                startIcon={<RestartIcon />}
              >
                Reset Stats
              </Button>
            </Tooltip>
          </motion.div>
        </Box>
      </Box>
    </Paper>
  );
};

export default GameControls; 