import { ActivityPath } from '../core/types/enums';
import {
  ALLOCATION_STORAGE_KEY,
  STUDY_PATHS,
} from '../core/constants/study';

function readParticipantChoices(storage) {
  const raw = storage.getItem(ALLOCATION_STORAGE_KEY);
  if (!raw) return { schemaVersion: 1, nextIndex: 0, sequence: [], participants: {} };

  let state;
  try {
    state = JSON.parse(raw);
  } catch {
    throw new Error('נתוני ההקצאה שמורים פגומים. יש לייצא את הלוגים לפני איפוס נתוני הדפדפן.');
  }

  if (
    state?.schemaVersion !== 1 ||
    !Number.isInteger(state.nextIndex) ||
    !Array.isArray(state.sequence) ||
    !state.participants ||
    typeof state.participants !== 'object'
  ) {
    throw new Error('מבנה נתוני ההקצאה אינו תקין; ההקצאה נעצרה כדי למנוע שיבוש במחקר.');
  }

  return state;
}

function normalizeParticipantId(participantId) {
  return participantId.trim().toLocaleUpperCase('en-US');
}

export function recordStudyPathChoice(participantId, activityPath, storage = window.localStorage) {
  const normalizedId = normalizeParticipantId(participantId);
  if (!normalizedId) throw new Error('נדרש קוד משתתף/ת לבחירת מסלול.');
  if (!STUDY_PATHS.includes(activityPath)) {
    throw new Error('המסלול שנבחר אינו תקין; הבחירה לא נשמרה.');
  }

  const state = readParticipantChoices(storage);
  const existing = state.participants[normalizedId];
  if (existing) return { duplicate: true, assignment: existing };

  const assignment = {
    activityPath,
    method: 'student_choice',
    chosenAt: Date.now(),
  };
  state.participants[normalizedId] = assignment;
  storage.setItem(ALLOCATION_STORAGE_KEY, JSON.stringify(state));

  return { duplicate: false, assignment };
}

export function isParticipantAlreadyAssigned(participantId, storage = window.localStorage) {
  const normalizedId = normalizeParticipantId(participantId);
  if (!normalizedId) return false;
  return Boolean(readParticipantChoices(storage).participants[normalizedId]);
}
