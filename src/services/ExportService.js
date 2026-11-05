// ============================================================
// src/services/ExportService.js
// Single Responsibility: turning session data into downloadable files.
// ============================================================

import { formatTimestamp } from '../core/utils/timeFormatter';

function triggerDownload(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function logsToJSON(logs, session) {
  const sessions = new Map();
  logs.forEach((entry) => {
    const sessionId = entry.data?.sessionId;
    if (!sessionId) return;
    const metadata = sessions.get(sessionId) || {
      studentId: entry.data?.studentId || '',
      sessionId,
      activityPath: entry.data?.activityPath || '',
      mode: entry.data?.mode || '',
    };
    if (entry.actionType === 'activity_start') {
      Object.assign(metadata, {
        studentId: entry.data.studentId,
        activityPath: entry.data.activityPath,
        mode: entry.data.mode,
        allocation: entry.data.method
          ? {
            method: entry.data.method,
            allocationIndex: entry.data.allocationIndex,
            blockNumber: entry.data.blockNumber,
            positionInBlock: entry.data.positionInBlock,
          }
          : null,
        startTime: entry.timestamp,
      });
    }
    sessions.set(sessionId, metadata);
  });

  return JSON.stringify(
    {
      schemaVersion: 2,
      exportedAt: formatTimestamp(),
      session: {
        studentId: session.studentId,
        sessionId: session.sessionId,
        activityPath: session.activityPath,
        mode: session.mode,
        startTime: session.startTime,
        learningStartedAt: session.learningStartedAt,
        preAssessmentSubmittedAt: session.preAssessmentSubmittedAt,
        learningEndedAt: session.learningEndedAt,
        allocation: session.allocation,
        preAssessment: session.preAssessment,
        classicWork: session.classicWork,
        renatoWork: session.renatoWork,
        graphWork: session.graphWork,
        transferAssessment: session.transferAssessment,
      },
      sessions: Array.from(sessions.values()),
      logs,
    },
    null,
    2,
  );
}

const csvEscape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

export function logsToCSV(logs) {
  const header = ['id', 'isoTime', 'timestamp', 'actionType', 'skill', 'data'];
  const rows = logs.map((l) =>
    [l.id, l.isoTime, l.timestamp, l.actionType, l.skill || '', JSON.stringify(l.data)]
      .map(csvEscape)
      .join(','),
  );
  // BOM so Excel opens Hebrew correctly
  return '\uFEFF' + [header.join(','), ...rows].join('\n');
}

export function downloadJSON(logs, session) {
  const name = `burrito_${session.studentId || 'session'}_${Date.now()}.json`;
  triggerDownload(logsToJSON(logs, session), name, 'application/json');
}

export function downloadCSV(logs, session) {
  const name = `burrito_${session.studentId || 'session'}_${Date.now()}.csv`;
  triggerDownload(logsToCSV(logs), name, 'text/csv;charset=utf-8');
}
