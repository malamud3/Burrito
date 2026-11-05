import React, { useState } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useLogContext } from '../../context/LogContext';
import { useNotification } from '../../context/NotificationContext';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import { Group, Mode } from '../../core/types/enums';

export default function LoginScreen() {
  const [studentId, setStudentId] = useState('');
  const [group, setGroup] = useState('');
  const [mode, setMode] = useState(Mode.STUDENT);
  const { initSession } = useSessionContext();
  const { clearLogs } = useLogContext();
  const { goToProblem, goToDashboard } = usePhaseNavigation();
  const { show } = useNotification();

  const handleStart = () => {
    if (!studentId.trim()) return show('נא להזין קוד תלמיד/ה', '⚠️');
    if (!group) return show('נא לבחור קבוצת מחקר', '⚠️');

    clearLogs();
    initSession(studentId.trim(), group, mode);

    if (mode === Mode.RESEARCHER) goToDashboard();
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

        <div className="btn-group login-actions">
          <button className="btn btn-primary" onClick={handleStart}>
            התחל/י
          </button>
        </div>
      </div>
    </div>
  );
}
