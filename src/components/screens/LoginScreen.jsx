import React, { useState } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useLogContext } from '../../context/LogContext';
import { useNotification } from '../../context/NotificationContext';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import { ActivityPath, LogActionType, Mode } from '../../core/types/enums';
import { STUDY_DURATION_MINUTES } from '../../core/constants/study';
import { recordStudyPathChoice } from '../../services/StudyAllocationService';

export default function LoginScreen() {
  const [studentId, setStudentId] = useState('');
  const [mode, setMode] = useState(Mode.STUDENT);
  const [selectedPath, setSelectedPath] = useState('');
  const { initSession } = useSessionContext();
  const { addLog } = useLogContext();
  const { goToPreAssessment, goToDashboard } = usePhaseNavigation();
  const { show } = useNotification();

  const handleStart = () => {
    if (!studentId.trim()) return show('נא להזין קוד תלמיד/ה', '⚠️');
    const participantId = studentId.trim();
    let activityPath = selectedPath || ActivityPath.CLASSIC;
    let pathChoice = null;
    if (mode === Mode.STUDENT) {
      if (!selectedPath) return show('נא לבחור מסלול למידה', '⚠️');
      try {
        const result = recordStudyPathChoice(participantId, selectedPath);
        if (result.duplicate) {
          return show('קוד המשתתף/ת כבר השתתף/ה. אין להשתמש בו שוב במחקר.', '⚠️');
        }
        ({ activityPath, ...pathChoice } = result.assignment);
      } catch (error) {
        return show(error.message || 'לא ניתן לשמור את בחירת המסלול.', '⚠️');
      }
    }

    const sessionId = initSession(participantId, activityPath, mode, pathChoice);
    addLog(LogActionType.ACTIVITY_START, {
      schemaVersion: 1,
      studentId: participantId,
      sessionId,
      activityPath,
      mode,
      ...(pathChoice || {}),
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
          <>
            <fieldset className="login-path-picker">
              <legend>בחר/י מסלול למידה</legend>
              <label className="login-path-option">
                <input
                  type="radio"
                  name="activityPath"
                  value={ActivityPath.CLASSIC}
                  checked={selectedPath === ActivityPath.CLASSIC}
                  onChange={(event) => setSelectedPath(event.target.value)}
                />
                <span>
                  <strong>המסלול הקלאסי</strong>
                  <span>חקירת הפונקציה באמצעות שאלות ישירות</span>
                </span>
              </label>
              <label className="login-path-option">
                <input
                  type="radio"
                  name="activityPath"
                  value={ActivityPath.RENATO}
                  checked={selectedPath === ActivityPath.RENATO}
                  onChange={(event) => setSelectedPath(event.target.value)}
                />
                <span>
                  <strong>מסלול רנאטו</strong>
                  <span>חקירה באמצעות ארבע כרטיסיות חשיבה חישובית</span>
                </span>
              </label>
            </fieldset>
            <div className="login-research-notice" role="note">
              <strong>מהלך המחקר</strong>
              <span>
                לפני הלמידה יופיע בוחן מקדים. שני המסלולים מוגבלים ל־
                {STUDY_DURATION_MINUTES} דקות, עם אותם כלי שרטוט ומדיניות עזרה.
              </span>
            </div>
          </>
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
