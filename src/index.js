import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { AudioPlayerContextProvider } from './context/AudioPlayerContext';
import { ThemeProvider } from '@mui/material';
import theme from './theme';

const root = createRoot(document.getElementById('root'));

root.render(
  <ThemeProvider theme={theme}>
    {' '}
    {/* Wrap your application with ThemeProvider */}
    <AudioPlayerContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </AudioPlayerContextProvider>
  </ThemeProvider> /* Close ThemeProvider */
);
