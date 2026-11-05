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
  return JSON.stringify(
    {
      exportedAt: formatTimestamp(),
      session: {
        studentId: session.studentId,
        group: session.group,
        startTime: session.startTime,
        answers: session.answers,
        effortRatings: session.effortRatings,
        detectedDifficulty: session.detectedDifficulty,
        selectedAnalogTaskId: session.selectedAnalogTask?.id || null,
        maxHintReached: session.maxHintReached,
      },
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
  const name = `ct-adapt_${session.studentId || 'session'}_${Date.now()}.json`;
  triggerDownload(logsToJSON(logs, session), name, 'application/json');
}

export function downloadCSV(logs, session) {
  const name = `ct-adapt_${session.studentId || 'session'}_${Date.now()}.csv`;
  triggerDownload(logsToCSV(logs), name, 'text/csv;charset=utf-8');
}
