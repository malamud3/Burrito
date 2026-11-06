import React, { useEffect, useRef, useState } from 'react';
import { useSessionContext } from '../context/SessionContext';
import { usePhaseContext } from '../context/PhaseContext';
import { useLogContext } from '../context/LogContext';
import { usePhaseNavigation } from '../hooks/usePhaseNavigation';
import { LogActionType, Mode } from '../core/types/enums';
import { STUDY_DURATION_SECONDS } from '../core/constants/study';
import { isLearningPhase } from './routeGuards';

export default function LearningTimeoutController() {
  const { session, endLearning } = useSessionContext();
  const { currentPhase } = usePhaseContext();
  const { logs, addLog } = useLogContext();
  const { goToTransferAssessment } = usePhaseNavigation();
  const [now, setNow] = useState(Date.now);
  const timedOutSessions = useRef(new Set());

  const instructionIsActive =
    session.isActive &&
    session.mode === Mode.STUDENT &&
    isLearningPhase(currentPhase);

  useEffect(() => {
    if (!instructionIsActive) return undefined;
    setNow(Date.now());
    const timerId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timerId);
  }, [instructionIsActive]);

  const studyTimeExpired =
    session.isActive &&
    session.mode === Mode.STUDENT &&
    session.learningStartedAt &&
    !session.learningEndedAt &&
    now - session.learningStartedAt >= STUDY_DURATION_SECONDS * 1000;

  useEffect(() => {
    if (!studyTimeExpired) return;
    if (timedOutSessions.current.has(session.sessionId)) return;
    timedOutSessions.current.add(session.sessionId);
    const alreadyLogged = logs.some(
      (entry) =>
        entry.actionType === LogActionType.TIME_LIMIT_REACHED &&
        entry.data?.sessionId === session.sessionId,
    );
    if (!alreadyLogged) {
      addLog(LogActionType.TIME_LIMIT_REACHED, {
        sessionId: session.sessionId,
        studentId: session.studentId,
        activityPath: session.activityPath,
        durationSeconds: STUDY_DURATION_SECONDS,
      });
    }
    if (isLearningPhase(currentPhase)) {
      goToTransferAssessment({ reason: 'time_limit' });
    } else {
      const endedAt = endLearning();
      addLog(LogActionType.LEARNING_COMPLETE, {
        startedAt: session.learningStartedAt,
        endedAt,
        durationSeconds: session.learningStartedAt
          ? Math.max(0, Math.round((endedAt - session.learningStartedAt) / 1000))
          : null,
        reason: 'time_limit',
        sessionId: session.sessionId,
        studentId: session.studentId,
        activityPath: session.activityPath,
      });
    }
  }, [
    studyTimeExpired,
    logs,
    addLog,
    endLearning,
    session.activityPath,
    session.sessionId,
    session.studentId,
    session.learningStartedAt,
    currentPhase,
    goToTransferAssessment,
  ]);

  return null;
}
