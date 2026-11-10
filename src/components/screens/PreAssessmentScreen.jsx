import React, { useEffect } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useLogContext } from '../../context/LogContext';
import { useNotification } from '../../context/NotificationContext';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import { useLogger } from '../../hooks/useLogger';
import { LogActionType, Mode } from '../../core/types/enums';
import { FUNCTION_ASSESSMENT_QUESTIONS, PRE_ASSESSMENT_FUNCTION } from '../../core/constants/functionAssessments';
import { STUDY_DURATION_MINUTES } from '../../core/constants/study';
import FunctionAssessmentView from '../assessment/FunctionAssessmentView';

export default function PreAssessmentScreen() {
  const {
    session,
    updatePreAssessment,
    startLearning,
  } = useSessionContext();
  const { logs, addLog } = useLogContext();
  const { log } = useLogger();
  const { goToRenato } = usePhaseNavigation();
  const { show } = useNotification();
  const answers = session.preAssessment;
  const isComplete = FUNCTION_ASSESSMENT_QUESTIONS.every(({ key }) => answers[key].trim());

  useEffect(() => {
    const alreadyLogged = logs.some(
      (entry) =>
        entry.actionType === LogActionType.PRE_ASSESSMENT_START &&
        entry.data?.sessionId === session.sessionId,
    );
    if (!alreadyLogged) {
      log(LogActionType.PRE_ASSESSMENT_START, {
        functionExpression: PRE_ASSESSMENT_FUNCTION.expression,
      });
    }
  }, [logs, log, session.sessionId]);

  const handleChange = (key, value) => {
    updatePreAssessment({ [key]: value });
    log(LogActionType.EDIT, { field: `preAssessment.${key}`, value });
  };

  const handleSubmit = () => {
    if (!isComplete) {
      show('יש להשלים את כל סעיפי הבוחן המקדים לפני ההמשך.', '⚠️');
      return;
    }
    if (session.preAssessmentSubmittedAt) {
      show('הבוחן המקדים כבר הוגש בסשן הזה.', 'ℹ️');
      return;
    }

    log(LogActionType.PRE_ASSESSMENT_SUBMIT, {
      schemaVersion: 1,
      functionExpression: PRE_ASSESSMENT_FUNCTION.expression,
      assessment: answers,
    });
    addLog(LogActionType.ACTIVITY_START, {
      schemaVersion: 1,
      studentId: session.studentId,
      sessionId: session.sessionId,
      activityPath: session.activityPath,
      mode: Mode.STUDENT,
      studyDurationMinutes: STUDY_DURATION_MINUTES,
    });
    const startedAt = startLearning();
    addLog(LogActionType.LEARNING_START, {
      studentId: session.studentId,
      sessionId: session.sessionId,
      activityPath: session.activityPath,
      startedAt,
      durationLimitMinutes: STUDY_DURATION_MINUTES,
    });
    goToRenato();
  };

  return (
    <FunctionAssessmentView
      eyebrow="מדידת ידע לפני הפעילות"
      title="בוחן מקדים"
      description="ענו באופן עצמאי, לפני תחילת מסלול הלמידה. אין להשתמש ברמזים או בכלי העזר. התשובות נשמרות גם אם הפעילות מופסקת."
      assessmentFunction={PRE_ASSESSMENT_FUNCTION}
      functionAriaLabel="פונקציית הבוחן המקדים"
      questions={FUNCTION_ASSESSMENT_QUESTIONS}
      answers={answers}
      idPrefix="pre"
      questionsAriaLabel="שאלות הבוחן המקדים"
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitLabel="הגשת הבוחן והתחלת הלמידה"
    />
  );
}
