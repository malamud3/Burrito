import React, { useState } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useLogContext } from '../../context/LogContext';
import { useNotification } from '../../context/NotificationContext';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import { ActivityPath, LogActionType, Mode } from '../../core/types/enums';
import {
  AUTO_ASSIGN_STUDY_PATH,
  STUDY_DURATION_MINUTES,
} from '../../core/constants/study';
import { isParticipantAlreadyAssigned } from '../../services/StudyAllocationService';
import LoginView from '../login/LoginView';

export default function LoginScreen() {
  const [studentId, setStudentId] = useState('');
  const [mode, setMode] = useState(Mode.STUDENT);
  const [activityPath, setActivityPath] = useState(ActivityPath.CLASSIC);
  const { initSession } = useSessionContext();
  const { addLog } = useLogContext();
  const { goToPreAssessment, goToDashboard } = usePhaseNavigation();
  const { show } = useNotification();

  const handleStart = () => {
    if (!studentId.trim()) return show('נא להזין קוד תלמיד/ה', '⚠️');
    const participantId = studentId.trim();
    if (mode === Mode.STUDENT) {
      try {
        if (isParticipantAlreadyAssigned(participantId)) {
          return show('קוד המשתתף/ת כבר הוקצה בדפדפן זה. אין להשתמש בו שוב בהדגמה.', '⚠️');
        }
      } catch (error) {
        return show(error.message || 'לא ניתן לבדוק את נתוני ההקצאה להדגמה.', '⚠️');
      }
    }

    const sessionId = initSession(
      participantId,
      mode === Mode.STUDENT && !AUTO_ASSIGN_STUDY_PATH ? activityPath : null,
      mode,
      null,
    );

    if (mode === Mode.RESEARCHER) {
      addLog(LogActionType.ACTIVITY_START, {
        schemaVersion: 1,
        studentId: participantId,
        sessionId,
        activityPath: null,
        mode,
      });
      goToDashboard();
    } else goToPreAssessment();

    return show('הפגישה החלה. בהצלחה!', '🚀');
  };

  return (
    <LoginView
      durationMinutes={STUDY_DURATION_MINUTES}
      studentId={studentId}
      mode={mode}
      activityPath={activityPath}
      showPathPicker={mode === Mode.STUDENT && !AUTO_ASSIGN_STUDY_PATH}
      onStudentIdChange={setStudentId}
      onModeChange={setMode}
      onActivityPathChange={setActivityPath}
      onStart={handleStart}
    />
  );
}
