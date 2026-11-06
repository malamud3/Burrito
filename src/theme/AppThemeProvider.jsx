import React from 'react';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { appTheme } from './appTheme';

/**
 * MUI integration boundary. injectFirst lets the existing stylesheet keep
 * precedence, so adopting MUI does not erase the app's established styles.
 */
export default function AppThemeProvider({ children }) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={appTheme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  );
}
