// ============================================================
// src/hooks/usePhaseNavigation.js
// Orchestration: every phase transition is logged.
// ============================================================

import { useCallback, useMemo } from 'react';
import { usePhaseContext } from '../context/PhaseContext';
import { useLogContext } from '../context/LogContext';
import { LogActionType, Phase } from '../core/types/enums';

export function usePhaseNavigation() {
  const { currentPhase, phaseHistory, navigateTo, navigateNext } =
    usePhaseContext();
  const { addLog } = useLogContext();

  const goTo = useCallback(
    (phase) => {
      addLog(LogActionType.PHASE_CHANGE, { from: currentPhase, to: phase });
      navigateTo(phase);
    },
    [currentPhase, navigateTo, addLog],
  );

  const goNext = useCallback(() => navigateNext(), [navigateNext]);

  const shortcuts = useMemo(
    () => ({
      goToProblem: () => goTo(Phase.PROBLEM),
      goToSolving: () => goTo(Phase.SOLVING),
      goToDifficulty: () => goTo(Phase.DIFFICULTY),
      goToAnalog: () => goTo(Phase.ANALOG),
      goToReturn: () => goTo(Phase.RETURN),
      goToTransfer: () => goTo(Phase.TRANSFER),
      goToEffort: () => goTo(Phase.EFFORT),
      goToCompletion: () => goTo(Phase.COMPLETION),
      goToDashboard: () => goTo(Phase.DASHBOARD),
    }),
    [goTo],
  );

  return { currentPhase, phaseHistory, goTo, goNext, ...shortcuts };
}
