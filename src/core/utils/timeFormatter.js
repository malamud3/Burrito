// ============================================================
// src/core/utils/timeFormatter.js
// ============================================================

export function formatTime(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds || 0));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function formatTimestamp(date = new Date()) {
  return date.toISOString();
}

export function formatTimeForLog(timestamp) {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const base = date.toLocaleTimeString('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  return `${base}.${String(date.getMilliseconds()).padStart(3, '0')}`;
}
