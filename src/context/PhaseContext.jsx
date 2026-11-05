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
} from 'react';
import { Phase } from '../core/types/enums';
import { PHASE_ORDER } from '../core/constants/phases';
import { useSessionContext } from './SessionContext';

const PhaseContext = createContext(null);
const STORAGE_KEY = 'ctAdapt.phase';

const readStoredPhase = () => {
  if (typeof window === 'undefined' || !window.localStorage) return Phase.LOGIN;

  try {
    const storedPhase = window.localStorage.getItem(STORAGE_KEY);
    return Object.values(Phase).includes(storedPhase) ? storedPhase : Phase.LOGIN;
  } catch (error) {
    console.warn('Failed to restore phase from localStorage', error);
    return Phase.LOGIN;
  }
};

export function PhaseProvider({ children }) {
  const { session } = useSessionContext();
  const [currentPhase, setCurrentPhase] = useState(() =>
    session.isActive ? readStoredPhase() : Phase.LOGIN,
  );
  const [phaseHistory, setPhaseHistory] = useState([currentPhase]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;

    if (session.isActive) {
      window.localStorage.setItem(STORAGE_KEY, currentPhase);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentPhase, session.isActive]);

  const navigateTo = useCallback((phase) => {
    setCurrentPhase(phase);
    setPhaseHistory((prev) => [...prev, phase]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateNext = useCallback(() => {
    const index = PHASE_ORDER.indexOf(currentPhase);
    if (index >= 0 && index < PHASE_ORDER.length - 1) {
      navigateTo(PHASE_ORDER[index + 1]);
    }
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
