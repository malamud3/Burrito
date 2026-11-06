import React, { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppProviders from '../context/AppProviders';
import { useSessionContext } from '../context/SessionContext';
import { usePhaseContext } from '../context/PhaseContext';
import { useLogContext } from '../context/LogContext';
import { usePhaseNavigation } from '../hooks/usePhaseNavigation';
import { ActivityPath, Phase, Mode, LogActionType } from '../core/types/enums';
import { STUDY_DURATION_SECONDS } from '../core/constants/study';
import { PHASE_PATHS } from '../core/constants/routes';
import AppHeader from '../components/layout/AppHeader';
import { SCREEN_REGISTRY } from './screenRegistry';

const CLASSIC_PHASES = new Set([
  Phase.CLASSIC,
  Phase.CLASSIC_EXTREMA,
  Phase.CLASSIC_ASYMPTOTES,
  Phase.CLASSIC_INTERCEPTS,
  Phase.CLASSIC_GRAPH,
]);

const RENATO_PHASES = new Set([
  Phase.RENATO,
  Phase.RENATO_ASYMPTOTES,
  Phase.RENATO_INTERCEPTS,
  Phase.RENATO_EXTREMA,
  Phase.RENATO_GRAPH,
]);

function PhaseRoute({ phase, Screen }) {
  const { session } = useSessionContext();
  const { logs } = useLogContext();
  const isLearningPhase = CLASSIC_PHASES.has(phase) || RENATO_PHASES.has(phase);
  const timeLimitReached =
    session.mode === Mode.STUDENT &&
    session.learningStartedAt &&
    Date.now() - session.learningStartedAt >= STUDY_DURATION_SECONDS * 1000;
  const learningPath = session.activityPath === ActivityPath.RENATO
    ? PHASE_PATHS[Phase.RENATO]
    : PHASE_PATHS[Phase.CLASSIC];
  if (phase !== Phase.LOGIN && !session.isActive) {
    return <Navigate to={PHASE_PATHS[Phase.LOGIN]} replace />;
  }
  if (
    session.isActive &&
    session.mode === Mode.RESEARCHER &&
    phase !== Phase.LOGIN &&
    phase !== Phase.DASHBOARD
  ) {
    return <Navigate to={PHASE_PATHS[Phase.DASHBOARD]} replace />;
  }
  if (phase === Phase.PRE_ASSESSMENT && session.learningStartedAt) {
    return <Navigate to={learningPath} replace />;
  }
  if (
    isLearningPhase &&
    !session.learningStartedAt &&
    (!session.activityPath || session.allocation?.method === 'demo_local_permuted_blocks')
  ) {
    return <Navigate to={PHASE_PATHS[Phase.PRE_ASSESSMENT]} replace />;
  }
  if (isLearningPhase && (timeLimitReached || session.learningEndedAt)) {
    return <Navigate to={PHASE_PATHS[Phase.TRANSFER_EXAM]} replace />;
  }
  if (
    phase === Phase.TRANSFER_EXAM &&
    !session.learningStartedAt &&
    !timeLimitReached
  ) {
    return <Navigate to={PHASE_PATHS[Phase.PRE_ASSESSMENT]} replace />;
  }
  if (
    phase === Phase.TRANSFER_EXAM &&
    session.allocation &&
    !session.learningEndedAt &&
    !timeLimitReached
  ) {
    return <Navigate to={learningPath} replace />;
  }
  if (
    phase === Phase.COMPLETION &&
    !logs.some(
      (entry) =>
        entry.actionType === LogActionType.TRANSFER_SUBMIT &&
        entry.data?.sessionId === session.sessionId,
    )
  ) {
    return <Navigate to={PHASE_PATHS[Phase.TRANSFER_EXAM]} replace />;
  }
  if (RENATO_PHASES.has(phase) && session.activityPath !== ActivityPath.RENATO) {
    return <Navigate to={PHASE_PATHS[Phase.CLASSIC]} replace />;
  }
  if (CLASSIC_PHASES.has(phase) && session.activityPath !== ActivityPath.CLASSIC) {
    return <Navigate to={PHASE_PATHS[Phase.RENATO]} replace />;
  }
  return <Screen />;
}

function AppShell() {
  const { session, endLearning } = useSessionContext();
  const { currentPhase } = usePhaseContext();
  const { logs, addLog } = useLogContext();
  const { goToTransferAssessment } = usePhaseNavigation();
  const [now, setNow] = useState(Date.now);
  const timedOutSessions = useRef(new Set());

  const instructionIsActive =
    session.isActive &&
    session.mode === Mode.STUDENT &&
    (CLASSIC_PHASES.has(currentPhase) || RENATO_PHASES.has(currentPhase));

  useEffect(() => {
    if (!instructionIsActive) return undefined;
    setNow(Date.now());
    const timerId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timerId);
  }, [instructionIsActive]);

  const elapsedSeconds = session.learningStartedAt
    ? Math.max(0, Math.floor(((session.learningEndedAt || now) - session.learningStartedAt) / 1000))
    : 0;
  const secondsRemaining = Math.max(0, STUDY_DURATION_SECONDS - elapsedSeconds);
  const studyTimeExpired =
    session.isActive &&
    session.mode === Mode.STUDENT &&
    session.learningStartedAt &&
    !session.learningEndedAt &&
    now - session.learningStartedAt >= STUDY_DURATION_SECONDS * 1000;

  useEffect(() => {
    if (!studyTimeExpired) return;
    if (timedOutSessions.current.has(session.sessionId)) return;
    timedOutSessions.current.add(session.sessionId);
    const alreadyLogged = logs.some(
      (entry) =>
        entry.actionType === LogActionType.TIME_LIMIT_REACHED &&
        entry.data?.sessionId === session.sessionId,
    );
    if (!alreadyLogged) {
      addLog(LogActionType.TIME_LIMIT_REACHED, {
        sessionId: session.sessionId,
        studentId: session.studentId,
        activityPath: session.activityPath,
        durationSeconds: STUDY_DURATION_SECONDS,
      });
    }
    if (CLASSIC_PHASES.has(currentPhase) || RENATO_PHASES.has(currentPhase)) {
      goToTransferAssessment({ reason: 'time_limit' });
    } else {
      const endedAt = endLearning();
      addLog(LogActionType.LEARNING_COMPLETE, {
        startedAt: session.learningStartedAt,
        endedAt,
        durationSeconds: session.learningStartedAt
          ? Math.max(0, Math.round((endedAt - session.learningStartedAt) / 1000))
          : null,
        reason: 'time_limit',
        sessionId: session.sessionId,
        studentId: session.studentId,
        activityPath: session.activityPath,
      });
    }
  }, [
    studyTimeExpired,
    logs,
    addLog,
    endLearning,
    session.activityPath,
    session.sessionId,
    session.studentId,
    currentPhase,
    goToTransferAssessment,
  ]);

  const rootPath = session.isActive
    ? PHASE_PATHS[currentPhase] || PHASE_PATHS[Phase.LOGIN]
    : PHASE_PATHS[Phase.LOGIN];

  return (
    <div className="app-shell">
      <AppHeader seconds={secondsRemaining} />
      <Routes>
        {Object.entries(SCREEN_REGISTRY).map(([phase, Screen]) => (
          <Route
            key={phase}
            path={PHASE_PATHS[phase]}
            element={<PhaseRoute phase={phase} Screen={Screen} />}
          />
        ))}
        <Route path="/renato" element={<Navigate to={PHASE_PATHS[Phase.RENATO]} replace />} />
        <Route path="/" element={<Navigate to={rootPath} replace />} />
        <Route path="*" element={<Navigate to={rootPath} replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  );
}
