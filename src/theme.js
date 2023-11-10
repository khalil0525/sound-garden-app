import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontSize: '3.2rem',
    },
    h2: {
      fontSize: '2.4rem',
    },
    h3: {
      fontSize: '2rem',
    },
    body1: {
      fontSize: '1.6rem',
    },
    body2: {
      fontSize: '1.4rem',
    },
    body3: {
      fontSize: '1.2rem',
    },
  },
  spacing: 8,
  palette: {
    primary: {
      main: '#725bcf',
    },
    secondary: {
      main: '#1e3888',
    },
    error: {
      main: '#ff6b00',
    },
    background: {
      default: '#000',
    },
    text: {
      primary: '#ffffff',
    },
    highlight: {
      main: '#805ac1',
    },
    subtleAccent: {
      main: '#b0b0b0',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px', // Customize button border radius
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          background: '#fff', // Customize text field background color
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Customize paper shadow
        },
      },
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          fontSize: '62.5%',
        },
        body: {
          background: 'var(--background-color)',
        },
      },
    },
  },
});

export default theme;
