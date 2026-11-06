import { FUNCTION_ASSESSMENT_QUESTIONS } from './functionAssessments';

export const ASSESSMENT_SCORE_MAX = FUNCTION_ASSESSMENT_QUESTIONS.length * 2;
export const ASSESSMENT_RUBRIC_VERSION = 2;

export const ASSESSMENT_SCORE_ANCHORS = Object.freeze({
  0: 'אין תשובה, תשובה לא רלוונטית או טעות מהותית.',
  1: 'הבנה חלקית או דרך נכונה עם חוסר/טעות משמעותיים.',
  2: 'תשובה נכונה ושלמה בהתאם למאפיינים הנדרשים בסעיף.',
});

export const ASSESSMENT_RUBRIC_CRITERIA = Object.freeze({
  domain: 'כל ערכי x שאינם בתחום מזוהים.',
  derivative: 'הנגזרת נכונה או שקולה אלגברית.',
  criticalPoints: 'ערכי x החשודים מזוהים, תוך הבחנה בין תחום ההגדרה.',
  extremaPoints: 'נקודות הקיצון והסיווג שלהן נכונים.',
  verticalAsymptotes: 'האסימפטוטות האנכיות מזוהות, ללא נקודות סליקות.',
  horizontalAsymptote: 'האסימפטוטה האופקית נקבעת לפי מבנה הפונקציה.',
  yAxisIntercept: 'החיתוך עם ציר y מחושב ונכתב כנקודה.',
  xAxisIntercept: 'החיתוך עם ציר x מחושב ונבדק מול תחום ההגדרה.',
  signBehavior: 'סימן הנגזרת ותחומי העלייה/ירידה עקביים.',
  graph: 'הסקיצה עקבית עם האסימפטוטות, החיתוכים והקיצון.',
});
