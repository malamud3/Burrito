// ============================================================
// src/hooks/useLogExport.js
// ============================================================

import { useCallback } from 'react';
import { useLogContext } from '../context/LogContext';
import { useSessionContext } from '../context/SessionContext';
import { downloadJSON, downloadCSV } from '../services/ExportService';

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

  return { exportJSON, exportCSV };
}
