import React, { useState } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useLogContext } from '../../context/LogContext';
import { useNotification } from '../../context/NotificationContext';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import { LogActionType, Mode } from '../../core/types/enums';
import {
  STUDY_DURATION_MINUTES,
} from '../../core/constants/study';
import LoginView from '../login/LoginView';

export default function LoginScreen() {
  const [studentId, setStudentId] = useState('');
  const [mode, setMode] = useState(Mode.STUDENT);
  const { initSession } = useSessionContext();
  const { addLog } = useLogContext();
  const { goToPreAssessment, goToDashboard } = usePhaseNavigation();
  const { show } = useNotification();

  const handleStart = () => {
    if (!studentId.trim()) return show('נא להזין קוד תלמיד/ה', '⚠️');
    const participantId = studentId.trim();
    const sessionId = initSession(
      participantId,
      'renato',
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
      onStudentIdChange={setStudentId}
      onModeChange={setMode}
      onStart={handleStart}
    />
  );
}
