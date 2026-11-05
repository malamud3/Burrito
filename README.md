# CT-Adapt

סביבת למידה אדפטיבית לחשיבה חישובית (CT) במתמטיקה — React + Vite.

## הרצה

```bash
npm install
npm run dev      # שרת פיתוח  → http://localhost:5173
npm run build    # בנייה לפרודקשן (dist/)
npm test         # בדיקות יחידה + בדיקת זרימה מלאה
```

## זרימת הפעילות

`כניסה → הצגת בעיה → פתרון (3 כלי CT) → [זיהוי קושי → משימת תמיכה אנלוגית → חזרה לבעיה + רמזי גישור] → משימת העברה → דירוג מאמץ (Paas 1–9) → סיום`

* **קבוצה אדפטיבית** — משימת התמיכה נבחרת לפי המיומנות שבה זוהה קושי.
* **קבוצה קבועה** — משימת תמיכה קבועה (סבב), בלי קשר לזיהוי.
* **מצב חוקר** — לוח בקרה: לוג מלא, ציר זמן לפי שלבים, דוח זיהוי קשיים, ייצוא JSON/CSV.
* כפתור "אני צריך/ה עזרה" תמיד מוביל למשימת תמיכה: אם אף כלל זיהוי לא הופעל, נבחרת המיומנות עם ההתקדמות הנמוכה ביותר.

## מבנה

```
src/
├── app/            App.jsx, screenRegistry.js (phase → screen)
├── core/           enums, קבועים (בעיות, שלבים, רמזים), utils
├── services/       לוגיקה טהורה, ללא React
├── context/        Session / Log / Phase / Notification + AppProviders
├── hooks/          תזמור: useLogger, useDifficultyDetector, useHintEscalation ...
├── components/     layout · screens · ct-tools · problem · hints · effort · researcher
└── styles/         global.css
tests/              בדיקות services + זרימה מלאה של ה-UI
```

## עקרונות SOLID בקוד

| עיקרון | יישום |
|---|---|
| **S** | כל service/hook/context אחראי על דבר אחד (זיהוי קושי, בחירת משימה, ניתוח לוגים, ייצוא, ניווט...) |
| **O** | `registerDetectionRule`, `registerSelectionStrategy`, `screenRegistry` — הוספה בלי לשנות קוד קיים |
| **L** | כל כלי CT מקבל אותו `status` ועטוף ב-`CTToolWrapper` — ניתנים להחלפה |
| **I** | קומפוננטות מקבלות רק את מה שהן צריכות; hooks ייעודיים (`useEffortScale`, `useHintEscalation`) במקום context אחד גדול |
| **D** | קומפוננטות תלויות ב-hooks/contexts ולא ב-services ישירות; ה-services לא מכירים את React |

## התאמות נפוצות

* **תוכן הבעיות** — `src/core/constants/problems.js`
* **רמזי גישור** — `src/core/constants/hintLevels.js`
* **ספי זיהוי קושי** — `src/services/DifficultyDetectionService.js` (הספים הם ערכי התחלה ויש לכייל אותם בפיילוט)
* **שמירה בין רענונים / שרת** — כרגע הלוגים נשמרים בזיכרון בלבד. להוספת שמירה, ממשו שליחה ב-`LogContext.addLog` (נקודת הכתיבה היחידה) או הוסיפו service חדש.
