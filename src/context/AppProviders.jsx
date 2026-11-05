// ============================================================
// src/context/AppProviders.jsx
// Composition root for all providers.
// ============================================================

import React from 'react';
import { NotificationProvider } from './NotificationContext';
import { SessionProvider } from './SessionContext';
import { LogProvider } from './LogContext';
import { PhaseProvider } from './PhaseContext';
import { BrowserRouter } from 'react-router-dom';

export default function AppProviders({ children }) {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <NotificationProvider>
        <LogProvider>
          <SessionProvider>
            <PhaseProvider>{children}</PhaseProvider>
          </SessionProvider>
        </LogProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}
