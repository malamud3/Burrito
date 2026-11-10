// ============================================================
// src/context/PhaseContext.jsx
// Single Responsibility: which phase (screen) is active.
// ============================================================

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import { LogActionType, Phase } from '../core/types/enums';
import { getPhaseFromPath } from '../core/constants/routes';
import {
  getNextPhase,
  getPathForPhase,
} from '../coordinator/phaseCoordinator';
import { useSessionContext } from './SessionContext';
import { useLogContext } from './LogContext';
import { useLocation, useNavigate } from 'react-router-dom';

const PhaseContext = createContext(null);
export const PHASE_STORAGE_KEY = 'ctAdapt.phase';

const readStoredPhase = () => {
  if (typeof window === 'undefined' || !window.localStorage) return Phase.LOGIN;

  try {
    const storedPhase = window.localStorage.getItem(PHASE_STORAGE_KEY);
    if ([Phase.LOGIN, Phase.PRE_ASSESSMENT, Phase.DASHBOARD, Phase.COMPLETION].includes(storedPhase)) {
      return storedPhase;
    }
    if (storedPhase === Phase.TRANSFER_EXAM) return storedPhase;
    return [
      Phase.RENATO,
      Phase.RENATO_ASYMPTOTES,
      Phase.RENATO_INTERCEPTS,
      Phase.RENATO_EXTREMA,
      Phase.RENATO_GRAPH,
    ].includes(storedPhase) ? storedPhase : Phase.RENATO;
  } catch (error) {
    console.warn('Failed to restore phase from localStorage', error);
    return Phase.LOGIN;
  }
};

export function PhaseProvider({ children }) {
  const { session } = useSessionContext();
  const { addLog } = useLogContext();
  const location = useLocation();
  const navigate = useNavigate();
  const lastObservedPath = useRef(location.pathname);
  const [currentPhase, setCurrentPhase] = useState(() =>
    session.isActive
      ? getPhaseFromPath(location.pathname) || readStoredPhase()
      : Phase.LOGIN,
  );
  const [phaseHistory, setPhaseHistory] = useState([currentPhase]);

  useEffect(() => {
    if (location.pathname === lastObservedPath.current) return;
    lastObservedPath.current = location.pathname;

    const routePhase = getPhaseFromPath(location.pathname);
    if (routePhase && routePhase !== currentPhase) {
      addLog(LogActionType.PHASE_CHANGE, {
        from: currentPhase,
        to: routePhase,
        studentId: session.studentId,
        sessionId: session.sessionId,
        activityPath: session.activityPath,
      });
      setCurrentPhase(routePhase);
      setPhaseHistory((previous) => [...previous, routePhase]);
    }
  }, [
    location.pathname,
    currentPhase,
    addLog,
    session.studentId,
    session.sessionId,
    session.activityPath,
  ]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      if (session.isActive) {
        window.localStorage.setItem(PHASE_STORAGE_KEY, currentPhase);
      } else {
        window.localStorage.removeItem(PHASE_STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Failed to persist phase to localStorage', error);
    }
  }, [currentPhase, session.isActive]);

  const navigateTo = useCallback((phase) => {
    const path = getPathForPhase(phase);
    navigate(
      path,
      phase === Phase.TRANSFER_EXAM
        ? { state: { fromLearningFlow: true } }
        : undefined,
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const navigateNext = useCallback(() => {
    const nextPhase = getNextPhase(currentPhase);
    if (nextPhase) navigateTo(nextPhase);
  }, [currentPhase, navigateTo]);

  const resetPhase = useCallback(() => {
    setCurrentPhase(Phase.LOGIN);
    setPhaseHistory([Phase.LOGIN]);
  }, []);

  const value = useMemo(
    () => ({ currentPhase, phaseHistory, navigateTo, navigateNext, resetPhase }),
    [currentPhase, phaseHistory, navigateTo, navigateNext, resetPhase],
  );

  return <PhaseContext.Provider value={value}>{children}</PhaseContext.Provider>;
}

export function usePhaseContext() {
  const ctx = useContext(PhaseContext);
  if (!ctx) throw new Error('usePhaseContext must be used within PhaseProvider');
  return ctx;
}
