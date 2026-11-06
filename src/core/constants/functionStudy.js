export const FUNCTION_STUDY_QUESTIONS = Object.freeze({
  domain: {
    label: 'א. מצאו את תחום ההגדרה של הפונקציה.',
    rows: 2,
    placeholder: 'תחום ההגדרה:',
  },
  derivative: {
    label: 'ב. מצאו את הנגזרת של הפונקציה.',
    rows: 2,
    placeholder: 'הנגזרת:',
  },
  criticalPoints: {
    label: 'ג. מצאו את ערכי x החשודים כנקודות קיצון.',
    rows: 2,
    placeholder: 'ערכי x חשודים:',
  },
  extremaPoints: {
    label: 'ד. מצאו את נקודות הקיצון וסווגו אותן.',
    rows: 2,
    placeholder: 'נקודות הקיצון:',
  },
  verticalAsymptotes: {
    label: 'ה. מצאו את האסימפטוטות האנכיות.',
    rows: 2,
    placeholder: 'אסימפטוטות אנכיות:',
  },
  horizontalAsymptote: {
    label: 'ו. מצאו את האסימפטוטה האופקית.',
    rows: 2,
    placeholder: 'אסימפטוטה אופקית:',
  },
  yAxisIntercept: {
    label: 'ז. מצאו את נקודת החיתוך עם ציר y.',
    rows: 2,
    placeholder: 'חיתוך עם ציר y:',
  },
  xAxisIntercept: {
    label: 'ח. מצאו את נקודת החיתוך עם ציר x.',
    rows: 2,
    placeholder: 'חיתוך עם ציר x:',
  },
  signBehavior: {
    label: 'ט. קבעו את סימן הנגזרת ואת תחומי העלייה והירידה.',
    rows: 3,
    placeholder: 'טבלת סימנים ותחומי עלייה וירידה:',
  },
});

export const FUNCTION_STUDY_STEPS = Object.freeze([
  {
    id: 'domain',
    title: 'תחום ההגדרה',
    questionKeys: ['domain'],
    hintKey: 'domain',
  },
  {
    id: 'extrema',
    title: 'נקודות החשודות כנקודות קיצון',
    questionKeys: ['derivative', 'criticalPoints', 'extremaPoints'],
    hintKey: 'extrema',
  },
  {
    id: 'asymptotes',
    title: 'אסימפטוטות מקבילות לצירים',
    questionKeys: ['verticalAsymptotes', 'horizontalAsymptote'],
    hintKey: 'asymptotes',
  },
  {
    id: 'intercepts',
    title: 'נקודות חיתוך עם הצירים',
    questionKeys: ['yAxisIntercept', 'xAxisIntercept'],
    hintKey: 'intercepts',
  },
  {
    id: 'graph',
    title: 'שרטוט הפונקציה',
    questionKeys: ['signBehavior'],
    graph: true,
  },
]);
