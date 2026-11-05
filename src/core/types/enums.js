// ============================================================
// src/core/types/enums.js
// Single source of truth for all string-literal "enums".
// ============================================================

export const Phase = Object.freeze({
  LOGIN: 'login',
  PRE_ASSESSMENT: 'pre-assessment',
  CLASSIC: 'classic',
  PROBLEM: 'problem',
  SOLVING: 'solving',
  DIFFICULTY: 'difficulty',
  ANALOG: 'analog',
  RETURN: 'return',
  TRANSFER: 'transfer',
  EFFORT: 'effort',
  RENATO: 'renato',
  RENATO_ASYMPTOTES: 'renato-asymptotes',
  RENATO_INTERCEPTS: 'renato-intercepts',
  RENATO_EXTREMA: 'renato-extrema',
  RENATO_GRAPH: 'renato-graph',
  TRANSFER_EXAM: 'transfer-exam',
  COMPLETION: 'completion',
  DASHBOARD: 'dashboard',
});

export const ActivityPath = Object.freeze({
  CLASSIC: 'classic',
  RENATO: 'renato',
});

export const Group = Object.freeze({
  ADAPTIVE: 'adaptive',
  FIXED: 'fixed',
});

export const Mode = Object.freeze({
  STUDENT: 'student',
  RESEARCHER: 'researcher',
});

export const CTSkill = Object.freeze({
  DECOMPOSITION: 'decomposition',
  ABSTRACTION: 'abstraction',
  ALGORITHMIC: 'algorithmic',
});

export const ToolStatus = Object.freeze({
  WAITING: 'waiting',
  WORKING: 'working',
  DONE: 'done',
  STRUGGLE: 'struggle',
});

export const HintLevel = Object.freeze({
  NONE: 0,
  META_COGNITIVE: 1,
  STRUCTURE_ORIENTED: 2,
});

export const LogActionType = Object.freeze({
  PHASE_CHANGE: 'phase_change',
  ACTIVITY_START: 'activity_start',
  PRE_ASSESSMENT_START: 'pre_assessment_start',
  PRE_ASSESSMENT_SUBMIT: 'pre_assessment_submit',
  LEARNING_START: 'learning_start',
  ACTIVITY_COMPLETE: 'activity_complete',
  TOOL_INTERACTION: 'tool_interaction',
  EDIT: 'edit',
  SUBMIT: 'submit',
  HINT_REQUEST: 'hint_request',
  HINT_ESCALATION: 'hint_escalation',
  DIFFICULTY_DETECTED: 'difficulty_detected',
  ANALOG_START: 'analog_start',
  ANALOG_COMPLETE: 'analog_complete',
  ANSWER_SUBMIT: 'answer_submit',
  CORRECTION_SUBMIT: 'correction_submit',
  TRANSFER_SUBMIT: 'transfer_submit',
  TRANSFER_ASSESSMENT_START: 'transfer_assessment_start',
  TIME_LIMIT_REACHED: 'time_limit_reached',
  EFFORT_RATING: 'effort_rating',
  STEP_ADD: 'step_add',
  STEP_REMOVE: 'step_remove',
  FLOW_NODE_ADD: 'flow_node_add',
  TIMER_TICK: 'timer_tick',
});
