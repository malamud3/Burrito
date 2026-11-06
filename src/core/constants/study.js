import { ActivityPath } from '../types/enums';

export const STUDY_DURATION_SECONDS = 30 * 60;
export const STUDY_DURATION_MINUTES = STUDY_DURATION_SECONDS / 60;
export const ALLOCATION_STORAGE_KEY = 'ctAdapt.allocation';
export const AUTO_ASSIGN_STUDY_PATH = false;

export const STUDY_HINTS = Object.freeze({
  domain: [
    'אילו ערכי x מאפסים את המכנה?',
    'תחום ההגדרה כולל את כל המספרים הממשיים מלבד הערכים שמצאת.',
  ],
  asymptotes: [
    'לאסימפטוטה אנכית בדוק/י את הערכים שאינם בתחום ואת התנהגות הפונקציה לידם.',
    'לאסימפטוטה אופקית השווה/י בין דרגות המונה והמכנה ואת המקדמים המובילים.',
  ],
  intercepts: [
    'לחיתוך עם ציר y הצב/י x = 0.',
    'לחיתוך עם ציר x השווה/י את המונה לאפס, ואז ודא/י שהפתרונות בתחום.',
  ],
  extrema: [
    'גזור/י לפי כלל המנה, ופשט/י את המונה של הנגזרת.',
    'מצא/י נקודות שבהן הנגזרת מתאפסת, והתייחס/י בנפרד לערכים שאינם בתחום.',
    'סוג הקיצון נקבע לפי שינוי סימן הנגזרת משמאל ומימין לנקודה.',
  ],
});

export const STUDY_PATHS = Object.freeze([
  ActivityPath.CLASSIC,
  ActivityPath.RENATO,
]);
