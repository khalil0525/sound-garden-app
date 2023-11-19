import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { AudioPlayerContextProvider } from './context/AudioPlayerContext';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';

const root = createRoot(document.getElementById('root'));

root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline /> {/* Wrap your application with ThemeProvider */}
    <AudioPlayerContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </AudioPlayerContextProvider>
  </ThemeProvider> /* Close ThemeProvider */
);
