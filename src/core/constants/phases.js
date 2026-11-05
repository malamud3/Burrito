// ============================================================
// src/core/constants/phases.js
// ============================================================

import { Phase } from '../types/enums';

export const PHASE_CONFIG = {
  [Phase.LOGIN]: { label: 'כניסה', progress: 0, icon: '🔑' },
  [Phase.PRE_ASSESSMENT]: { label: 'בוחן מקדים', progress: 12, icon: '📝' },
  [Phase.CLASSIC]: { label: 'מסלול קלאסי', progress: 30, icon: '📘' },
  [Phase.PROBLEM]: { label: 'שלב 1: הצגת הבעיה', progress: 10, icon: '📖' },
  [Phase.SOLVING]: { label: 'שלב 2: פתרון', progress: 30, icon: '🧠' },
  [Phase.DIFFICULTY]: { label: 'זיהוי קושי', progress: 45, icon: '🔎' },
  [Phase.ANALOG]: { label: 'משימת תמיכה אנלוגית', progress: 55, icon: '🔄' },
  [Phase.RETURN]: { label: 'חזרה לבעיה המקורית', progress: 70, icon: '🔁' },
  [Phase.TRANSFER]: { label: 'משימת העברה', progress: 85, icon: '🚀' },
  [Phase.EFFORT]: { label: 'דירוג מאמץ', progress: 93, icon: '📊' },
  [Phase.RENATO]: { label: 'כלי העזר לחקירת פונקציות', progress: 30, icon: '📈' },
  [Phase.RENATO_ASYMPTOTES]: { label: 'רמז 2 מתוך 4 — אסימפטוטות', progress: 32, icon: '📈' },
  [Phase.RENATO_INTERCEPTS]: { label: 'רמז 3 מתוך 4 — חיתוך עם הצירים', progress: 49, icon: '📈' },
  [Phase.RENATO_EXTREMA]: { label: 'רמז 4 מתוך 4 — נקודות קיצון', progress: 66, icon: '📈' },
  [Phase.RENATO_GRAPH]: { label: 'פתרון מסכם — שרטוט הפונקציה', progress: 83, icon: '✏️' },
  [Phase.TRANSFER_EXAM]: { label: 'בוחן העברה', progress: 92, icon: '📝' },
  [Phase.COMPLETION]: { label: 'סיום', progress: 100, icon: '✅' },
  [Phase.DASHBOARD]: { label: 'לוח בקרה', progress: 100, icon: '📋' },
};

export const PHASE_ORDER = [
  Phase.LOGIN,
  Phase.PRE_ASSESSMENT,
  Phase.CLASSIC,
  Phase.RENATO,
  Phase.RENATO_ASYMPTOTES,
  Phase.RENATO_INTERCEPTS,
  Phase.RENATO_EXTREMA,
  Phase.RENATO_GRAPH,
  Phase.TRANSFER_EXAM,
  Phase.COMPLETION,
];
