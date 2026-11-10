// ============================================================
// src/core/constants/phases.js
// ============================================================

import { Phase } from '../types/enums';

export const PHASE_CONFIG = {
  [Phase.LOGIN]: { label: 'כניסה', progress: 0, icon: '🔑' },
  [Phase.PRE_ASSESSMENT]: { label: 'בוחן מקדים', progress: 10, icon: '📝' },
  [Phase.PROBLEM]: { label: 'שלב 1: הצגת הבעיה', progress: 10, icon: '📖' },
  [Phase.SOLVING]: { label: 'שלב 2: פתרון', progress: 30, icon: '🧠' },
  [Phase.DIFFICULTY]: { label: 'זיהוי קושי', progress: 45, icon: '🔎' },
  [Phase.ANALOG]: { label: 'משימת תמיכה אנלוגית', progress: 55, icon: '🔄' },
  [Phase.RETURN]: { label: 'חזרה לבעיה המקורית', progress: 70, icon: '🔁' },
  [Phase.TRANSFER]: { label: 'משימת העברה', progress: 85, icon: '🚀' },
  [Phase.EFFORT]: { label: 'דירוג מאמץ', progress: 93, icon: '📊' },
  [Phase.RENATO]: { label: 'שלב 1 מתוך 4 — תחום ההגדרה', progress: 30, icon: '📈' },
  [Phase.RENATO_EXTREMA]: { label: 'שלב 2 מתוך 4 — נקודות קיצון', progress: 43, icon: '📈' },
  [Phase.RENATO_ASYMPTOTES]: { label: 'שלב 3 מתוך 4 — אסימפטוטות', progress: 56, icon: '📈' },
  [Phase.RENATO_INTERCEPTS]: { label: 'שלב 4 מתוך 4 — חיתוך עם הצירים', progress: 69, icon: '📈' },
  [Phase.RENATO_GRAPH]: { label: 'פתרון מסכם — שרטוט הפונקציה', progress: 83, icon: '✏️' },
  [Phase.TRANSFER_EXAM]: { label: 'בוחן העברה', progress: 92, icon: '📝' },
  [Phase.COMPLETION]: { label: 'סיום', progress: 100, icon: '✅' },
  [Phase.DASHBOARD]: { label: 'לוח בקרה', progress: 100, icon: '📋' },
};

const LEARNING_PHASES = {
  renato: [
    Phase.RENATO,
    Phase.RENATO_EXTREMA,
    Phase.RENATO_ASYMPTOTES,
    Phase.RENATO_INTERCEPTS,
    Phase.RENATO_GRAPH,
  ],
};

export function getNextPhase(currentPhase, activityPath) {
  if (currentPhase === Phase.LOGIN) return Phase.PRE_ASSESSMENT;
  if (currentPhase === Phase.PRE_ASSESSMENT) {
    return LEARNING_PHASES.renato[0];
  }
  if (currentPhase === Phase.TRANSFER_EXAM) return Phase.COMPLETION;

  const learningPhases = LEARNING_PHASES.renato;

  const phaseIndex = learningPhases.indexOf(currentPhase);
  if (phaseIndex < 0) return null;
  return learningPhases[phaseIndex + 1] || Phase.TRANSFER_EXAM;
}
