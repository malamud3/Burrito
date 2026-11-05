export const FUNCTION_ASSESSMENT_QUESTIONS = Object.freeze([
  { key: 'domain', label: 'א. מצאו את תחום ההגדרה.', rows: 2 },
  { key: 'derivative', label: 'ב. מצאו את הנגזרת.', rows: 3 },
  { key: 'criticalPoints', label: 'ג. מצאו את ערכי x החשודים כנקודות קיצון.', rows: 2 },
  { key: 'extremaPoints', label: 'ד. מצאו וסווגו את נקודות הקיצון.', rows: 3 },
  { key: 'verticalAsymptotes', label: 'ה. מצאו את האסימפטוטות האנכיות.', rows: 2 },
  { key: 'horizontalAsymptote', label: 'ו. מצאו את האסימפטוטה האופקית.', rows: 2 },
  { key: 'yAxisIntercept', label: 'ז. מצאו את נקודת החיתוך עם ציר y.', rows: 2 },
  { key: 'xAxisIntercept', label: 'ח. מצאו את נקודת החיתוך עם ציר x.', rows: 2 },
  { key: 'signBehavior', label: 'ט. קבעו את סימן הנגזרת ואת תחומי העלייה והירידה.', rows: 3 },
  { key: 'graph', label: 'י. שרטטו סקיצה של הגרף וציינו את המאפיינים שסימנתם.', rows: 4 },
]);

export const PRE_ASSESSMENT_FUNCTION = Object.freeze({
  name: 'h(x)',
  numerator: 'x²',
  denominator: 'x² − 8x + 15',
  expression: 'x² / (x² − 8x + 15)',
});

export const TRANSFER_ASSESSMENT_FUNCTION = Object.freeze({
  name: 'g(x)',
  numerator: 'x²',
  denominator: 'x² − 6x + 8',
  expression: 'x² / (x² − 6x + 8)',
});

export const createEmptyFunctionAssessment = () =>
  Object.fromEntries(FUNCTION_ASSESSMENT_QUESTIONS.map(({ key }) => [key, '']));
