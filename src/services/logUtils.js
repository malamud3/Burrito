// ============================================================
// src/services/logUtils.js
// Pure helpers shared by services (DRY).
// ============================================================

/** Seconds between first and last log entry in the given list. */
export function getTimeInTool(logs) {
  if (!logs || logs.length < 2) return 0;
  const sorted = [...logs].sort((a, b) => a.timestamp - b.timestamp);
  return (sorted[sorted.length - 1].timestamp - sorted[0].timestamp) / 1000;
}

export function countBy(array, key) {
  return array.reduce((acc, item) => {
    const val = item[key] || 'unknown';
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
}
