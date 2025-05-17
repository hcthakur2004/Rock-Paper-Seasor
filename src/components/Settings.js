import React from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '../context/GameContext';
import {
  Paper,
  Box,
  Grid,
  Typography,
  Switch,
  TextField,
  FormControlLabel,
  IconButton,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  VolumeUp,
  VolumeOff,
  Mic,
  MicOff,
  Contrast,
  Visibility,
  DarkMode,
  LightMode,
} from '@mui/icons-material';

const Settings = () => {
  const {
    playerName,
    setPlayerName,
    playerAvatar,
    setPlayerAvatar,
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
  } = useGameContext();

  const avatarOptions = ['1', '2', '3', '4', '5']; // Add more avatar options as needed

  const settingVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SettingsIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6">Settings</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Player Settings */}
        <Grid item xs={12} md={6}>
          <motion.div {...settingVariants}>
            <Typography variant="subtitle1" gutterBottom>
              Player Settings
            </Typography>
            <TextField
              fullWidth
              label="Player Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
                Select Avatar:
              </Typography>
              {avatarOptions.map((avatar) => (
                <Tooltip key={avatar} title={`Avatar ${avatar}`}>
                  <IconButton
                    onClick={() => setPlayerAvatar(avatar)}
                    sx={{
                      p: 0.5,
                      border: avatar === playerAvatar ? 2 : 1,
                      borderColor: avatar === playerAvatar ? 'primary.main' : 'divider',
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <Avatar
                      src={`/avatars/${avatar}.png`}
                      alt={`Avatar ${avatar}`}
                      sx={{ 
                        width: 50, 
                        height: 50,
                        boxShadow: avatar === playerAvatar ? 2 : 0 
                      }}
                    />
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </motion.div>
        </Grid>

        {/* Audio Settings */}
        <Grid item xs={12} md={6}>
          <motion.div {...settingVariants}>
            <Typography variant="subtitle1" gutterBottom>
              Audio Settings
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  icon={<VolumeOff />}
                  checkedIcon={<VolumeUp />}
                />
              }
              label="Sound Effects"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={voiceEnabled}
                  onChange={(e) => setVoiceEnabled(e.target.checked)}
                  icon={<MicOff />}
                  checkedIcon={<Mic />}
                />
              }
              label="Voice Feedback"
            />
          </motion.div>
        </Grid>

        {/* Theme Settings */}
        <Grid item xs={12} md={6}>
          <motion.div {...settingVariants}>
            <Typography variant="subtitle1" gutterBottom>
              Theme Settings
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={theme === 'dark'}
                  onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                  icon={<LightMode />}
                  checkedIcon={<DarkMode />}
                />
              }
              label="Dark Mode"
            />
          </motion.div>
        </Grid>

        {/* Accessibility Settings */}
        <Grid item xs={12} md={6}>
          <motion.div {...settingVariants}>
            <Typography variant="subtitle1" gutterBottom>
              Accessibility
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={highContrastMode}
                  onChange={(e) => setHighContrastMode(e.target.checked)}
                  icon={<Contrast />}
                  checkedIcon={<Contrast color="primary" />}
                />
              }
              label="High Contrast"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={colorBlindMode}
                  onChange={(e) => setColorBlindMode(e.target.checked)}
                  icon={<Visibility />}
                  checkedIcon={<Visibility color="primary" />}
                />
              }
              label="Color Blind Mode"
            />
          </motion.div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Settings; 