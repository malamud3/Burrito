// ============================================================
// src/hooks/usePhaseNavigation.js
// Orchestration: every phase transition is logged.
// ============================================================

import { useCallback, useMemo } from 'react';
import { usePhaseContext } from '../context/PhaseContext';
import { useLogContext } from '../context/LogContext';
import { useSessionContext } from '../context/SessionContext';
import { LogActionType, Phase } from '../core/types/enums';

export function usePhaseNavigation() {
  const { currentPhase, phaseHistory, navigateTo, navigateNext } =
    usePhaseContext();
  const { addLog } = useLogContext();
  const { session, endLearning } = useSessionContext();

  const goTo = useCallback(
    (phase) => navigateTo(phase),
    [navigateTo],
  );

  const goNext = useCallback(() => navigateNext(), [navigateNext]);

  const goToTransferAssessment = useCallback(
    ({ reason = 'completed' } = {}) => {
      const endedAt = session.learningEndedAt || Date.now();
      if (!session.learningEndedAt) {
        endLearning(endedAt);
        addLog(LogActionType.LEARNING_COMPLETE, {
          startedAt: session.learningStartedAt,
          endedAt,
          durationSeconds: session.learningStartedAt
            ? Math.max(0, Math.round((endedAt - session.learningStartedAt) / 1000))
            : null,
          reason,
          studentId: session.studentId,
          sessionId: session.sessionId,
          activityPath: session.activityPath,
        });
      }
      goTo(Phase.TRANSFER_EXAM);
    },
    [
      addLog,
      endLearning,
      goTo,
      session.activityPath,
      session.learningEndedAt,
      session.learningStartedAt,
      session.sessionId,
      session.studentId,
    ],
  );

  const shortcuts = useMemo(
    () => ({
      goToLogin: () => goTo(Phase.LOGIN),
      goToPreAssessment: () => goTo(Phase.PRE_ASSESSMENT),
      goToClassic: () => goTo(Phase.CLASSIC),
      goToProblem: () => goTo(Phase.PROBLEM),
      goToSolving: () => goTo(Phase.SOLVING),
      goToDifficulty: () => goTo(Phase.DIFFICULTY),
      goToAnalog: () => goTo(Phase.ANALOG),
      goToReturn: () => goTo(Phase.RETURN),
      goToTransfer: () => goTo(Phase.TRANSFER),
      goToEffort: () => goTo(Phase.EFFORT),
      goToRenato: () => goTo(Phase.RENATO),
      goToRenatoAsymptotes: () => goTo(Phase.RENATO_ASYMPTOTES),
      goToRenatoIntercepts: () => goTo(Phase.RENATO_INTERCEPTS),
      goToRenatoExtrema: () => goTo(Phase.RENATO_EXTREMA),
      goToRenatoGraph: () => goTo(Phase.RENATO_GRAPH),
      goToTransferAssessment,
      goToCompletion: () => goTo(Phase.COMPLETION),
      goToDashboard: () => goTo(Phase.DASHBOARD),
    }),
    [goTo, goToTransferAssessment],
  );

  return { currentPhase, phaseHistory, goTo, goNext, ...shortcuts };
}
