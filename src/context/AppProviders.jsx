// ============================================================
// src/context/AppProviders.jsx
// Composition root for all providers.
// ============================================================

import React from 'react';
import { NotificationProvider } from './NotificationContext';
import { SessionProvider } from './SessionContext';
import { LogProvider } from './LogContext';
import { PhaseProvider } from './PhaseContext';

export default function AppProviders({ children }) {
  return (
    <NotificationProvider>
      <LogProvider>
        <SessionProvider>
          <PhaseProvider>{children}</PhaseProvider>
        </SessionProvider>
      </LogProvider>
    </NotificationProvider>
  );
}
