import { ActivityPath } from '../core/types/enums';
import {
  ALLOCATION_BLOCK_SIZE,
  ALLOCATION_METHOD,
  ALLOCATION_STORAGE_KEY,
  STUDY_PATHS,
} from '../core/constants/study';

function randomIndex(max) {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return Math.floor((values[0] / (0x100000000)) * max);
  }
  return Math.floor(Math.random() * max);
}

function createBalancedBlock(blockNumber) {
  const paths = [
    ActivityPath.CLASSIC,
    ActivityPath.CLASSIC,
    ActivityPath.RENATO,
    ActivityPath.RENATO,
  ];
  for (let index = paths.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1);
    [paths[index], paths[swapIndex]] = [paths[swapIndex], paths[index]];
  }
  return paths.map((activityPath, offset) => ({
    activityPath,
    blockNumber,
    positionInBlock: offset + 1,
  }));
}

function readAllocation(storage) {
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

export function assignStudyPath(participantId, storage = window.localStorage) {
  const normalizedId = normalizeParticipantId(participantId);
  if (!normalizedId) throw new Error('נדרש קוד משתתף/ת להקצאה.');

  const state = readAllocation(storage);
  const existing = state.participants[normalizedId];
  if (existing) return { duplicate: true, assignment: existing };

  const blockNumber = Math.floor(state.nextIndex / ALLOCATION_BLOCK_SIZE) + 1;
  const blockStart = (blockNumber - 1) * ALLOCATION_BLOCK_SIZE;
  if (state.sequence.length < blockStart + ALLOCATION_BLOCK_SIZE) {
    state.sequence.push(...createBalancedBlock(blockNumber));
  }

  const scheduled = state.sequence[state.nextIndex];
  if (!STUDY_PATHS.includes(scheduled?.activityPath)) {
    throw new Error('רצף ההקצאה אינו תקין; ההקצאה נעצרה כדי למנוע שיבוש במחקר.');
  }

  const assignment = {
    activityPath: scheduled.activityPath,
    method: ALLOCATION_METHOD,
    allocationIndex: state.nextIndex + 1,
    blockNumber: scheduled.blockNumber,
    positionInBlock: scheduled.positionInBlock,
    assignedAt: Date.now(),
  };
  state.participants[normalizedId] = assignment;
  state.nextIndex += 1;
  storage.setItem(ALLOCATION_STORAGE_KEY, JSON.stringify(state));

  return { duplicate: false, assignment };
}

export function isParticipantAlreadyAssigned(participantId, storage = window.localStorage) {
  const normalizedId = normalizeParticipantId(participantId);
  if (!normalizedId) return false;
  return Boolean(readAllocation(storage).participants[normalizedId]);
}
