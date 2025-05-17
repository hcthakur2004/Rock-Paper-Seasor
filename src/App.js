import React from 'react';
import { GameProvider } from './context/GameContext';
import Game from './components/Game';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useGameContext } from './context/GameContext';

// Theme wrapper component to access context
const ThemedApp = () => {
  const { theme, highContrastMode, colorBlindMode } = useGameContext();

  const appTheme = createTheme({
    palette: {
      mode: theme,
      ...(highContrastMode && {
        contrast: {
          high: true,
        },
      }),
      ...(colorBlindMode && {
        success: {
          main: '#0066FF', // Blue instead of green
        },
        error: {
          main: '#FFB800', // Orange instead of red
        },
      }),
    },
  });

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Game />
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <GameProvider>
      <ThemedApp />
    </GameProvider>
  );
};

export default App;
