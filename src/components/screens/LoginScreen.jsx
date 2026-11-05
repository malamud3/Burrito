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
      <div className="card" style={{ maxWidth: 450, margin: '10vh auto 0' }}>
        <h1
          style={{
            fontSize: '2rem',
            textAlign: 'center',
            marginBottom: 8,
            color: 'var(--primary)',
          }}
        >
          🧠 CT-Adapt
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text2)', marginBottom: 32 }}>
          סביבת למידה אדפטיבית לחשיבה חישובית במתמטיקה
        </p>

        <div className="field">
          <label>קוד תלמיד/ה</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            placeholder="הכנס קוד משתתף/ת"
          />
        </div>

        <div className="field">
          <label>קבוצת מחקר</label>
          <select value={group} onChange={(e) => setGroup(e.target.value)}>
            <option value="">— בחר/י —</option>
            <option value={Group.ADAPTIVE}>קבוצה A — תמיכה אדפטיבית</option>
            <option value={Group.FIXED}>קבוצה B — תמיכה קבועה</option>
          </select>
        </div>

        <div className="field">
          <label>מצב</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value={Mode.STUDENT}>תלמיד/ה</option>
            <option value={Mode.RESEARCHER}>חוקר/ת — לוח בקרה</option>
          </select>
        </div>

        <div className="btn-group" style={{ justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={handleStart}>
            התחל/י
          </button>
        </div>
      </div>
    </div>
  );
}
