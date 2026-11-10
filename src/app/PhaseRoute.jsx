import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSessionContext } from '../context/SessionContext';
import { useLogContext } from '../context/LogContext';
import { getRedirect } from '../coordinator/phaseCoordinator';

export default function PhaseRoute({ phase, Screen }) {
  const location = useLocation();
  const { session } = useSessionContext();
  const { logs } = useLogContext();
  const redirectPath = getRedirect({
    phase,
    session,
    logs,
    isTransferNavigation: location.state?.fromLearningFlow === true,
  });

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Screen />;
}
