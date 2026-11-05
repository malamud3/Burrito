import React, { useMemo } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useLogContext } from '../../context/LogContext';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import { useLogExport } from '../../hooks/useLogExport';
import { computeSessionSummary } from '../../services/LogAnalyticsService';
import { formatTime } from '../../core/utils/timeFormatter';
import { ActivityPath } from '../../core/types/enums';
import ProgressBar from '../layout/ProgressBar';

export default function CompletionScreen() {
  const { session } = useSessionContext();
  const { logs } = useLogContext();
  const { goToDashboard } = usePhaseNavigation();
  const { exportJSON } = useLogExport();

  const sessionLogs = useMemo(
    () => logs.filter((entry) => entry.data?.sessionId === session.sessionId),
    [logs, session.sessionId],
  );
  const summary = useMemo(() => computeSessionSummary(sessionLogs), [sessionLogs]);

  const rows = [
    ['קוד תלמיד/ה', session.studentId],
    ['מסלול', session.activityPath === ActivityPath.RENATO ? 'רנאטו סאיג — חשיבה חישובית' : 'קלאסי'],
    ['בוחן מקדים', session.preAssessmentSubmittedAt ? 'הוגש' : 'לא הוגש'],
    ['בוחן העברה', sessionLogs.some((entry) => entry.actionType === 'transfer_submit') ? 'הוגש' : 'לא הוגש'],
    ['משך הפעילות', formatTime(summary.totalDurationSeconds)],
    ['פעולות שנרשמו', summary.totalActions],
  ];

  return (
    <div className="container learning-screen completion-screen">
      <ProgressBar />
      <div
        className="card"
        style={{ maxWidth: 600, margin: '6vh auto 0', textAlign: 'center', padding: 48 }}
      >
        <div className="completion-icon">🎉</div>
        <h2>סיימת! תודה רבה!</h2>
        <p style={{ margin: '16px 0', color: 'var(--text2)' }}>
          כל הנתונים נשמרו בהצלחה.
          <br />
          הפעילות הושלמה.
        </p>

        <ul className="summary-list" style={{ textAlign: 'right', marginTop: 24 }}>
          {rows.map(([label, value]) => (
            <li key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </li>
          ))}
        </ul>

        <div className="btn-group" style={{ justifyContent: 'center', marginTop: 24 }}>
          <button className="btn btn-outline" onClick={goToDashboard}>
            📊 צפייה בנתונים (חוקר/ת)
          </button>
          <button className="btn btn-outline" onClick={exportJSON}>
            ⬇️ הורדת לוגים
          </button>
        </div>
      </div>
    </div>
  );
}
