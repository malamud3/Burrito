// ============================================================
// src/context/SessionContext.jsx
// Session state (student, answers, tool state, hints, effort).
// Exposes intent-revealing actions instead of raw dispatch.
// ============================================================

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import { ActivityPath, Mode } from '../core/types/enums';
import { RENATO_FUNCTION, RENATO_TABLE_COLUMNS } from '../core/constants/renato';
import { createEmptyFunctionAssessment } from '../core/constants/functionAssessments';
import { generateId } from '../core/utils/idGenerator';

const SessionContext = createContext(null);
const STORAGE_KEY = 'ctAdapt.session';

const createInitialState = () => ({
  studentId: '',
  sessionId: null,
  group: null,
  mode: Mode.STUDENT,
  activityPath: ActivityPath.CLASSIC,
  allocation: null,
  isActive: false,
  startTime: null,
  learningStartedAt: null,
  preAssessmentSubmittedAt: null,
  learningEndedAt: null,
  graphWork: {
    grid: true,
    graphStrokes: [],
    drawMode: false,
    graphMarkers: false,
    graphAsymptoteStyle: 'dashed',
  },
  answers: {
    main: '',
    corrected: '',
    correctionExplanation: '',
    transfer: '',
    transferDecomp: '',
    transferAbstract: '',
    transferAlgo: '',
    analogDecomp: '',
    analogAbstract: '',
    analogAnswer: '',
  },
  classicWork: {
    domain: '',
    derivative: '',
    criticalPoints: '',
    extremaPoints: '',
    verticalAsymptotes: '',
    horizontalAsymptote: '',
    yAxisIntercept: '',
    xAxisIntercept: '',
    signBehavior: '',
    graph: '',
  },
  transferAssessment: {
    domain: '',
    derivative: '',
    criticalPoints: '',
    extremaPoints: '',
    verticalAsymptotes: '',
    horizontalAsymptote: '',
    yAxisIntercept: '',
    xAxisIntercept: '',
    signBehavior: '',
    graph: '',
  },
  preAssessment: createEmptyFunctionAssessment(),
  detectedDifficulty: null,
  selectedAnalogTask: null,
  hintLevel: 0,
  maxHintReached: 0,
  effortRatings: { main: null, analog: null, transfer: null },
  toolState: {
    decomposition: { steps: [{ id: 'step_init_1', value: '' }] },
    abstraction: { rows: [] },
    algorithmic: {
      nodes: [
        { id: 'node_0', value: '', placeholder: 'התחלה: מה הנתון?' },
        { id: 'node_1', value: '', placeholder: 'פעולה ראשונה...' },
        { id: 'node_2', value: '', placeholder: 'פעולה שנייה...' },
        { id: 'node_3', value: '', placeholder: 'תוצאה / תשובה' },
      ],
    },
  },
  renatoWork: {
    functionExpression: RENATO_FUNCTION,
    cards: {
      domain: { order: 1, answer: '' },
      extrema: { order: 4, suspectedX: '', points: '', derivative: '', checked: false },
      asymptotes: { order: 2, vertical: '', horizontal: '', checked: false },
      intercepts: { order: 3, yAxis: '', xAxis: '', checked: false },
    },
    table: {
      columns: RENATO_TABLE_COLUMNS.map(({ id }) => ({
        id,
        derivative: '',
        behavior: '',
      })),
    },
    valueCache: {},
    cacheNotification: null,
    grid: true,
    graphStrokes: [],
    drawMode: false,
    graphMarkers: false,
    graphAsymptoteStyle: 'dashed',
    drawnDomains: { 1: false, 2: false, 3: false, 4: false },
  },
});

const readStoredSession = () => {
  if (typeof window === 'undefined' || !window.localStorage) return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;

    const initial = createInitialState();
    return {
      ...initial,
      ...parsed,
      sessionId: parsed.sessionId || `session_${parsed.startTime || Date.now()}`,
      activityPath: parsed.activityPath === ActivityPath.RENATO
        ? ActivityPath.RENATO
        : ActivityPath.CLASSIC,
      allocation: parsed.allocation || null,
      graphWork: {
        ...initial.graphWork,
        ...(parsed.graphWork || {}),
        graphStrokes: Array.isArray(parsed.graphWork?.graphStrokes)
          ? parsed.graphWork.graphStrokes
          : (Array.isArray(parsed.renatoWork?.graphStrokes)
            ? parsed.renatoWork.graphStrokes
            : initial.graphWork.graphStrokes),
      },
      answers: {
        ...initial.answers,
        ...(parsed.answers || {}),
      },
      classicWork: {
        ...initial.classicWork,
        ...(parsed.classicWork || {}),
      },
      transferAssessment: {
        ...initial.transferAssessment,
        ...(parsed.transferAssessment || {}),
      },
      preAssessment: {
        ...initial.preAssessment,
        ...(parsed.preAssessment || {}),
      },
      effortRatings: {
        ...initial.effortRatings,
        ...(parsed.effortRatings || {}),
      },
      toolState: {
        ...initial.toolState,
        ...(parsed.toolState || {}),
        decomposition: {
          ...initial.toolState.decomposition,
          ...(parsed.toolState?.decomposition || {}),
        },
        abstraction: {
          ...initial.toolState.abstraction,
          ...(parsed.toolState?.abstraction || {}),
        },
        algorithmic: {
          ...initial.toolState.algorithmic,
          ...(parsed.toolState?.algorithmic || {}),
        },
      },
      renatoWork: {
        ...initial.renatoWork,
        ...(parsed.renatoWork || {}),
        cards: {
          ...initial.renatoWork.cards,
          ...(parsed.renatoWork?.cards || {}),
          domain: {
            ...initial.renatoWork.cards.domain,
            ...(parsed.renatoWork?.cards?.domain || {}),
          },
          extrema: {
            ...initial.renatoWork.cards.extrema,
            ...(parsed.renatoWork?.cards?.extrema || {}),
          },
          asymptotes: {
            ...initial.renatoWork.cards.asymptotes,
            ...(parsed.renatoWork?.cards?.asymptotes || {}),
          },
          intercepts: {
            ...initial.renatoWork.cards.intercepts,
            ...(parsed.renatoWork?.cards?.intercepts || {}),
          },
        },
        table: {
          ...initial.renatoWork.table,
          ...(parsed.renatoWork?.table || {}),
          columns: Array.isArray(parsed.renatoWork?.table?.columns)
            ? parsed.renatoWork.table.columns
            : initial.renatoWork.table.columns,
        },
        drawnDomains: {
          ...initial.renatoWork.drawnDomains,
          ...(parsed.renatoWork?.drawnDomains || {}),
        },
        graphStrokes: Array.isArray(parsed.renatoWork?.graphStrokes)
          ? parsed.renatoWork.graphStrokes
          : initial.renatoWork.graphStrokes,
      },
    };
  } catch (error) {
    console.warn('Failed to restore session from localStorage', error);
    return null;
  }
};

const updateTool = (state, tool, patch) => ({
  ...state,
  toolState: {
    ...state.toolState,
    [tool]: { ...state.toolState[tool], ...patch },
  },
});

function sessionReducer(state, action) {
  switch (action.type) {
    case 'INIT_SESSION':
      return {
        ...createInitialState(),
        ...action.payload,
        isActive: true,
        startTime: Date.now(),
      };
    case 'SET_ANSWER':
      return {
        ...state,
        answers: { ...state.answers, [action.payload.key]: action.payload.value },
      };
    case 'SET_DETECTED_DIFFICULTY':
      return { ...state, detectedDifficulty: action.payload };
    case 'SET_ANALOG_TASK':
      return { ...state, selectedAnalogTask: action.payload };
    case 'SET_HINT_LEVEL':
      return {
        ...state,
        hintLevel: action.payload,
        maxHintReached: Math.max(state.maxHintReached, action.payload),
      };
    case 'SET_EFFORT_RATING':
      return {
        ...state,
        effortRatings: {
          ...state.effortRatings,
          [action.payload.key]: action.payload.value,
        },
      };
    case 'UPDATE_DECOMP_STEPS':
      return updateTool(state, 'decomposition', { steps: action.payload });
    case 'UPDATE_ABSTRACTION_ROWS':
      return updateTool(state, 'abstraction', { rows: action.payload });
    case 'UPDATE_ALGO_NODES':
      return updateTool(state, 'algorithmic', { nodes: action.payload });
    case 'UPDATE_RENATO_WORK':
      return {
        ...state,
        renatoWork: { ...state.renatoWork, ...action.payload },
      };
    case 'UPDATE_CLASSIC_WORK':
      return {
        ...state,
        classicWork: { ...state.classicWork, ...action.payload },
      };
    case 'UPDATE_TRANSFER_ASSESSMENT':
      return {
        ...state,
        transferAssessment: { ...state.transferAssessment, ...action.payload },
      };
    case 'UPDATE_GRAPH_WORK':
      return {
        ...state,
        graphWork: { ...state.graphWork, ...action.payload },
      };
    case 'END_LEARNING':
      return {
        ...state,
        learningEndedAt: state.learningEndedAt || action.payload,
      };
    case 'START_LEARNING':
      return state.learningStartedAt
        ? state
        : {
          ...state,
          learningStartedAt: action.payload,
          preAssessmentSubmittedAt: action.payload,
        };
    case 'UPDATE_PRE_ASSESSMENT':
      return {
        ...state,
        preAssessment: { ...state.preAssessment, ...action.payload },
      };
    case 'RESET_SESSION':
      return createInitialState();
    default:
      return state;
  }
}

export function SessionProvider({ children }) {
  const [state, dispatch] = useReducer(
    sessionReducer,
    readStoredSession() || createInitialState(),
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;

    const hasMeaningfulData = Boolean(
      state.studentId ||
        state.group ||
        state.mode !== Mode.STUDENT ||
        state.isActive ||
        state.detectedDifficulty ||
        state.selectedAnalogTask ||
        state.hintLevel ||
        Object.values(state.effortRatings).some((value) => value !== null) ||
        Object.values(state.answers).some((value) => value && value.trim().length > 0),
    );

    if (hasMeaningfulData) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
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
      setDetectedDifficulty: (d) =>
        dispatch({ type: 'SET_DETECTED_DIFFICULTY', payload: d }),
      setAnalogTask: (t) => dispatch({ type: 'SET_ANALOG_TASK', payload: t }),
      setHintLevel: (l) => dispatch({ type: 'SET_HINT_LEVEL', payload: l }),
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
      updateGraphWork: (patch) => dispatch({ type: 'UPDATE_GRAPH_WORK', payload: patch }),
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
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSessionContext must be used within SessionProvider');
  }
  return ctx;
}
