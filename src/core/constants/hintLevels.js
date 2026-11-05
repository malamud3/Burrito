// ============================================================
// src/core/constants/hintLevels.js
// Graduated bridging hints per CT skill.
// ============================================================

import { HintLevel, CTSkill } from '../types/enums';

export const HINT_LEVEL_LABELS = {
  [HintLevel.NONE]: 'ללא רמז',
  [HintLevel.META_COGNITIVE]: '💡 רמז מטא-קוגניטיבי (רמה 1)',
  [HintLevel.STRUCTURE_ORIENTED]: '🔗 רמז מכוון-מבנה (רמה 2)',
};

export const BRIDGING_HINTS = {
  [CTSkill.DECOMPOSITION]: {
    [HintLevel.META_COGNITIVE]:
      'חשוב/י על המשימה שפתרת הרגע. אילו שלבים עזרו לך להגיע לתשובה? נסה/י ליישם אותם גם כאן.',
    [HintLevel.STRUCTURE_ORIENTED]:
      'שים/י לב: גם בבעיה המקורית וגם במשימה הקודמת, היה צריך לפרק את העלויות לשני חלקים — קבוע ומשתנה — ולבנות ביטוי לכל אפשרות. נסה/י לעשות את אותו הדבר כאן.',
  },
  [CTSkill.ABSTRACTION]: {
    [HintLevel.META_COGNITIVE]:
      'במשימה הקודמת, מצאת שחלק מהנתונים לא היו רלוונטיים. בדוק/י — האם גם כאן יש נתונים שמסיחים?',
    [HintLevel.STRUCTURE_ORIENTED]:
      'שים/י לב: בשתי הבעיות, הנתונים המרכזיים הם עלות קבועה ועלות לכל יחידה. כל השאר — שמות, טלפונים, שעות — הם פרטים שלא משנים את החישוב.',
  },
  [CTSkill.ALGORITHMIC]: {
    [HintLevel.META_COGNITIVE]:
      'במשימה הקודמת, בנית רצף פעולות מסודר. נסה/י לזכור מה היה הסדר ולהשתמש בו גם כאן.',
    [HintLevel.STRUCTURE_ORIENTED]:
      'שים/י לב: סדר הפעולות זהה — (1) הגדרת שתי פונקציות, (2) השוואה ביניהן, (3) פתרון המשוואה, (4) בדיקה מה קורה מכל צד של נקודת האיזון.',
  },
};
