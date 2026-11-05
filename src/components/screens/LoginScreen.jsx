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
  const { initSession, startLearning } = useSessionContext();
  const { addLog } = useLogContext();
  const { goToClassic, goToRenato, goToDashboard } = usePhaseNavigation();
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
    else {
      const startedAt = startLearning();
      addLog(LogActionType.LEARNING_START, {
        startedAt,
        durationLimitMinutes: STUDY_DURATION_MINUTES,
        activityPath,
      });
      if (activityPath === ActivityPath.RENATO) goToRenato();
      else goToClassic();
    }

    return show('הפגישה החלה. בהצלחה!', '🚀');
  };

  return (
    <main className="container-wide learning-screen login-screen">
      <div className="login-layout">
        <section className="login-story" aria-labelledby="login-story-title">
          <div className="login-story-brand">
            <span className="login-mark" aria-hidden="true">B</span>
            <span>Burrito</span>
          </div>
          <p className="login-story-kicker">מרחב ללמידה מתמטית</p>
          <h1 id="login-story-title">
            חוקרים פונקציות.
            <br />
            <span>מגלים את הדרך.</span>
          </h1>
          <p className="login-story-description">
            סביבת למידה ממוקדת לחקירת פונקציות, עם בחירה בין שתי דרכי חשיבה
            וכלים שעוזרים להפוך כל שלב להבנה.
          </p>
          <div className="login-feature-grid" aria-label="מה מחכה לך במרחב">
            <div className="login-feature">
              <span>01</span>
              <strong>בוחרים מסלול</strong>
              <small>קלאסי או חשיבה חישובית</small>
            </div>
            <div className="login-feature">
              <span>02</span>
              <strong>חוקרים לעומק</strong>
              <small>מתקדמים צעד אחר צעד</small>
            </div>
            <div className="login-feature">
              <span>03</span>
              <strong>מסכמים ומשרטטים</strong>
              <small>מחברים בין הרעיונות</small>
            </div>
          </div>
          <p className="login-session-note">
            <span aria-hidden="true" />
            מפגש למידה של {STUDY_DURATION_MINUTES} דקות, עם כלי שרטוט דיגיטלי
          </p>
        </section>

        <section className="card login-card" aria-labelledby="login-form-title">
          <div className="login-card-heading">
            <span className="login-form-eyebrow">הכניסה למרחב שלך</span>
            <h2 id="login-form-title">מתחילים כאן</h2>
          </div>
          <p className="login-subtitle">
            הזינו קוד ובחרו איך תרצו לחקור היום.
          </p>

          <div className="field login-field">
            <label htmlFor="student-id">קוד תלמיד/ה</label>
            <input
              id="student-id"
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
                <strong>מהלך המפגש</strong>
                <span>
                  הלמידה מתחילה מיד לאחר הכניסה. שני המסלולים מוגבלים ל־
                  {STUDY_DURATION_MINUTES} דקות, עם אותם כלי שרטוט ומדיניות עזרה.
                </span>
              </div>
            </>
          )}

          <div className="btn-group login-actions">
            <button className="btn btn-primary" onClick={handleStart}>
              התחל/י למידה
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
