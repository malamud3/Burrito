import React, { useMemo, useState } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useLogContext } from '../../context/LogContext';
import { useLogExport } from '../../hooks/useLogExport';
import { computeLearningDurations, computeSessionSummary } from '../../services/LogAnalyticsService';
import { LogActionType } from '../../core/types/enums';
import { PHASE_STORAGE_KEY } from '../../context/PhaseContext';
import { SESSION_STORAGE_KEY } from '../../services/SessionStorage';
import { formatTime } from '../../core/utils/timeFormatter';
import StatCard from '../researcher/StatCard';
import LogPanel from '../researcher/LogPanel';
import StudentTimeline from '../researcher/StudentTimeline';
import AssessmentScoringPanel from '../researcher/AssessmentScoringPanel';
import ActionButton from '../ui/ActionButton';
import AppBadge from '../ui/AppBadge';
import SegmentedTabs from '../ui/SegmentedTabs';

const TABS = [
  { id: 'log', label: 'לוג מלא' },
  { id: 'timeline', label: 'ציר זמן' },
  { id: 'scoring', label: 'ניקוד בוחנים' },
];

export default function ResearcherDashboard() {
  const { session, resetSession } = useSessionContext();
  const { logs } = useLogContext();
  const { exportJSON, exportCSV, exportAssessmentScoresCSV } = useLogExport();
  const [activeTab, setActiveTab] = useState('log');

  const summary = useMemo(() => computeSessionSummary(logs), [logs]);

  const handleReload = () => {
    resetSession();
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    window.localStorage.removeItem(PHASE_STORAGE_KEY);
    window.location.reload();
  };

  const participantCount = new Set(
    logs
      .filter((entry) => entry.actionType === LogActionType.ACTIVITY_START && entry.data?.mode === 'student')
      .map((entry) => entry.data.sessionId)
      .filter(Boolean),
  ).size;
  const learningSeconds = computeLearningDurations(logs).reduce(
    (total, duration) => total + duration.seconds,
    0,
  );
  const stats = [
    { label: 'משתתפים', value: participantCount },
    { label: 'זמן למידה מצטבר', value: formatTime(learningSeconds) },
    { label: 'סה"כ פעולות', value: summary.totalActions },
    { label: 'משך כולל', value: formatTime(summary.totalDurationSeconds) },
  ];

  return (
    <div className="container-wide learning-screen dashboard-screen">
      <div className="app-header">
        <h1>📊 לוח בקרה — חוקר/ת</h1>
        <div className="header-info">
          <AppBadge>{session.studentId}</AppBadge>
          <ActionButton tone="outline" size="small" onClick={exportJSON}>
            ⬇️ הורד לוגים
          </ActionButton>
          <ActionButton tone="outline" size="small" onClick={exportCSV}>
            ⬇️ הורד CSV
          </ActionButton>
          <ActionButton tone="outline" size="small" onClick={exportAssessmentScoresCSV}>
            ⬇️ הורד ציוני בוחנים
          </ActionButton>
          <ActionButton tone="outline" size="small" onClick={handleReload}>
            ↺ משתתף/ת חדש/ה
          </ActionButton>
        </div>
      </div>

      <div className="dashboard-grid">
        {stats.map((s) => (
          <StatCard key={s.label} value={s.value} label={s.label} />
        ))}
      </div>
      <p className="study-protocol-note">
        הנתונים וההקצאות נשמרים בדפדפן זה. ייצאו גיבוי לפני ניקוי נתוני הדפדפן;
        כל סשני המשתתפים נשמרים יחד בלוגים.
      </p>

      <SegmentedTabs
        tabs={TABS}
        value={activeTab}
        onChange={setActiveTab}
        aria-label="לשוניות לוח הבקרה"
      />

      <div className="card">
        {activeTab === 'log' && <LogPanel logs={logs} />}
        {activeTab === 'timeline' && (
          <>
            <h3 style={{ marginBottom: 12 }}>ציר זמן — משך זמן בכל שלב</h3>
            <StudentTimeline logs={logs} />
          </>
        )}
        {activeTab === 'scoring' && <AssessmentScoringPanel logs={logs} />}
      </div>
    </div>
  );
}
