import { ActivityPath, LogActionType, Mode, Phase } from '../core/types/enums';
import { STUDY_DURATION_SECONDS } from '../core/constants/study';
import { PHASE_PATHS } from '../core/constants/routes';

export const CLASSIC_PHASES = new Set([
  Phase.CLASSIC,
  Phase.CLASSIC_EXTREMA,
  Phase.CLASSIC_ASYMPTOTES,
  Phase.CLASSIC_INTERCEPTS,
  Phase.CLASSIC_GRAPH,
]);

export const RENATO_PHASES = new Set([
  Phase.RENATO,
  Phase.RENATO_ASYMPTOTES,
  Phase.RENATO_INTERCEPTS,
  Phase.RENATO_EXTREMA,
  Phase.RENATO_GRAPH,
]);

export function isLearningPhase(phase) {
  return CLASSIC_PHASES.has(phase) || RENATO_PHASES.has(phase);
}

function getLearningPath(activityPath) {
  return activityPath === ActivityPath.RENATO
    ? PHASE_PATHS[Phase.RENATO]
    : PHASE_PATHS[Phase.CLASSIC];
}

function hasTransferSubmission(logs, sessionId) {
  return logs.some(
    (entry) =>
      entry.actionType === LogActionType.TRANSFER_SUBMIT &&
      entry.data?.sessionId === sessionId,
  );
}

export function getPhaseRedirect({
  phase,
  session,
  logs,
  isTransferNavigation = false,
  now = Date.now(),
}) {
  const learningPhase = isLearningPhase(phase);
  const timeLimitReached =
    session.mode === Mode.STUDENT &&
    session.learningStartedAt &&
    now - session.learningStartedAt >= STUDY_DURATION_SECONDS * 1000;
  const learningPath = getLearningPath(session.activityPath);

  if (phase !== Phase.LOGIN && !session.isActive) {
    return PHASE_PATHS[Phase.LOGIN];
  }
  if (
    session.isActive &&
    session.mode === Mode.RESEARCHER &&
    phase !== Phase.LOGIN &&
    phase !== Phase.DASHBOARD
  ) {
    return PHASE_PATHS[Phase.DASHBOARD];
  }
  if (phase === Phase.DASHBOARD && session.mode !== Mode.RESEARCHER) {
    return PHASE_PATHS[Phase.COMPLETION];
  }
  if (phase === Phase.PRE_ASSESSMENT && session.learningStartedAt) {
    return learningPath;
  }
  if (learningPhase && !session.learningStartedAt) {
    return PHASE_PATHS[Phase.PRE_ASSESSMENT];
  }
  if (learningPhase && (timeLimitReached || session.learningEndedAt)) {
    return PHASE_PATHS[Phase.TRANSFER_EXAM];
  }
  if (
    phase === Phase.TRANSFER_EXAM &&
    hasTransferSubmission(logs, session.sessionId)
  ) {
    return PHASE_PATHS[Phase.COMPLETION];
  }
  if (
    phase === Phase.TRANSFER_EXAM &&
    !session.learningStartedAt &&
    !timeLimitReached
  ) {
    return PHASE_PATHS[Phase.PRE_ASSESSMENT];
  }
  if (
    phase === Phase.TRANSFER_EXAM &&
    session.learningStartedAt &&
    !session.learningEndedAt &&
    !timeLimitReached &&
    !isTransferNavigation
  ) {
    return learningPath;
  }
  if (
    phase === Phase.COMPLETION &&
    !hasTransferSubmission(logs, session.sessionId)
  ) {
    return PHASE_PATHS[Phase.TRANSFER_EXAM];
  }
  if (RENATO_PHASES.has(phase) && session.activityPath !== ActivityPath.RENATO) {
    return PHASE_PATHS[Phase.CLASSIC];
  }
  if (CLASSIC_PHASES.has(phase) && session.activityPath !== ActivityPath.CLASSIC) {
    return PHASE_PATHS[Phase.RENATO];
  }

  return null;
}
