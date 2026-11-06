import React from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default class AppErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Keep the production UI usable while still making the failure observable
    // during development and in browser diagnostics.
    console.error('Unhandled application error', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="app-error-shell" dir="rtl" role="alert">
        <Paper className="card app-error-card" elevation={0}>
          <Stack spacing={2} alignItems="center">
            <Typography component="span" className="renato-eyebrow">
              Burrito
            </Typography>
            <Typography component="h1" variant="h4">
              אירעה תקלה בלתי צפויה
            </Typography>
            <Typography component="p">
              אפשר לנסות לטעון את סביבת הלמידה מחדש. הנתונים שנשמרו לפני התקלה
              אמורים להישאר בדפדפן.
            </Typography>
            <Button className="btn btn-primary" onClick={this.handleReload} variant="contained">
              טעינה מחדש
            </Button>
          </Stack>
        </Paper>
      </main>
    );
  }
}
