// ============================================================
// src/services/AnalogTaskSelector.js
// Single Responsibility: choose the analog support task.
// Strategy Pattern: one strategy per research group.
// ============================================================

import { Group, CTSkill } from '../core/types/enums';
import { ANALOG_PROBLEMS } from '../core/constants/problems';

export function selectAnalogTask(group, detectedSkill, sessionIndex = 0) {
  if (![Group.ADAPTIVE, Group.FIXED].includes(group)) {
    throw new Error(`Unknown group: ${group}`);
  }
  const skills = Object.keys(ANALOG_PROBLEMS);
  const task = group === Group.FIXED
    ? ANALOG_PROBLEMS[skills[sessionIndex % skills.length]]
    : ANALOG_PROBLEMS[detectedSkill] || ANALOG_PROBLEMS[CTSkill.DECOMPOSITION];

  return {
    ...task,
    selectedBy: group === Group.FIXED ? 'fixed' : 'adaptive',
    matchesDetectedSkill: task.id === ANALOG_PROBLEMS[detectedSkill]?.id,
  };
}
