// ============================================================
// src/services/DifficultyDetectionService.js
// Public facade for modular difficulty-detection rules.
// ============================================================

import { getSkillProgress } from './difficultyDetection/progress';
import {
  getDetectionRules,
  getRegisteredRules,
  registerDetectionRule,
} from './difficultyDetection/ruleRegistry';

/**
 * Returns { detected, skill, ruleId, description }.
 * Rules are evaluated in registration order; first match wins.
 */
export function detectDifficulty(logs = [], toolState = {}) {
  for (const [skill, rule] of getDetectionRules()) {
    if (rule.detect(logs, toolState)) {
      return {
        detected: true,
        skill,
        ruleId: rule.id,
        description: rule.description,
      };
    }
  }
  return { detected: false, skill: null, ruleId: null, description: null };
}

/**
 * Fallback used when a student explicitly asks for help but no rule fired:
 * picks the CT skill with the least visible progress in its tool.
 */
export function inferWeakestSkill(toolState = {}) {
  const progress = getSkillProgress(toolState);
  return Object.entries(progress).sort((a, b) => a[1] - b[1])[0][0];
}

// Keep extension-point exports stable for existing consumers.
export { getRegisteredRules, registerDetectionRule };
