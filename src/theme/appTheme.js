import { createTheme } from '@mui/material/styles';

// Keep Material UI aligned with Burrito's existing visual tokens. The legacy
// stylesheet remains responsible for the app layout; this theme owns MUI
// components only and makes the two systems feel like one design language.
export const appTheme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'light',
    primary: {
      main: '#55745e',
      dark: '#435e4b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#756682',
    },
    success: {
      main: '#55745e',
    },
    warning: {
      main: '#87643b',
    },
    error: {
      main: '#a64f46',
    },
    info: {
      main: '#547687',
    },
    background: {
      default: '#eeece3',
      paper: '#f9f7f0',
    },
    text: {
      primary: '#302f2a',
      secondary: '#68675f',
    },
    divider: '#ded9cb',
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
        sizeSmall: {
          minHeight: 34,
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
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 42,
        },
        indicator: {
          display: 'none',
        },
      },
    },
  },
});
