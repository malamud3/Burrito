// ============================================================
// src/hooks/useHintEscalation.js
// ============================================================

import { useCallback } from 'react';
import { useSessionContext } from '../context/SessionContext';
import { useLogContext } from '../context/LogContext';
import { HintLevel, LogActionType } from '../core/types/enums';
import { BRIDGING_HINTS } from '../core/constants/hintLevels';

export function useHintEscalation() {
  const { session, setHintLevel } = useSessionContext();
  const { addLog } = useLogContext();

  const currentLevel = session.hintLevel;
  const detectedSkill = session.detectedDifficulty?.skill;
  const canEscalate = currentLevel < HintLevel.STRUCTURE_ORIENTED;

  const escalate = useCallback(() => {
    if (!canEscalate) return null;

    const nextLevel = currentLevel + 1;
    setHintLevel(nextLevel);

    addLog(
      LogActionType.HINT_ESCALATION,
      { fromLevel: currentLevel, toLevel: nextLevel, skill: detectedSkill },
      detectedSkill,
    );

    return nextLevel;
  }, [canEscalate, currentLevel, setHintLevel, addLog, detectedSkill]);

  const getHintTextForLevel = useCallback(
    (level) => (detectedSkill ? BRIDGING_HINTS[detectedSkill]?.[level] || null : null),
    [detectedSkill],
  );

  return {
    currentLevel,
    canEscalate,
    escalate,
    getHintTextForLevel,
    maxLevel: HintLevel.STRUCTURE_ORIENTED,
  };
}
