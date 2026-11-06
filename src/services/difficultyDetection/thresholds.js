/**
 * Initial thresholds for the demonstration. Calibrate these values during a
 * pilot without changing the detection rules themselves.
 */
export const DIFFICULTY_THRESHOLDS = Object.freeze({
  decomposition: Object.freeze({
    maxLowProgress: 1,
    churningActions: 4,
    stalledSeconds: 120,
    restartingEdits: 8,
  }),
  abstraction: Object.freeze({
    manyErrors: 3,
    stalledSeconds: 90,
  }),
  algorithmic: Object.freeze({
    maxLowOutput: 1,
    frequentEdits: 10,
    stalledSeconds: 120,
  }),
});
