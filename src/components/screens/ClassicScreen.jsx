import React from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import { useLogger } from '../../hooks/useLogger';
import { LogActionType } from '../../core/types/enums';
import { RENATO_FUNCTION } from '../../core/constants/renato';
import { STUDY_DURATION_MINUTES, STUDY_HINTS } from '../../core/constants/study';
import { useNotification } from '../../context/NotificationContext';
import ProgressBar from '../layout/ProgressBar';
import FunctionGraph from '../math/FunctionGraph';
import StudyHint from '../math/StudyHint';

const QUESTIONS = [
  {
    key: 'domain',
    label: 'א. מצאו את תחום ההגדרה של הפונקציה.',
    rows: 2,
    placeholder: 'תחום ההגדרה:',
  },
  {
    key: 'derivative',
    label: 'ב. מצאו את הנגזרת של הפונקציה.',
    rows: 2,
    placeholder: 'הנגזרת:',
  },
  {
    key: 'criticalPoints',
    label: 'ג. מצאו את ערכי x החשודים כנקודות קיצון.',
    rows: 2,
    placeholder: 'ערכי x חשודים:',
  },
  {
    key: 'extremaPoints',
    label: 'ד. מצאו את נקודות הקיצון וסווגו אותן.',
    rows: 2,
    placeholder: 'נקודות הקיצון:',
  },
  {
    key: 'verticalAsymptotes',
    label: 'ה. מצאו את האסימפטוטות האנכיות.',
    rows: 2,
    placeholder: 'אסימפטוטות אנכיות:',
  },
  {
    key: 'horizontalAsymptote',
    label: 'ו. מצאו את האסימפטוטה האופקית.',
    rows: 2,
    placeholder: 'אסימפטוטה אופקית:',
  },
  {
    key: 'yAxisIntercept',
    label: 'ז. מצאו את נקודת החיתוך עם ציר y.',
    rows: 2,
    placeholder: 'חיתוך עם ציר y:',
  },
  {
    key: 'xAxisIntercept',
    label: 'ח. מצאו את נקודת החיתוך עם ציר x.',
    rows: 2,
    placeholder: 'חיתוך עם ציר x:',
  },
  {
    key: 'signBehavior',
    label: 'ט. קבעו את סימן הנגזרת ואת תחומי העלייה והירידה.',
    rows: 3,
    placeholder: 'טבלת סימנים ותחומי עלייה וירידה:',
  },
];

export default function ClassicScreen() {
  const { session, updateClassicWork, updateGraphWork } = useSessionContext();
  const { goToTransferAssessment } = usePhaseNavigation();
  const { log } = useLogger();
  const { show } = useNotification();
  const graphWork = session.graphWork;

  const handleChange = (key, value) => {
    updateClassicWork({ [key]: value });
    log(LogActionType.EDIT, { field: `classic.${key}`, value });
  };

  const handleGraphUpdate = (patch) => {
    updateGraphWork(patch);
    log(LogActionType.EDIT, { field: 'classic.graph', ...patch });
  };

  const handleFinish = () => {
    if (!graphWork.graphStrokes.length) {
      show('לפני הסיום, יש לשרטט את הפונקציה על מערכת הצירים.', '⚠️');
      return;
    }

    log(LogActionType.ACTIVITY_COMPLETE, {
      schemaVersion: 1,
      assessment: {
        domain: session.classicWork.domain,
        derivative: session.classicWork.derivative,
        criticalPoints: session.classicWork.criticalPoints,
        extremaPoints: session.classicWork.extremaPoints,
        verticalAsymptotes: session.classicWork.verticalAsymptotes,
        horizontalAsymptote: session.classicWork.horizontalAsymptote,
        yAxisIntercept: session.classicWork.yAxisIntercept,
        xAxisIntercept: session.classicWork.xAxisIntercept,
        signBehavior: session.classicWork.signBehavior,
        graph: graphWork,
      },
      work: { ...session.classicWork, graph: graphWork },
    });
    goToTransferAssessment();
  };

  return (
    <div className="container-wide learning-screen classic-screen" dir="rtl">
      <ProgressBar />
      <header className="renato-title">
        <span className="renato-eyebrow">מסלול קלאסי</span>
        <h1>חקירת פונקציה</h1>
      </header>
      <p className="study-protocol-note">
        לרשותכם {STUDY_DURATION_MINUTES} דקות, דף טיוטה וכלי שרטוט דיגיטלי זהה לזה שבמסלול רנאטו.
        ניתן לבקש מהמנחה הבהרה טכנית בלבד, ללא רמזים מתמטיים.
      </p>

      <section className="renato-function" aria-label="הפונקציה הנחקרת">
        <span className="renato-function-label">הפונקציה הנחקרת</span>
        <span className="renato-function-expression" dir="ltr">
          f(x) = {RENATO_FUNCTION}
        </span>
      </section>

      <section className="card" aria-label="שאלות חקירת הפונקציה">
        <p>
          ענו על השאלות ופתרו בדרך הנוחה לכם. אפשר להשתמש בדף טיוטה לצורך
          החישובים והשרטוט.
        </p>
        {QUESTIONS.map(({ key, label, rows, placeholder }) => {
          const hintKey = {
            domain: 'domain',
            extremaPoints: 'extrema',
            horizontalAsymptote: 'asymptotes',
            xAxisIntercept: 'intercepts',
          }[key];
          return (
            <React.Fragment key={key}>
              <div className="field">
                <label htmlFor={`classic-${key}`}>{label}</label>
                <textarea
                  id={`classic-${key}`}
                  rows={rows}
                  dir="auto"
                  placeholder={placeholder}
                  value={session.classicWork[key]}
                  onChange={(event) => handleChange(key, event.target.value)}
                />
              </div>
              {hintKey && (
                <StudyHint
                  hints={STUDY_HINTS[hintKey]}
                  onReveal={(hintIndex) => log(LogActionType.HINT_REQUEST, {
                    phase: 'classic',
                    stepId: hintKey,
                    hintIndex,
                    totalHints: STUDY_HINTS[hintKey].length,
                  })}
                />
              )}
            </React.Fragment>
          );
        })}
      </section>

      <section className="card" aria-label="שרטוט משותף לשני המסלולים">
        <FunctionGraph work={graphWork} onUpdate={handleGraphUpdate} />
        <div className="btn-group" style={{ justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={handleFinish}>
            סיימתי את חקירת הפונקציה
          </button>
        </div>
      </section>
    </div>
  );
}
