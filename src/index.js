import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { AudioPlayerContextProvider } from './context/AudioPlayerContext';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';
import { SnackbarProvider } from './context/SnackbarContext'; // Import SnackbarProvider

const root = createRoot(document.getElementById('root'));

root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline /> {/* MUI Global Reset */}
    <SnackbarProvider>
      {' '}
      {/* Wrap your application with SnackbarProvider */}
      <AudioPlayerContextProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </AudioPlayerContextProvider>
    </SnackbarProvider>{' '}
    {/* Close SnackbarProvider */}
  </ThemeProvider>
);
