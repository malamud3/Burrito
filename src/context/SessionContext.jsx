// ============================================================
// src/context/SessionContext.jsx
// React adapter for session state and intent-revealing actions.
// ============================================================

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import { generateId } from '../core/utils/idGenerator';
import { createSessionStorageInitializer, saveSession } from '../services/SessionStorage';
import { sessionReducer } from '../core/session/sessionState';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [state, dispatch] = useReducer(
    sessionReducer,
    undefined,
    createSessionStorageInitializer,
  );

  useEffect(() => {
    saveSession(state);
  }, [state]);

  const actions = useMemo(
    () => ({
      initSession: (studentId, activityPath, mode, allocation = null) => {
        const sessionId = generateId('session');
        dispatch({
          type: 'INIT_SESSION',
          payload: { studentId, sessionId, activityPath, mode, allocation },
        });
        return sessionId;
      },
      setAnswer: (key, value) =>
        dispatch({ type: 'SET_ANSWER', payload: { key, value } }),
      setDetectedDifficulty: (difficulty) =>
        dispatch({ type: 'SET_DETECTED_DIFFICULTY', payload: difficulty }),
      setAnalogTask: (task) => dispatch({ type: 'SET_ANALOG_TASK', payload: task }),
      setHintLevel: (level) => dispatch({ type: 'SET_HINT_LEVEL', payload: level }),
      setEffortRating: (key, value) =>
        dispatch({ type: 'SET_EFFORT_RATING', payload: { key, value } }),
      updateDecompSteps: (steps) =>
        dispatch({ type: 'UPDATE_DECOMP_STEPS', payload: steps }),
      updateAbstractionRows: (rows) =>
        dispatch({ type: 'UPDATE_ABSTRACTION_ROWS', payload: rows }),
      updateAlgoNodes: (nodes) =>
        dispatch({ type: 'UPDATE_ALGO_NODES', payload: nodes }),
      updateRenatoWork: (patch) =>
        dispatch({ type: 'UPDATE_RENATO_WORK', payload: patch }),
      updateClassicWork: (patch) =>
        dispatch({ type: 'UPDATE_CLASSIC_WORK', payload: patch }),
      updateTransferAssessment: (patch) =>
        dispatch({ type: 'UPDATE_TRANSFER_ASSESSMENT', payload: patch }),
      updateGraphWork: (patch) =>
        dispatch({ type: 'UPDATE_GRAPH_WORK', payload: patch }),
      endLearning: (endedAt = Date.now()) => {
        dispatch({ type: 'END_LEARNING', payload: endedAt });
        return endedAt;
      },
      startLearning: (startedAt = Date.now()) => {
        dispatch({ type: 'START_LEARNING', payload: startedAt });
        return startedAt;
      },
      updatePreAssessment: (patch) =>
        dispatch({ type: 'UPDATE_PRE_ASSESSMENT', payload: patch }),
      resetSession: () => dispatch({ type: 'RESET_SESSION' }),
    }),
    [],
  );

  const value = useMemo(() => ({ session: state, ...actions }), [state, actions]);

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionContext must be used within SessionProvider');
  }
  return context;
}
