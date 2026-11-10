// ============================================================
// src/context/LogContext.jsx
// Single Responsibility: collect the learning-trace logs.
// A ref mirrors state so services can read the latest logs synchronously.
// ============================================================

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';
import { generateLogId } from '../core/utils/idGenerator';
import { formatTimestamp } from '../core/utils/timeFormatter';
import {
  CT_DATA_VERSION,
  CT_DATA_VERSION_KEY,
  CT_LOG_SCHEMA_VERSION,
  inferCognitiveTags,
} from '../core/constants/ctLogging';

const LogContext = createContext(null);
const STORAGE_KEY = 'ctAdapt.logs';

function resetLegacyDemoData() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  if (window.localStorage.getItem(CT_DATA_VERSION_KEY) === CT_DATA_VERSION) return;

  window.localStorage.removeItem('ctAdapt.logs');
  window.localStorage.removeItem('ctAdapt.session');
  window.localStorage.removeItem('ctAdapt.phase');
  window.localStorage.removeItem('ctAdapt.allocation');
  window.localStorage.setItem(CT_DATA_VERSION_KEY, CT_DATA_VERSION);
}

const readStoredLogs = () => {
  if (typeof window === 'undefined' || !window.localStorage) return [];

  try {
    resetLegacyDemoData();
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to restore logs from localStorage', error);
    return [];
  }
};

export function LogProvider({ children }) {
  const [logs, setLogs] = useState(() => readStoredLogs());
  const logsRef = useRef(logs);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      if (logs.length > 0) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      // Storage can be unavailable or full (for example in private browsing).
      // Logging must never take down the learning flow in that case.
      console.warn('Failed to persist logs to localStorage', error);
    }
  }, [logs]);

  const addLog = useCallback((actionType, data = {}, skill = null) => {
    const phase = data.phase || null;
    const entry = {
      id: generateLogId(),
      timestamp: Date.now(),
      isoTime: formatTimestamp(),
      actionType,
      skill,
      schemaVersion: CT_LOG_SCHEMA_VERSION,
      ctTags: data.ctTags || inferCognitiveTags(actionType, data, skill),
      data: { ...data, phase },
    };
    logsRef.current = [...logsRef.current, entry];
    setLogs(logsRef.current);
    return entry;
  }, []);

  const getLogs = useCallback(() => logsRef.current, []);

  const clearLogs = useCallback(() => {
    logsRef.current = [];
    setLogs([]);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.warn('Failed to clear logs from localStorage', error);
      }
    }
  }, []);

  const value = useMemo(
    () => ({ logs, addLog, getLogs, clearLogs }),
    [logs, addLog, getLogs, clearLogs],
  );

  return <LogContext.Provider value={value}>{children}</LogContext.Provider>;
}

export function useLogContext() {
  const ctx = useContext(LogContext);
  if (!ctx) throw new Error('useLogContext must be used within LogProvider');
  return ctx;
}
