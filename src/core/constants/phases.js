// ============================================================
// src/core/constants/phases.js
// ============================================================

import { Phase } from '../types/enums';

export const PHASE_CONFIG = {
  [Phase.LOGIN]: { label: 'כניסה', progress: 0, icon: '🔑' },
  [Phase.PROBLEM]: { label: 'שלב 1: הצגת הבעיה', progress: 10, icon: '📖' },
  [Phase.SOLVING]: { label: 'שלב 2: פתרון', progress: 30, icon: '🧠' },
  [Phase.DIFFICULTY]: { label: 'זיהוי קושי', progress: 45, icon: '🔎' },
  [Phase.ANALOG]: { label: 'משימת תמיכה אנלוגית', progress: 55, icon: '🔄' },
  [Phase.RETURN]: { label: 'חזרה לבעיה המקורית', progress: 70, icon: '🔁' },
  [Phase.TRANSFER]: { label: 'משימת העברה', progress: 85, icon: '🚀' },
  [Phase.EFFORT]: { label: 'דירוג מאמץ', progress: 93, icon: '📊' },
  [Phase.RENATO]: { label: 'כלי העזר לחקירת פונקציות', progress: 30, icon: '📈' },
  [Phase.COMPLETION]: { label: 'סיום', progress: 100, icon: '✅' },
  [Phase.DASHBOARD]: { label: 'לוח בקרה', progress: 100, icon: '📋' },
};

export const PHASE_ORDER = [
  Phase.LOGIN,
  Phase.PROBLEM,
  Phase.SOLVING,
  Phase.DIFFICULTY,
  Phase.ANALOG,
  Phase.RETURN,
  Phase.TRANSFER,
  Phase.EFFORT,
  Phase.COMPLETION,
];
