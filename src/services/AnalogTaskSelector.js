// ============================================================
// src/services/AnalogTaskSelector.js
// Single Responsibility: choose the analog support task.
// Strategy Pattern: one strategy per research group.
// ============================================================

import { Group, CTSkill } from '../core/types/enums';
import { ANALOG_PROBLEMS } from '../core/constants/problems';

const selectionStrategies = {
  /** Adaptive: the task matching the detected difficulty. */
  [Group.ADAPTIVE]: (detectedSkill) =>
    ANALOG_PROBLEMS[detectedSkill] || ANALOG_PROBLEMS[CTSkill.DECOMPOSITION],

  /** Fixed: a predetermined task, independent of detection. */
  [Group.FIXED]: (_detectedSkill, sessionIndex = 0) => {
    const skills = Object.keys(ANALOG_PROBLEMS);
    return ANALOG_PROBLEMS[skills[sessionIndex % skills.length]];
  },
};

export function selectAnalogTask(group, detectedSkill, sessionIndex = 0) {
  const strategy = selectionStrategies[group];
  if (!strategy) throw new Error(`Unknown group: ${group}`);

  const task = strategy(detectedSkill, sessionIndex);

  return {
    ...task,
    selectedBy: group === Group.ADAPTIVE ? 'adaptive' : 'fixed',
    matchesDetectedSkill: task.id === ANALOG_PROBLEMS[detectedSkill]?.id,
  };
}

export function registerSelectionStrategy(group, strategy) {
  selectionStrategies[group] = strategy;
}
