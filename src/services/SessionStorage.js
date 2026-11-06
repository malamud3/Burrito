import {
  createInitialSessionState,
  hasMeaningfulSessionData,
  normalizeSessionState,
} from '../core/session/sessionState';

export const SESSION_STORAGE_KEY = 'ctAdapt.session';

const getBrowserStorage = () => (
  typeof window === 'undefined' ? null : window.localStorage
);

export function loadSession(storage = getBrowserStorage()) {
  if (!storage) return null;

  try {
    const raw = storage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return normalizeSessionState(JSON.parse(raw));
  } catch (error) {
    console.warn('Failed to restore session from localStorage', error);
    return null;
  }
}

export function saveSession(state, storage = getBrowserStorage()) {
  if (!storage) return;

  try {
    if (hasMeaningfulSessionData(state)) {
      storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
    } else {
      storage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (error) {
    // Persistence is a convenience for this local demo; it must not crash
    // the app when the browser denies writes or the quota is exhausted.
    console.warn('Failed to persist session to localStorage', error);
  }
}

export function createSessionStorageInitializer(storage = getBrowserStorage()) {
  return loadSession(storage) || createInitialSessionState();
}
