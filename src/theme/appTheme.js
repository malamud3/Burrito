import { createTheme } from '@mui/material/styles';

// Keep Material UI aligned with Burrito's existing visual tokens. The legacy
// stylesheet remains responsible for the app layout; this theme owns MUI
// components only and makes the two systems feel like one design language.
export const appTheme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'dark',
    primary: {
      main: '#6c8cff',
      dark: '#4a6adb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#a78bfa',
    },
    success: {
      main: '#4ade80',
    },
    warning: {
      main: '#fbbf24',
    },
    error: {
      main: '#f87171',
    },
    info: {
      main: '#38bdf8',
    },
    background: {
      default: '#0f1117',
      paper: '#1a1d27',
    },
    text: {
      primary: '#e4e6ed',
      secondary: '#9ba1b0',
    },
    divider: '#363b4a',
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 'var(--radius-sm)',
          minHeight: 42,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 42,
          fontWeight: 600,
          textTransform: 'none',
        },
      },
    },
  },
});
