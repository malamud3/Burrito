import React, { useEffect } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useLogContext } from '../../context/LogContext';
import { useNotification } from '../../context/NotificationContext';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import { useLogger } from '../../hooks/useLogger';
import { ActivityPath, LogActionType, Mode } from '../../core/types/enums';
import { FUNCTION_ASSESSMENT_QUESTIONS, PRE_ASSESSMENT_FUNCTION } from '../../core/constants/functionAssessments';
import {
  AUTO_ASSIGN_STUDY_PATH,
  STUDY_DURATION_MINUTES,
} from '../../core/constants/study';
import {
  assignChosenStudyPath,
  assignDemoStudyPath,
} from '../../services/StudyAllocationService';
import FunctionAssessmentView from '../assessment/FunctionAssessmentView';

export default function PreAssessmentScreen() {
  const {
    session,
    assignStudyPath,
    updatePreAssessment,
    startLearning,
  } = useSessionContext();
  const { logs, addLog } = useLogContext();
  const { log } = useLogger();
  const { goToClassic, goToRenato } = usePhaseNavigation();
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

    let assignment;
    try {
      const result = AUTO_ASSIGN_STUDY_PATH
        ? assignDemoStudyPath(session.studentId)
        : assignChosenStudyPath(session.studentId, session.activityPath);
      if (result.duplicate) {
        show('קוד המשתתף/ת כבר הוקצה בדפדפן זה. לא ניתן להתחיל פעילות נוספת.', '⚠️');
        return;
      }
      assignment = result.assignment;
    } catch (error) {
      show(error.message || 'לא ניתן לבצע הקצאה להדגמה.', '⚠️');
      return;
    }

    const { activityPath, ...allocation } = assignment;
    assignStudyPath(activityPath, allocation);
    log(LogActionType.PRE_ASSESSMENT_SUBMIT, {
      schemaVersion: 1,
      functionExpression: PRE_ASSESSMENT_FUNCTION.expression,
      assessment: answers,
    });
    addLog(LogActionType.ACTIVITY_START, {
      schemaVersion: 1,
      studentId: session.studentId,
      sessionId: session.sessionId,
      activityPath,
      mode: Mode.STUDENT,
      ...assignment,
      studyDurationMinutes: STUDY_DURATION_MINUTES,
    });
    const startedAt = startLearning();
    addLog(LogActionType.LEARNING_START, {
      studentId: session.studentId,
      sessionId: session.sessionId,
      activityPath,
      startedAt,
      durationLimitMinutes: STUDY_DURATION_MINUTES,
    });
    if (activityPath === ActivityPath.RENATO) goToRenato();
    else goToClassic();
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
