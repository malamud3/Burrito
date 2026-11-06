import React, { useEffect } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useLogContext } from '../../context/LogContext';
import { useNotification } from '../../context/NotificationContext';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import { useLogger } from '../../hooks/useLogger';
import { LogActionType } from '../../core/types/enums';
import { FUNCTION_ASSESSMENT_QUESTIONS, TRANSFER_ASSESSMENT_FUNCTION } from '../../core/constants/functionAssessments';
import FunctionAssessmentView from '../assessment/FunctionAssessmentView';

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
    <FunctionAssessmentView
      eyebrow="בוחן משותף לשני המסלולים"
      title="בוחן העברה"
      description="בחנו את הפונקציה החדשה באופן עצמאי. ענו על כל הסעיפים ללא רמזים או כלי העזר מהפעילות. אפשר לכתוב חישובים בדף טיוטה."
      assessmentFunction={TRANSFER_ASSESSMENT_FUNCTION}
      functionAriaLabel="פונקציית הבוחן"
      questions={FUNCTION_ASSESSMENT_QUESTIONS}
      answers={answers}
      idPrefix="transfer"
      questionsAriaLabel="שאלות בוחן ההעברה"
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitLabel="הגשת הבוחן וסיום"
    />
  );
}
