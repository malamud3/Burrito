export const RENATO_FUNCTION = 'x² / (x² − 4x + 3)';

export const RENATO_TABLE_COLUMNS = [
  { id: 'left-of-zero', xLabel: 'x < 0', testX: '-1', isPoint: false, derivative: '-', behavior: '↘', domain: 1 },
  { id: 'zero', xLabel: '0', testX: '0', isPoint: true, derivative: '0', behavior: 'Min', domain: 1 },
  { id: 'zero-to-one', xLabel: '0 < x < 1', testX: '0.5', isPoint: false, derivative: '+', behavior: '↗', domain: 2 },
  { id: 'one', xLabel: '1', testX: '1', isPoint: true, derivative: '///', behavior: '///', domain: 0 },
  { id: 'one-to-extremum', xLabel: '1 < x < 1.5', testX: '1.2', isPoint: false, derivative: '+', behavior: '↗', domain: 3 },
  { id: 'extremum', xLabel: '1.5', testX: '1.5', isPoint: true, derivative: '0', behavior: 'Max', domain: 3 },
  { id: 'extremum-to-three', xLabel: '1.5 < x < 3', testX: '2', isPoint: false, derivative: '-', behavior: '↘', domain: 3 },
  { id: 'three', xLabel: '3', testX: '3', isPoint: true, derivative: '///', behavior: '///', domain: 0 },
  { id: 'right-of-three', xLabel: 'x > 3', testX: '4', isPoint: false, derivative: '-', behavior: '↘', domain: 4 },
];
