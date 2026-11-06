// ============================================================
// src/hooks/useLogExport.js
// ============================================================

import { useCallback } from 'react';
import { useLogContext } from '../context/LogContext';
import { useSessionContext } from '../context/SessionContext';
import {
  downloadAssessmentScoresCSV,
  downloadCSV,
  downloadJSON,
} from '../services/ExportService';

export function useLogExport() {
  const { getLogs } = useLogContext();
  const { session } = useSessionContext();

  const exportJSON = useCallback(
    () => downloadJSON(getLogs(), session),
    [getLogs, session],
  );
  const exportCSV = useCallback(
    () => downloadCSV(getLogs(), session),
    [getLogs, session],
  );
  const exportAssessmentScoresCSV = useCallback(
    () => downloadAssessmentScoresCSV(getLogs()),
    [getLogs],
  );

  return { exportJSON, exportCSV, exportAssessmentScoresCSV };
}
