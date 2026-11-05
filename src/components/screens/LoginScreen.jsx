import React, { useState } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useLogContext } from '../../context/LogContext';
import { useNotification } from '../../context/NotificationContext';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import { ActivityPath, Group, Mode } from '../../core/types/enums';

export default function LoginScreen() {
  const [studentId, setStudentId] = useState('');
  const [group, setGroup] = useState('');
  const [mode, setMode] = useState(Mode.STUDENT);
  const [activityPath, setActivityPath] = useState(ActivityPath.CT_ADAPT);
  const { initSession } = useSessionContext();
  const { clearLogs } = useLogContext();
  const { goToProblem, goToDashboard, goToRenato } = usePhaseNavigation();
  const { show } = useNotification();

  const handleStart = () => {
    if (!studentId.trim()) return show('נא להזין קוד תלמיד/ה', '⚠️');
    if (!group) return show('נא לבחור קבוצת מחקר', '⚠️');

    clearLogs();
    initSession(studentId.trim(), group, mode, activityPath);

    if (mode === Mode.RESEARCHER) goToDashboard();
    else if (activityPath === ActivityPath.RENATO) goToRenato();
    else goToProblem();

    return show('הפגישה החלה. בהצלחה!', '🚀');
  };

  return (
    <div className="container">
      <div className="card login-card">
        <div className="login-brand">
          <span className="login-mark" aria-hidden="true">CT</span>
          <h1>CT-Adapt</h1>
        </div>
        <p className="login-subtitle">
          סביבת למידה אדפטיבית לחשיבה חישובית במתמטיקה
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
          <label>קבוצת מחקר</label>
          <select value={group} onChange={(e) => setGroup(e.target.value)}>
            <option value="">— בחר/י —</option>
            <option value={Group.ADAPTIVE}>קבוצה A — תמיכה אדפטיבית</option>
            <option value={Group.FIXED}>קבוצה B — תמיכה קבועה</option>
          </select>
        </div>

        <div className="field login-field">
          <label>מצב</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value={Mode.STUDENT}>תלמיד/ה</option>
            <option value={Mode.RESEARCHER}>חוקר/ת — לוח בקרה</option>
          </select>
        </div>

        <div className="field login-field">
          <label htmlFor="activity-path">מסלול פעילות</label>
          <select
            id="activity-path"
            value={activityPath}
            onChange={(e) => setActivityPath(e.target.value)}
          >
            <option value={ActivityPath.CT_ADAPT}>מסלול CT-Adapt</option>
            <option value={ActivityPath.RENATO}>מסלול רנאטו סאיג — חקירת פונקציות</option>
          </select>
        </div>

        <div className="btn-group login-actions">
          <button className="btn btn-primary" onClick={handleStart}>
            התחל/י
          </button>
        </div>
      </div>
    </div>
  );
}
