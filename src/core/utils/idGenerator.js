// ============================================================
// src/core/utils/idGenerator.js
// ============================================================

let counter = 0;

export function generateId(prefix = 'id') {
  counter += 1;
  return `${prefix}_${Date.now()}_${counter}`;
}

export const generateLogId = () => generateId('log');
export const generateStepId = () => generateId('step');
