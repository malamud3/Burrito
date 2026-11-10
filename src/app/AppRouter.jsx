import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSessionContext } from '../context/SessionContext';
import { usePhaseContext } from '../context/PhaseContext';
import { Phase } from '../core/types/enums';
import { getPathForPhase } from '../coordinator/phaseCoordinator';
import AppHeader from '../components/layout/AppHeader';
import LearningTimeoutController from './LearningTimeoutController';
import PhaseRoute from './PhaseRoute';
import { APP_ROUTES, LEGACY_REDIRECTS } from './routeConfig';

export default function AppRouter() {
  const { session } = useSessionContext();
  const { currentPhase } = usePhaseContext();
  const rootPath = session.isActive
    ? getPathForPhase(currentPhase)
    : getPathForPhase(Phase.LOGIN);

  return (
    <div className="app-shell">
      <LearningTimeoutController />
      <AppHeader />
      <Routes>
        {APP_ROUTES.map(({ phase, path, Screen }) => (
          <Route
            key={phase}
            path={path}
            element={<PhaseRoute phase={phase} Screen={Screen} />}
          />
        ))}
        {LEGACY_REDIRECTS.map(({ path, to }) => (
          <Route key={path} path={path} element={<Navigate to={to} replace />} />
        ))}
        <Route path="/" element={<Navigate to={rootPath} replace />} />
        <Route path="*" element={<Navigate to={rootPath} replace />} />
      </Routes>
    </div>
  );
}
