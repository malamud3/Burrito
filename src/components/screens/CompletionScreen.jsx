import React, { useMemo } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useLogContext } from '../../context/LogContext';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import { useLogExport } from '../../hooks/useLogExport';
import { computeSessionSummary } from '../../services/LogAnalyticsService';
import { formatTime } from '../../core/utils/timeFormatter';
import { ActivityPath, Mode } from '../../core/types/enums';
import CompletionView from '../completion/CompletionView';

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
    ['בוחן העברה', sessionLogs.some((entry) => entry.actionType === 'transfer_submit') ? 'הוגש' : 'לא הוגש'],
    ['משך הפעילות', formatTime(summary.totalDurationSeconds)],
    ['פעולות שנרשמו', summary.totalActions],
  ];

  return (
    <CompletionView
      rows={rows}
      onDashboard={goToDashboard}
      onExport={exportJSON}
      canAccessDashboard={session.mode === Mode.RESEARCHER}
    />
  );
}
