import React, { useEffect } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useLogContext } from '../../context/LogContext';
import { useNotification } from '../../context/NotificationContext';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import { useLogger } from '../../hooks/useLogger';
import { LogActionType } from '../../core/types/enums';
import ProgressBar from '../layout/ProgressBar';
import FunctionFraction from '../math/FunctionFraction';
import { FUNCTION_ASSESSMENT_QUESTIONS, TRANSFER_ASSESSMENT_FUNCTION } from '../../core/constants/functionAssessments';

export default function TransferAssessmentScreen() {
  const { session, updateTransferAssessment } = useSessionContext();
  const { logs } = useLogContext();
  const { log } = useLogger();
  const { goToCompletion } = usePhaseNavigation();
  const { show } = useNotification();
  const answers = session.transferAssessment;
  const isComplete = FUNCTION_ASSESSMENT_QUESTIONS.every(({ key }) => answers[key].trim());

  useEffect(() => {
    const alreadyLogged = logs.some(
      (entry) =>
        entry.actionType === LogActionType.TRANSFER_ASSESSMENT_START &&
        entry.data?.sessionId === session.sessionId,
    );
    if (!alreadyLogged) {
      log(LogActionType.TRANSFER_ASSESSMENT_START, {
        functionExpression: TRANSFER_ASSESSMENT_FUNCTION.expression,
        activityPath: session.activityPath,
      });
    }
  }, [logs, log, session.sessionId, session.activityPath]);

  const handleChange = (key, value) => {
    updateTransferAssessment({ [key]: value });
    log(LogActionType.EDIT, { field: `transferAssessment.${key}`, value });
  };

  const handleSubmit = () => {
    if (!isComplete) {
      show('יש להשלים את כל סעיפי הבוחן לפני ההגשה.', '⚠️');
      return;
    }

    log(LogActionType.TRANSFER_SUBMIT, {
      schemaVersion: 1,
      activityPath: session.activityPath,
      functionExpression: TRANSFER_ASSESSMENT_FUNCTION.expression,
      assessment: answers,
    });
    goToCompletion();
  };

  return (
    <div className="container-wide learning-screen transfer-assessment-screen" dir="rtl">
      <ProgressBar />
      <header className="renato-title">
        <span className="renato-eyebrow">בוחן משותף לשני המסלולים</span>
        <h1>בוחן העברה</h1>
      </header>

      <section className="card">
        <p>
          בחנו את הפונקציה החדשה באופן עצמאי. ענו על כל הסעיפים ללא רמזים או כלי
          העזר מהפעילות. אפשר לכתוב חישובים בדף טיוטה.
        </p>
        <div className="renato-function" aria-label="פונקציית הבוחן">
          <span className="renato-function-label">הפונקציה לבחינה</span>
          <FunctionFraction
            numerator={TRANSFER_ASSESSMENT_FUNCTION.numerator}
            denominator={TRANSFER_ASSESSMENT_FUNCTION.denominator}
            ariaLabel={`${TRANSFER_ASSESSMENT_FUNCTION.name} = ${TRANSFER_ASSESSMENT_FUNCTION.expression}`}
            functionName={TRANSFER_ASSESSMENT_FUNCTION.name}
            className="renato-function-expression"
          />
        </div>
      </section>

      <section className="card" aria-label="שאלות בוחן ההעברה">
        {FUNCTION_ASSESSMENT_QUESTIONS.map(({ key, label, rows }) => (
          <div className="field" key={key}>
            <label htmlFor={`transfer-${key}`}>{label}</label>
            <textarea
              id={`transfer-${key}`}
              rows={rows}
              dir="auto"
              value={answers[key]}
              onChange={(event) => handleChange(key, event.target.value)}
            />
          </div>
        ))}
        <div className="btn-group" style={{ justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={handleSubmit}>
            הגשת הבוחן וסיום
          </button>
        </div>
      </section>
    </div>
  );
}
