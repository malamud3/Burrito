import { LogActionType, Mode, Phase } from '../core/types/enums';
import { STUDY_DURATION_SECONDS } from '../core/constants/study';
import { PHASE_PATHS } from '../core/constants/routes';

export const LEARNING_PHASES = Object.freeze([
  Phase.RENATO,
  Phase.RENATO_EXTREMA,
  Phase.RENATO_ASYMPTOTES,
  Phase.RENATO_INTERCEPTS,
  Phase.RENATO_GRAPH,
]);

export const isLearningPhase = (phase) => LEARNING_PHASES.includes(phase);

export function getPathForPhase(phase) {
  const path = PHASE_PATHS[phase];
  if (!path) throw new Error(`No route is registered for phase "${phase}"`);
  return path;
}

export function getNextPhase(currentPhase) {
  if (currentPhase === Phase.LOGIN) return Phase.PRE_ASSESSMENT;
  if (currentPhase === Phase.PRE_ASSESSMENT) return LEARNING_PHASES[0];
  if (currentPhase === Phase.TRANSFER_EXAM) return Phase.COMPLETION;

  const index = LEARNING_PHASES.indexOf(currentPhase);
  return index < 0 ? null : LEARNING_PHASES[index + 1] || Phase.TRANSFER_EXAM;
}

function hasTransferSubmission(logs, sessionId) {
  return logs.some(
    (entry) =>
      entry.actionType === LogActionType.TRANSFER_SUBMIT &&
      entry.data?.sessionId === sessionId,
  );
}

function hasExpiredLearning(session, now) {
  return Boolean(
    session.mode === Mode.STUDENT &&
    session.learningStartedAt &&
    now - session.learningStartedAt >= STUDY_DURATION_SECONDS * 1000,
  );
}

export function getRedirect({
  phase,
  session,
  logs = [],
  isTransferNavigation = false,
  now = Date.now(),
}) {
  const expired = hasExpiredLearning(session, now);
  const learningPath = getPathForPhase(Phase.RENATO);

  if (phase !== Phase.LOGIN && !session.isActive) return getPathForPhase(Phase.LOGIN);
  if (
    session.isActive &&
    session.mode === Mode.RESEARCHER &&
    phase !== Phase.LOGIN &&
    phase !== Phase.DASHBOARD
  ) {
    return getPathForPhase(Phase.DASHBOARD);
  }
  if (phase === Phase.DASHBOARD && session.mode !== Mode.RESEARCHER) {
    return getPathForPhase(Phase.COMPLETION);
  }
  if (phase === Phase.PRE_ASSESSMENT && session.learningStartedAt) {
    return learningPath;
  }
  if (isLearningPhase(phase) && !session.learningStartedAt) {
    return getPathForPhase(Phase.PRE_ASSESSMENT);
  }
  if (isLearningPhase(phase) && (expired || session.learningEndedAt)) {
    return getPathForPhase(Phase.TRANSFER_EXAM);
  }
  if (phase === Phase.TRANSFER_EXAM && hasTransferSubmission(logs, session.sessionId)) {
    return getPathForPhase(Phase.COMPLETION);
  }
  if (phase === Phase.TRANSFER_EXAM && !session.learningStartedAt && !expired) {
    return getPathForPhase(Phase.PRE_ASSESSMENT);
  }
  if (
    phase === Phase.TRANSFER_EXAM &&
    session.learningStartedAt &&
    !session.learningEndedAt &&
    !expired &&
    !isTransferNavigation
  ) {
    return learningPath;
  }
  if (
    phase === Phase.COMPLETION &&
    !hasTransferSubmission(logs, session.sessionId)
  ) {
    return getPathForPhase(Phase.TRANSFER_EXAM);
  }

  return null;
}
