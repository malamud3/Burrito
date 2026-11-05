// ============================================================
// src/services/LogAnalyticsService.js
// Single Responsibility: derive analytics from raw logs
// for the researcher dashboard.
// ============================================================

import { LogActionType, CTSkill } from '../core/types/enums';
import { countBy, getTimeInTool } from './logUtils';

const emptySummary = () => ({
  totalActions: 0,
  totalDurationSeconds: 0,
  actionsByType: {},
  actionsBySkill: {},
  hintRequests: 0,
  hintEscalations: 0,
  editsPerSkill: {},
  timelineByPhase: [],
});

export function computeSessionSummary(logs) {
  if (!logs.length) return emptySummary();

  const first = logs[0].timestamp;
  const last = logs[logs.length - 1].timestamp;
  const ofType = (type) => logs.filter((l) => l.actionType === type);

  return {
    totalActions: logs.length,
    totalDurationSeconds: Math.round((last - first) / 1000),
    actionsByType: countBy(logs, 'actionType'),
    actionsBySkill: countBy(
      logs.filter((l) => l.skill),
      'skill',
    ),
    hintRequests: ofType(LogActionType.HINT_REQUEST).length,
    hintEscalations: ofType(LogActionType.HINT_ESCALATION).length,
    editsPerSkill: Object.values(CTSkill).reduce((acc, skill) => {
      acc[skill] = logs.filter(
        (l) => l.skill === skill && l.actionType === LogActionType.EDIT,
      ).length;
      return acc;
    }, {}),
    timelineByPhase: ofType(LogActionType.PHASE_CHANGE).map((l) => ({
      phase: l.data?.to,
      from: l.data?.from,
      timestamp: l.timestamp,
    })),
  };
}

export function computeToolEngagement(logs) {
  return Object.values(CTSkill).map((skill) => {
    const skillLogs = logs.filter((l) => l.skill === skill);
    return {
      skill,
      totalInteractions: skillLogs.length,
      edits: skillLogs.filter((l) => l.actionType === LogActionType.EDIT)
        .length,
      timeSpentSeconds: Math.round(getTimeInTool(skillLogs)),
      firstInteraction: skillLogs[0]?.timestamp || null,
      lastInteraction: skillLogs[skillLogs.length - 1]?.timestamp || null,
    };
  });
}

/**
 * Seconds spent in each phase, computed from consecutive PHASE_CHANGE logs.
 * The last phase is measured up to the latest log entry.
 */
export function computePhaseDurations(logs) {
  const changes = logs.filter((l) => l.actionType === LogActionType.PHASE_CHANGE);
  if (!changes.length) return [];

  const endTs = logs[logs.length - 1].timestamp;

  return changes.map((change, i) => {
    const next = changes[i + 1];
    const until = next ? next.timestamp : endTs;
    return {
      phase: change.data?.to,
      seconds: Math.max(0, Math.round((until - change.timestamp) / 1000)),
    };
  });
}

export function getDetectionEvents(logs) {
  return logs
    .filter((l) => l.actionType === LogActionType.DIFFICULTY_DETECTED)
    .map((l) => ({
      timestamp: l.timestamp,
      skill: l.data?.skill,
      ruleId: l.data?.ruleId,
      trigger: l.data?.trigger || 'automatic',
    }));
}
