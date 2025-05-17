import React from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '../context/GameContext';
import {
  Paper,
  Box,
  Grid,
  Typography,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  Psychology as PsychologyIcon,
  Whatshot as StreakIcon,
} from '@mui/icons-material';

const Stats = () => {
  const { stats } = useGameContext();
  
  const winRate = stats.totalGames > 0
    ? Math.round((stats.wins / stats.totalGames) * 100)
    : 0;

  const statVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom align="center">
        Statistics
      </Typography>

      <Grid container spacing={3}>
        {/* Win Rate */}
        <Grid item xs={12} md={6}>
          <motion.div {...statVariants}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrophyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Win Rate</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={winRate}
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Typography variant="body2" color="textSecondary" align="right">
                {winRate}%
              </Typography>
            </Box>
          </motion.div>
        </Grid>

        {/* Game History */}
        <Grid item xs={12} md={6}>
          <motion.div {...statVariants}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TimelineIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Game History</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={`Wins: ${stats.wins}`}
                color="success"
                size="small"
              />
              <Chip
                label={`Losses: ${stats.losses}`}
                color="error"
                size="small"
              />
              <Chip
                label={`Ties: ${stats.ties}`}
                color="info"
                size="small"
              />
              <Chip
                label={`Total: ${stats.totalGames}`}
                color="default"
                size="small"
              />
            </Box>
          </motion.div>
        </Grid>

        {/* Streaks */}
        <Grid item xs={12} md={6}>
          <motion.div {...statVariants}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <StreakIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Streaks</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={`Current Streak: ${stats.winStreak}`}
                color="primary"
                size="small"
              />
              <Chip
                label={`Best Streak: ${stats.maxWinStreak}`}
                color="secondary"
                size="small"
              />
            </Box>
          </motion.div>
        </Grid>

        {/* Move Analysis */}
        <Grid item xs={12} md={6}>
          <motion.div {...statVariants}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PsychologyIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Move Analysis</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {stats.mostUsedMove && (
                <Chip
                  label={`Favorite Move: ${stats.mostUsedMove}`}
                  color="default"
                  size="small"
                />
              )}
              {stats.timeAttackHighScore > 0 && (
                <Chip
                  label={`Time Attack Best: ${stats.timeAttackHighScore}`}
                  color="warning"
                  size="small"
                />
              )}
            </Box>
          </motion.div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Stats; 