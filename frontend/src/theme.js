import { createTheme } from '@mui/material';

// The design system theme mapped to Material UI properties
const theme = createTheme({
  palette: {
    primary: {
      main: '#161637', // Midnight Ink
      contrastText: '#fafafc',
    },
    secondary: {
      main: '#0085e4', // Sky Accent
      contrastText: '#fafafc',
    },
    background: {
      default: '#fafafc', // Paper White
      paper: '#fafafc',
    },
    text: {
      primary: '#161637', // Midnight Ink
      secondary: '#666666', // Graphite
    },
    divider: '#dadce0', // Hairline
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '3.5rem', // 56px
      fontWeight: 700,
      letterSpacing: '-1.4px',
      lineHeight: 1.07,
    },
    h2: {
      fontSize: '3rem', // 48px
      fontWeight: 700,
      letterSpacing: '-1px',
      lineHeight: 1.14,
    },
    h3: {
      fontSize: '2rem', // 32px
      fontWeight: 700,
      letterSpacing: '-0.6px',
      lineHeight: 1.25,
    },
    h4: {
      fontSize: '1.5rem', // 24px
      fontWeight: 700,
      letterSpacing: '-0.4px',
      lineHeight: 1.33,
    },
    h5: {
      fontSize: '1.25rem', // 20px
      fontWeight: 500,
      letterSpacing: '-0.24px',
      lineHeight: 1.42,
    },
    h6: {
      fontSize: '1rem', // 16px
      fontWeight: 500,
      letterSpacing: '-0.16px',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '0.9375rem', // 15px
      fontWeight: 400,
      letterSpacing: '-0.12px',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem', // 14px
      fontWeight: 400,
      letterSpacing: '-0.08px',
      lineHeight: 1.57,
    },
    caption: {
      fontSize: '0.75rem', // 12px
      fontWeight: 400,
      letterSpacing: '0.071px',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12, // 12px radius
          textTransform: 'none',
          fontFamily: 'Inter',
          fontWeight: 600,
          fontSize: '0.9375rem', // 15px
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: '#000000', // Onyx background
          color: '#fafafc', // Paper White text
          '&:hover': {
            backgroundColor: '#222222',
          },
        },
        outlined: {
          backgroundColor: '#fafafc',
          borderColor: '#dadce0', // Hairline
          color: '#000000', // Onyx text
          '&:hover': {
            backgroundColor: '#f0f0f2',
            borderColor: '#dadce0',
          },
        },
        text: {
          color: '#0085e4', // Sky Accent
          '&:hover': {
            backgroundColor: 'rgba(0, 133, 228, 0.08)',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8, // 8px inputs
          backgroundColor: '#f0f0f2', // Mist Gray
          '& fieldset': {
            borderColor: 'transparent',
            transition: 'border-color 0.2s',
          },
          '&:hover fieldset': {
            borderColor: '#dadce0',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#161637', // Midnight Ink
            borderWidth: '1px',
          },
        },
        input: {
          color: '#000000', // Onyx text
          padding: '12px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24, // 24px cards
          backgroundColor: '#fafafc',
          border: '1px solid #dadce0', // Hairline
          boxShadow: 'rgba(0, 0, 0, 0.08) 0px 4px 16px -8px', // md shadow
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24, // 24px cards
        },
      },
    },
  },
});

export default theme;
