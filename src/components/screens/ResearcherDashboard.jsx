import React, { useMemo, useState } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useLogContext } from '../../context/LogContext';
import { useLogExport } from '../../hooks/useLogExport';
import { computeLearningDurations, computeSessionSummary } from '../../services/LogAnalyticsService';
import { LogActionType } from '../../core/types/enums';
import { PHASE_STORAGE_KEY } from '../../context/PhaseContext';
import { SESSION_STORAGE_KEY } from '../../services/SessionStorage';
import { formatTime } from '../../core/utils/timeFormatter';
import ResearcherDashboardView from '../researcher/ResearcherDashboardView';

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
    <ResearcherDashboardView
      studentId={session.studentId}
      stats={stats}
      logs={logs}
      activeTab={activeTab}
      tabs={TABS}
      onTabChange={setActiveTab}
      onExportJSON={exportJSON}
      onExportCSV={exportCSV}
      onExportAssessmentScores={exportAssessmentScoresCSV}
      onReload={handleReload}
    />
  );
}
