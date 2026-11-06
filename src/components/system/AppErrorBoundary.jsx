import React from 'react';

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
        <div className="card app-error-card">
          <span className="renato-eyebrow">Burrito</span>
          <h1>אירעה תקלה בלתי צפויה</h1>
          <p>
            אפשר לנסות לטעון את סביבת הלמידה מחדש. הנתונים שנשמרו לפני התקלה
            אמורים להישאר בדפדפן.
          </p>
          <button className="btn btn-primary" onClick={this.handleReload}>
            טעינה מחדש
          </button>
        </div>
      </main>
    );
  }
}
