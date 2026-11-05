// ============================================================
// src/services/DifficultyDetectionService.js
// Single Responsibility: detects difficulty patterns from logs.
// Open/Closed: new rules can be registered without touching existing ones.
// ============================================================

import { CTSkill, LogActionType } from '../core/types/enums';
import { getTimeInTool } from './logUtils';

const byFilled = (items = []) =>
  items.filter((i) => i.value && i.value.trim().length > 0).length;

/**
 * Each rule is independent. Thresholds are initial values
 * and are meant to be calibrated in a pilot study.
 */
const DETECTION_RULES = {
  [CTSkill.DECOMPOSITION]: {
    id: 'decomp-struggle',
    description: 'Struggle with problem decomposition',
    detect: (logs, toolState) => {
      const skillLogs = logs.filter((l) => l.skill === CTSkill.DECOMPOSITION);
      const count = (type) =>
        skillLogs.filter((l) => l.actionType === type).length;

      const editCount = count(LogActionType.EDIT);
      const addRemove =
        count(LogActionType.STEP_ADD) + count(LogActionType.STEP_REMOVE);
      const timeInTool = getTimeInTool(skillLogs);
      const stepsWithContent = byFilled(toolState.decomposition?.steps);

      const isChurning = addRemove > 4 && stepsWithContent <= 1;
      const isStalled = timeInTool > 120 && stepsWithContent === 0;
      const isRestarting = editCount > 8 && stepsWithContent <= 1;

      return isChurning || isStalled || isRestarting;
    },
  },

  [CTSkill.ABSTRACTION]: {
    id: 'abstract-struggle',
    description: 'Struggle with identifying relevant data',
    detect: (logs, toolState) => {
      const skillLogs = logs.filter((l) => l.skill === CTSkill.ABSTRACTION);
      const rows = toolState.abstraction?.rows || [];

      const incorrect = rows.filter(
        (r) =>
          r.userRelevant !== undefined && r.userRelevant !== r.actualRelevant,
      ).length;
      const timeInTool = getTimeInTool(skillLogs);

      const manyErrors = incorrect >= 3;
      const stalledNoProgress =
        rows.length > 0 &&
        timeInTool > 90 &&
        rows.every((r) => r.userRelevant === undefined);

      return manyErrors || stalledNoProgress;
    },
  },

  [CTSkill.ALGORITHMIC]: {
    id: 'algo-struggle',
    description: 'Struggle with building action sequence',
    detect: (logs, toolState) => {
      const skillLogs = logs.filter((l) => l.skill === CTSkill.ALGORITHMIC);
      const editCount = skillLogs.filter(
        (l) => l.actionType === LogActionType.EDIT,
      ).length;
      const filled = byFilled(toolState.algorithmic?.nodes);
      const timeInTool = getTimeInTool(skillLogs);

      const frequentEditsLowOutput = editCount > 10 && filled <= 1;
      const stalledEmpty = timeInTool > 120 && filled === 0;

      return frequentEditsLowOutput || stalledEmpty;
    },
  },
};

/**
 * Returns { detected, skill, ruleId, description }.
 * Rules are evaluated in registration order; first match wins.
 */
export function detectDifficulty(logs, toolState) {
  for (const [skill, rule] of Object.entries(DETECTION_RULES)) {
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
export function inferWeakestSkill(toolState) {
  const progress = {
    [CTSkill.DECOMPOSITION]: byFilled(toolState.decomposition?.steps),
    [CTSkill.ABSTRACTION]: (toolState.abstraction?.rows || []).filter(
      (r) => r.userRelevant !== undefined,
    ).length,
    [CTSkill.ALGORITHMIC]: byFilled(toolState.algorithmic?.nodes),
  };

  return Object.entries(progress).sort((a, b) => a[1] - b[1])[0][0];
}

/** Extension point — add or replace a rule without modifying existing ones. */
export function registerDetectionRule(skill, rule) {
  DETECTION_RULES[skill] = rule;
}

export function getRegisteredRules() {
  return Object.entries(DETECTION_RULES).map(([skill, rule]) => ({
    skill,
    id: rule.id,
    description: rule.description,
  }));
}
