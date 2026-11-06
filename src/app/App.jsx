import React from 'react';
import AppProviders from '../context/AppProviders';
import AppErrorBoundary from '../components/system/AppErrorBoundary';
import AppRouter from './AppRouter';

export default function App() {
  return (
    <AppErrorBoundary>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </AppErrorBoundary>
  );
}
