import React, { useState } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useLogContext } from '../../context/LogContext';
import { useNotification } from '../../context/NotificationContext';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import { ActivityPath, LogActionType, Mode } from '../../core/types/enums';
import { STUDY_DURATION_MINUTES } from '../../core/constants/study';
import { assignStudyPath } from '../../services/StudyAllocationService';

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
    let activityPath = ActivityPath.CLASSIC;
    let allocation = null;
    if (mode === Mode.STUDENT) {
      try {
        const result = assignStudyPath(participantId);
        if (result.duplicate) {
          return show('קוד המשתתף/ת כבר הוקצה. אין להשתמש בו שוב במחקר.', '⚠️');
        }
        ({ activityPath, ...allocation } = result.assignment);
      } catch (error) {
        return show(error.message || 'לא ניתן לבצע הקצאה. נתוני המחקר לא שונו.', '⚠️');
      }
    }

    const sessionId = initSession(participantId, activityPath, mode, allocation);
    addLog(LogActionType.ACTIVITY_START, {
      schemaVersion: 1,
      studentId: participantId,
      sessionId,
      activityPath,
      mode,
      ...(allocation || {}),
      studyDurationMinutes: mode === Mode.STUDENT ? STUDY_DURATION_MINUTES : null,
    });

    if (mode === Mode.RESEARCHER) goToDashboard();
    else goToPreAssessment();

    return show('הפגישה החלה. בהצלחה!', '🚀');
  };

  return (
    <div className="container learning-screen login-screen">
      <div className="card login-card">
        <div className="login-brand">
          <span className="login-mark" aria-hidden="true">B</span>
          <h1>Burrito</h1>
        </div>
        <p className="login-subtitle">
          סביבת למידה להשוואה בין מסלול קלאסי למסלול חשיבה חישובית
        </p>

        <div className="field login-field">
          <label>קוד תלמיד/ה</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            placeholder="הכנס קוד משתתף/ת"
          />
        </div>

        <div className="field login-field">
          <label htmlFor="mode">מצב</label>
          <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value={Mode.STUDENT}>תלמיד/ה</option>
            <option value={Mode.RESEARCHER}>חוקר/ת — לוח בקרה</option>
          </select>
        </div>

        {mode === Mode.STUDENT && (
          <div className="login-research-notice" role="note">
            <strong>המסלול יוקצה אוטומטית</strong>
            <span>
              ההקצאה מאוזנת באקראי בבלוקים. שני המסלולים מוגבלים ל־
              {STUDY_DURATION_MINUTES} דקות, עם אותם כלי שרטוט ומדיניות עזרה.
            </span>
          </div>
        )}

        <div className="btn-group login-actions">
          <button className="btn btn-primary" onClick={handleStart}>
            התחל/י
          </button>
        </div>
      </div>
    </div>
  );
}
