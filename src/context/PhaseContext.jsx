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
} from 'react';
import { Phase } from '../core/types/enums';
import { PHASE_ORDER } from '../core/constants/phases';

const PhaseContext = createContext(null);

export function PhaseProvider({ children }) {
  const [currentPhase, setCurrentPhase] = useState(Phase.LOGIN);
  const [phaseHistory, setPhaseHistory] = useState([Phase.LOGIN]);

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
