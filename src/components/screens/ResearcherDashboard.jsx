import React, { useMemo, useState } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useLogContext } from '../../context/LogContext';
import { useLogExport } from '../../hooks/useLogExport';
import { computeSessionSummary } from '../../services/LogAnalyticsService';
import { CTSkill, Group } from '../../core/types/enums';
import { CT_SKILL_CONFIG } from '../../core/constants/ctSkills';
import { formatTime } from '../../core/utils/timeFormatter';
import StatCard from '../researcher/StatCard';
import LogPanel from '../researcher/LogPanel';
import StudentTimeline from '../researcher/StudentTimeline';
import DetectionReport from '../researcher/DetectionReport';

const TABS = [
  { id: 'log', label: 'לוג מלא' },
  { id: 'timeline', label: 'ציר זמן' },
  { id: 'detection', label: 'זיהוי קשיים' },
];

export default function ResearcherDashboard() {
  const { session, resetSession } = useSessionContext();
  const { logs, clearLogs } = useLogContext();
  const { exportJSON, exportCSV } = useLogExport();
  const [activeTab, setActiveTab] = useState('log');

  const summary = useMemo(() => computeSessionSummary(logs), [logs]);

  const handleReload = () => {
    // Full restart of the app state
    clearLogs();
    resetSession();
    window.location.reload();
  };

  const stats = [
    { label: 'סה"כ פעולות', value: summary.totalActions },
    { label: 'משך הפגישה', value: formatTime(summary.totalDurationSeconds) },
    { label: 'בקשות עזרה', value: summary.hintRequests },
    { label: 'הסלמות רמז', value: summary.hintEscalations },
    ...Object.values(CTSkill).map((skill) => ({
      label: `עריכות — ${CT_SKILL_CONFIG[skill].label}`,
      value: summary.editsPerSkill[skill] ?? 0,
    })),
    {
      label: 'קבוצה',
      value: session.group === Group.ADAPTIVE ? 'אדפטיבית' : 'קבועה',
    },
  ];

  return (
    <div className="container-wide">
      <div className="app-header">
        <h1>📊 לוח בקרה — חוקר/ת</h1>
        <div className="header-info">
          <span className="badge badge-phase">{session.studentId}</span>
          <button className="btn btn-outline btn-sm" onClick={exportJSON}>
            ⬇️ הורד לוגים
          </button>
          <button className="btn btn-outline btn-sm" onClick={exportCSV}>
            ⬇️ הורד CSV
          </button>
          <button className="btn btn-outline btn-sm" onClick={handleReload}>
            ↺ התחלה מחדש
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        {stats.map((s) => (
          <StatCard key={s.label} value={s.value} label={s.label} />
        ))}
      </div>

      <div className="tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card">
        {activeTab === 'log' && <LogPanel logs={logs} />}
        {activeTab === 'timeline' && (
          <>
            <h3 style={{ marginBottom: 12 }}>ציר זמן — משך זמן בכל שלב</h3>
            <StudentTimeline logs={logs} />
          </>
        )}
        {activeTab === 'detection' && (
          <>
            <h3 style={{ marginBottom: 12 }}>דוח זיהוי קשיים</h3>
            <DetectionReport logs={logs} />
          </>
        )}
      </div>
    </div>
  );
}
