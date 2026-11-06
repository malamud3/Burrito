import { ActivityPath, Mode } from '../types/enums';
import { RENATO_FUNCTION } from '../constants/renato';
import { createEmptyFunctionAssessment } from '../constants/functionAssessments';

export const createInitialSessionState = () => ({
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
  studyPrompts: {
    domain: '',
    extrema: '',
    asymptotes: '',
    intercepts: '',
  },
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
      extrema: { order: 2, suspectedX: '', points: '', derivative: '', checked: false },
      asymptotes: { order: 3, vertical: '', horizontal: '', checked: false },
      intercepts: { order: 4, yAxis: '', xAxis: '', checked: false },
    },
    valueCache: {},
    cacheNotification: null,
    grid: true,
    graphStrokes: [],
    drawMode: false,
    graphMarkers: false,
    graphAsymptoteStyle: 'dashed',
    drawnDomains: { 1: false, 2: false, 3: false, 4: false },
    signBehavior: '',
  },
});

export function normalizeSessionState(parsed) {
  if (!parsed || typeof parsed !== 'object') return null;

  const initial = createInitialSessionState();
  return {
    ...initial,
    ...parsed,
    sessionId: parsed.sessionId || `session_${parsed.startTime || Date.now()}`,
    activityPath: parsed.activityPath === null &&
      parsed.mode === Mode.STUDENT &&
      !parsed.learningStartedAt
      ? null
      : parsed.activityPath === ActivityPath.RENATO
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
    answers: { ...initial.answers, ...(parsed.answers || {}) },
    classicWork: { ...initial.classicWork, ...(parsed.classicWork || {}) },
    transferAssessment: {
      ...initial.transferAssessment,
      ...(parsed.transferAssessment || {}),
    },
    preAssessment: {
      ...initial.preAssessment,
      ...(parsed.preAssessment || {}),
    },
    studyPrompts: Object.fromEntries(
      Object.entries(initial.studyPrompts).map(([key, defaultValue]) => [
        key,
        typeof parsed.studyPrompts?.[key] === 'string'
          ? parsed.studyPrompts[key]
          : defaultValue,
      ]),
    ),
    effortRatings: { ...initial.effortRatings, ...(parsed.effortRatings || {}) },
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
      ...Object.fromEntries(
        Object.entries(parsed.renatoWork || {}).filter(([key]) => key !== 'table'),
      ),
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
      drawnDomains: {
        ...initial.renatoWork.drawnDomains,
        ...(parsed.renatoWork?.drawnDomains || {}),
      },
      graphStrokes: Array.isArray(parsed.renatoWork?.graphStrokes)
        ? parsed.renatoWork.graphStrokes
        : initial.renatoWork.graphStrokes,
    },
  };
}

const updateTool = (state, tool, patch) => ({
  ...state,
  toolState: {
    ...state.toolState,
    [tool]: { ...state.toolState[tool], ...patch },
  },
});

export function sessionReducer(state, action) {
  switch (action.type) {
    case 'INIT_SESSION':
      return {
        ...createInitialSessionState(),
        ...action.payload,
        isActive: true,
        startTime: Date.now(),
      };
    case 'ASSIGN_STUDY_PATH':
      return {
        ...state,
        activityPath: action.payload.activityPath,
        allocation: action.payload.allocation,
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
      return { ...state, renatoWork: { ...state.renatoWork, ...action.payload } };
    case 'UPDATE_CLASSIC_WORK':
      return { ...state, classicWork: { ...state.classicWork, ...action.payload } };
    case 'UPDATE_TRANSFER_ASSESSMENT':
      return {
        ...state,
        transferAssessment: { ...state.transferAssessment, ...action.payload },
      };
    case 'UPDATE_GRAPH_WORK':
      return { ...state, graphWork: { ...state.graphWork, ...action.payload } };
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
    case 'UPDATE_STUDY_PROMPT':
      return {
        ...state,
        studyPrompts: {
          ...state.studyPrompts,
          [action.payload.key]: action.payload.value,
        },
      };
    case 'RESET_SESSION':
      return createInitialSessionState();
    default:
      return state;
  }
}

export function hasMeaningfulSessionData(state) {
  return Boolean(
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
}
