// ============================================================
// src/core/constants/ctSkills.js
// ============================================================

import { CTSkill } from '../types/enums';

export const CT_SKILL_CONFIG = {
  [CTSkill.DECOMPOSITION]: {
    label: 'פירוק',
    icon: '🧩',
    colorClass: 'decomp',
    description: 'פירוק הבעיה לתתי-משימות',
    instructions:
      'פרק/י את הבעיה לתתי-משימות. מהם השלבים שצריך לבצע כדי להגיע לפתרון?',
    difficultyMessage:
      'נראה שיש קושי בפירוק הבעיה לשלבים. בוא/י ננסה להתאמן על זה.',
  },
  [CTSkill.ABSTRACTION]: {
    label: 'הפשטה',
    icon: '🔍',
    colorClass: 'abstract',
    description: 'זיהוי המידע הרלוונטי',
    instructions: 'מיין/י את הנתונים: מה רלוונטי לפתרון ומה מיותר?',
    difficultyMessage:
      'נראה שיש קושי בזיהוי הנתונים החשובים. בוא/י ננסה להתאמן על זה.',
  },
  [CTSkill.ALGORITHMIC]: {
    label: 'אלגוריתמיקה',
    icon: '⚡',
    colorClass: 'algo',
    description: 'בניית רצף פעולות',
    instructions: 'בנה/י את סדר הפעולות המתמטיות שיובילו לפתרון.',
    difficultyMessage:
      'נראה שיש קושי בבניית סדר הפעולות. בוא/י ננסה להתאמן על זה.',
  },
  [CTSkill.PATTERN_RECOGNITION]: {
    label: 'זיהוי תבניות',
    icon: '🔗',
    colorClass: 'pattern',
    description: 'זיהוי מבנים וקשרים חוזרים',
    instructions: 'זהה/י מה חוזר או דומה בין השלבים והייצוגים.',
    difficultyMessage: 'נראה שיש קושי בזיהוי המבנה החוזר. בוא/י נפרק את הקשרים.',
  },
  [CTSkill.DEBUGGING]: {
    label: 'ניפוי שגיאות',
    icon: '🪲',
    colorClass: 'debugging',
    description: 'בדיקה, איתור ותיקון של טעויות',
    instructions: 'בדוק/י את התוצאה מול התנאים וחפש/י היכן התהליך השתבש.',
    difficultyMessage: 'נראה שיש קושי באיתור השגיאה. בוא/י נבדוק את התהליך.',
  },
  [CTSkill.SELF_REGULATION]: {
    label: 'ויסות עצמי',
    icon: '🧭',
    colorClass: 'self-regulation',
    description: 'ניטור, בקשת עזרה ותכנון הלמידה',
    instructions: 'בחר/י אסטרטגיה, עקוב/י אחר ההתקדמות ובקש/י עזרה כשצריך.',
    difficultyMessage: 'נראה שכדאי לעצור, לבדוק את ההתקדמות ולבחור אסטרטגיה.',
  },
};
