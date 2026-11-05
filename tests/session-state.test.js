import {
  createInitialSessionState,
  hasMeaningfulSessionData,
  normalizeSessionState,
  sessionReducer,
} from '../src/core/session/sessionState';
import {
  createSessionStorageInitializer,
  loadSession,
  saveSession,
  SESSION_STORAGE_KEY,
} from '../src/services/SessionStorage';
import { ActivityPath } from '../src/core/types/enums';

function createMemoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

test('normalizes legacy and partial session data with complete defaults', () => {
  const session = normalizeSessionState({
    studentId: 'S-01',
    activityPath: ActivityPath.RENATO,
    renatoWork: {
      cards: { domain: { answer: 'x ≠ 1' } },
      graphStrokes: [{ points: [1, 2] }],
    },
  });

  expect(session).toMatchObject({
    studentId: 'S-01',
    activityPath: ActivityPath.RENATO,
    renatoWork: {
      cards: { domain: { order: 1, answer: 'x ≠ 1' } },
      graphStrokes: [{ points: [1, 2] }],
    },
    graphWork: { graphStrokes: [{ points: [1, 2] }] },
    answers: { main: '', transfer: '' },
  });
  expect(normalizeSessionState(null)).toBeNull();
});

test('session reducer preserves immutable updates and monotonic hint progress', () => {
  const initial = createInitialSessionState();
  const withHint = sessionReducer(initial, {
    type: 'SET_HINT_LEVEL',
    payload: 2,
  });
  const lowerHint = sessionReducer(withHint, {
    type: 'SET_HINT_LEVEL',
    payload: 1,
  });

  expect(withHint.maxHintReached).toBe(2);
  expect(lowerHint.hintLevel).toBe(1);
  expect(lowerHint.maxHintReached).toBe(2);
  expect(initial.hintLevel).toBe(0);
});

test('session storage loads, persists, and removes only meaningful sessions', () => {
  const storage = createMemoryStorage();
  const initial = createInitialSessionState();

  expect(createSessionStorageInitializer(storage)).toEqual(initial);
  saveSession({ ...initial, studentId: 'S-02' }, storage);
  expect(loadSession(storage)).toMatchObject({ studentId: 'S-02' });

  saveSession(initial, storage);
  expect(storage.getItem(SESSION_STORAGE_KEY)).toBeNull();
});

test('session storage restores defaults when persisted JSON is malformed', () => {
  const storage = createMemoryStorage({
    [SESSION_STORAGE_KEY]: '{invalid',
  });
  const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});

  expect(loadSession(storage)).toBeNull();
  expect(createSessionStorageInitializer(storage)).toEqual(createInitialSessionState());
  expect(warning).toHaveBeenCalled();

  warning.mockRestore();
});

test('session meaningful-data policy recognizes active and previously used sessions', () => {
  const initial = createInitialSessionState();

  expect(hasMeaningfulSessionData(initial)).toBe(false);
  expect(hasMeaningfulSessionData({ ...initial, isActive: true })).toBe(true);
  expect(hasMeaningfulSessionData({
    ...initial,
    answers: { ...initial.answers, main: 'saved response' },
  })).toBe(true);
});
