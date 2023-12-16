import { createTheme } from '@mui/material/styles';
const defaultTheme = createTheme();
const breakpoints = defaultTheme.breakpoints;

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontSize: '3.2rem',
      [breakpoints.down('sm')]: {
        fontSize: '2.4rem', // Smaller font size for small screens
      },
    },
    h2: {
      fontSize: '2.4rem',
      [breakpoints.down('sm')]: {
        fontSize: '2rem',
      },
    },
    h3: {
      fontSize: '2rem',
      [breakpoints.down('sm')]: {
        fontSize: '1.8rem',
      },
    },
    body1: {
      fontSize: '1.6rem',
      [breakpoints.down('sm')]: {
        fontSize: '1.4rem',
      },
    },
    body2: {
      fontSize: '1.4rem',
      [breakpoints.down('sm')]: {
        fontSize: '1.2rem',
      },
    },
    // Assuming body3 is a custom variant
    body3: {
      fontSize: '1.2rem',
      [breakpoints.down('sm')]: {
        fontSize: '1rem',
      },
    },
    fontSize: 10,
    htmlFontSize: 10,
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
      secondary: '#000',
    },
    highlight: {
      main: '#805ac1',
    },
    subtleAccent: {
      main: '#b0b0b0',
    },
  },
  components: {
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: 'grey.400 !important', // Set the background color to grey.400
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          borderRadius: '4px', // Customize button border radius
        },
        item: {
          paddingLeft: '0 !important',
          paddingTop: '0 !important',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: '#000 ', // Customize text field background color
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          padding: '0.4rem 0.8rem',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {},
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          maxHeight: '300px',
        },
      },
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          margin: 0,
          padding: 0,
        },
      },
    },
  },
});

export default theme;
