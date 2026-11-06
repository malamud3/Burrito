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
            סביבת למידה ממוקדת לחקירת פונקציות, עם שתי דרכים שונות לארגון החקירה
            וכלים שעוזרים להפוך כל שלב להבנה.
          </p>
          <div className="login-feature-grid" aria-label="מה מחכה לך במרחב">
            <div className="login-feature">
              <span>01</span>
              <strong>מקבלים מסלול</strong>
              <small>בחירה בין שני מסלולים</small>
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
            הזינו קוד ובחרו מסלול למידה. לאחר הבוחן המקדים תתחיל הפעילות במסלול שבחרתם.
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

          {mode === Mode.STUDENT && !AUTO_ASSIGN_STUDY_PATH && (
            <div className="field login-field">
              <label htmlFor="activity-path">מסלול למידה</label>
              <select
                id="activity-path"
                value={activityPath}
                onChange={(event) => setActivityPath(event.target.value)}
              >
                <option value={ActivityPath.CLASSIC}>מסלול קלאסי</option>
                <option value={ActivityPath.RENATO}>מסלול רנאטו</option>
              </select>
            </div>
          )}

          {mode === Mode.STUDENT && (
            <div className="login-research-notice" role="note">
              <strong>מהלך ההדגמה</strong>
              <span>
                תחילה יוגש בוחן מקדים. אחריו יתחיל
                טיימר למידה של {STUDY_DURATION_MINUTES} דקות.
              </span>
              <span>
                הדגמה בלבד: ההקצאה נשמרת בדפדפן הזה ואינה מתואמת בין מכשירים.
                אין להשתמש בה לאיסוף נתוני מחקר.
              </span>
            </div>
          )}

          <div className="btn-group login-actions">
            <button className="btn btn-primary" onClick={handleStart}>
              {mode === Mode.STUDENT ? 'התחל/י בוחן מקדים' : 'פתח/י לוח בקרה'}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
