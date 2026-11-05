// ============================================================
// src/hooks/useTimer.js
// ============================================================

import { useState, useEffect, useCallback } from 'react';

export function useTimer(autoStart = false) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    if (!isRunning) return undefined;
    const id = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setSeconds(0);
    setIsRunning(false);
  }, []);

  return { seconds, isRunning, start, pause, reset };
}
