import React, { useEffect } from 'react';
import AppProviders from '../context/AppProviders';
import { useSessionContext } from '../context/SessionContext';
import { usePhaseContext } from '../context/PhaseContext';
import { useTimer } from '../hooks/useTimer';
import { Phase, Mode } from '../core/types/enums';
import AppHeader from '../components/layout/AppHeader';
import { SCREEN_REGISTRY } from './screenRegistry';

function AppShell() {
  const { session } = useSessionContext();
  const { currentPhase } = usePhaseContext();
  const { seconds, start, pause } = useTimer(false);

  // Timer runs only during an active student session.
  const shouldRun =
    session.isActive &&
    session.mode === Mode.STUDENT &&
    currentPhase !== Phase.COMPLETION &&
    currentPhase !== Phase.DASHBOARD;

  useEffect(() => {
    if (shouldRun) start();
    else pause();
  }, [shouldRun, start, pause]);

  const Screen = SCREEN_REGISTRY[currentPhase];

  return (
    <div className="app-shell">
      <AppHeader seconds={seconds} />
      {Screen ? <Screen /> : null}
    </div>
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  );
}
