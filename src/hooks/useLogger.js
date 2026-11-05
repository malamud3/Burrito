// ============================================================
// src/hooks/useLogger.js
// Facade: LogContext + session identity → one-line logging in components.
// ============================================================

import { useCallback } from 'react';
import { useLogContext } from '../context/LogContext';
import { useSessionContext } from '../context/SessionContext';

export function useLogger() {
  const { addLog, logs } = useLogContext();
  const { session } = useSessionContext();

  const log = useCallback(
    (actionType, data = {}, skill = null) =>
      addLog(
        actionType,
        {
          ...data,
          studentId: session.studentId,
          sessionId: session.sessionId,
          activityPath: session.activityPath,
        },
        skill,
      ),
    [addLog, session.studentId, session.sessionId, session.activityPath],
  );

  return { log, logs };
}
