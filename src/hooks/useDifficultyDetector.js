// ============================================================
// src/hooks/useDifficultyDetector.js
// Orchestrates: detect → record → select analog task → log.
// ============================================================

import { useCallback } from 'react';
import { useLogContext } from '../context/LogContext';
import { useSessionContext } from '../context/SessionContext';
import {
  detectDifficulty,
  inferWeakestSkill,
} from '../services/DifficultyDetectionService';
import { selectAnalogTask } from '../services/AnalogTaskSelector';
import { LogActionType } from '../core/types/enums';

export function useDifficultyDetector() {
  const { getLogs, addLog } = useLogContext();
  const { session, setDetectedDifficulty, setAnalogTask } = useSessionContext();

  /** Records a difficulty and selects the analog task for it. */
  const applyDifficulty = useCallback(
    (difficulty, extraLogData = {}) => {
      setDetectedDifficulty(difficulty);

      addLog(
        LogActionType.DIFFICULTY_DETECTED,
        {
          skill: difficulty.skill,
          ruleId: difficulty.ruleId,
          description: difficulty.description,
          ...extraLogData,
        },
        difficulty.skill,
      );

      const analogTask = selectAnalogTask(session.group, difficulty.skill, 0);
      setAnalogTask(analogTask);

      addLog(LogActionType.ANALOG_START, {
        taskId: analogTask.id,
        selectedBy: analogTask.selectedBy,
        matchesDetectedSkill: analogTask.matchesDetectedSkill,
      });

      return { ...difficulty, analogTask };
    },
    [session.group, addLog, setDetectedDifficulty, setAnalogTask],
  );

  /** Automatic detection from the interaction trace. */
  const runDetection = useCallback(() => {
    const result = detectDifficulty(getLogs(), session.toolState);
    return result.detected ? applyDifficulty(result) : result;
  }, [getLogs, session.toolState, applyDifficulty]);

  /**
   * Manual trigger ("I need help"). If no rule fires, falls back to the skill
   * with the least visible progress, so a help request is never ignored.
   */
  const forceDetection = useCallback(
    (overrideSkill = null) => {
      if (overrideSkill) {
        return applyDifficulty(
          {
            detected: true,
            skill: overrideSkill,
            ruleId: 'manual_request',
            description: 'Student requested help',
          },
          { trigger: 'student_request' },
        );
      }

      const auto = detectDifficulty(getLogs(), session.toolState);
      if (auto.detected) {
        return applyDifficulty(auto, { trigger: 'student_request' });
      }

      return applyDifficulty(
        {
          detected: true,
          skill: inferWeakestSkill(session.toolState),
          ruleId: 'manual_request_inferred',
          description: 'Student requested help; skill inferred from tool progress',
        },
        { trigger: 'student_request' },
      );
    },
    [getLogs, session.toolState, applyDifficulty],
  );

  return { runDetection, forceDetection };
}
