// ============================================================
// src/services/AnalogTaskSelector.js
// Single Responsibility: choose the analog support task.
// Strategy Pattern: one strategy per research group.
// ============================================================

import { CTSkill } from '../core/types/enums';
import { ANALOG_PROBLEMS } from '../core/constants/problems';

export function selectAnalogTask(_group, detectedSkill) {
  const task = ANALOG_PROBLEMS[detectedSkill] || ANALOG_PROBLEMS[CTSkill.DECOMPOSITION];

  return {
    ...task,
    selectedBy: 'adaptive',
    matchesDetectedSkill: task.id === ANALOG_PROBLEMS[detectedSkill]?.id,
  };
}
