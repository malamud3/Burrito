import { ActivityPath } from '../core/types/enums';
import {
  ALLOCATION_STORAGE_KEY,
  STUDY_PATHS,
} from '../core/constants/study';

const createInitialAllocationState = () => ({
  schemaVersion: 2,
  nextIndex: 0,
  sequence: [],
  participants: {},
});

function readAllocationState(storage) {
  const raw = storage.getItem(ALLOCATION_STORAGE_KEY);
  if (!raw) return createInitialAllocationState();

  let state;
  try {
    state = JSON.parse(raw);
  } catch {
    throw new Error('נתוני ההקצאה להדגמה פגומים. יש לייצא את הלוגים לפני איפוס נתוני הדפדפן.');
  }

  if (
    state?.schemaVersion === 1 &&
    Number.isInteger(state.nextIndex) &&
    Array.isArray(state.sequence) &&
    state.participants &&
    typeof state.participants === 'object'
  ) {
    return {
      ...createInitialAllocationState(),
      participants: state.participants,
    };
  }

  if (
    state?.schemaVersion !== 2 ||
    !Number.isInteger(state.nextIndex) ||
    !Array.isArray(state.sequence) ||
    !state.participants ||
    typeof state.participants !== 'object'
  ) {
    throw new Error('מבנה נתוני ההקצאה להדגמה אינו תקין; ההקצאה נעצרה.');
  }

  return state;
}

function normalizeParticipantId(participantId) {
  return participantId.trim().toLocaleUpperCase('en-US');
}

export function assignDemoStudyPath(
  participantId,
  storage = window.localStorage,
  random = Math.random,
) {
  const normalizedId = normalizeParticipantId(participantId);
  if (!normalizedId) throw new Error('נדרש קוד משתתף/ת להקצאה.');

  const state = readAllocationState(storage);
  const existing = state.participants[normalizedId];
  if (existing) return { duplicate: true, assignment: existing };

  const allocationIndex = state.nextIndex + 1;
  while (state.sequence.length < allocationIndex) {
    const pair = random() < 0.5
      ? [STUDY_PATHS[0], STUDY_PATHS[1]]
      : [STUDY_PATHS[1], STUDY_PATHS[0]];
    state.sequence.push(...pair);
  }

  const assignment = {
    activityPath: state.sequence[state.nextIndex],
    method: 'demo_local_permuted_blocks',
    chosenAt: Date.now(),
    allocationIndex,
    blockNumber: Math.ceil(allocationIndex / STUDY_PATHS.length),
    positionInBlock: ((allocationIndex - 1) % STUDY_PATHS.length) + 1,
  };
  state.participants[normalizedId] = assignment;
  state.nextIndex = allocationIndex;
  storage.setItem(ALLOCATION_STORAGE_KEY, JSON.stringify(state));

  return { duplicate: false, assignment };
}

export function assignChosenStudyPath(
  participantId,
  activityPath,
  storage = window.localStorage,
) {
  const normalizedId = normalizeParticipantId(participantId);
  if (!normalizedId) throw new Error('נדרש קוד משתתף/ת להקצאה.');
  if (!STUDY_PATHS.includes(activityPath)) {
    throw new Error('יש לבחור מסלול למידה תקין.');
  }

  const state = readAllocationState(storage);
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
  return Boolean(readAllocationState(storage).participants[normalizedId]);
}
