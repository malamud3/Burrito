import React, { useEffect, useState } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { usePhaseContext } from '../../context/PhaseContext';
import { PHASE_CONFIG } from '../../core/constants/phases';
import { ActivityPath, Mode, Phase } from '../../core/types/enums';
import { STUDY_DURATION_SECONDS } from '../../core/constants/study';
import { formatTime } from '../../core/utils/timeFormatter';
import AppBadge from '../ui/AppBadge';
import Chip from '@mui/material/Chip';

function StudyTimer({ startedAt }) {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    setNow(Date.now());
    const timerId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timerId);
  }, [startedAt]);

  const elapsedSeconds = Math.max(0, Math.floor((now - startedAt) / 1000));
  const seconds = Math.max(0, STUDY_DURATION_SECONDS - elapsedSeconds);

  return (
    <Chip
      className="timer"
      size="small"
      aria-label="זמן נותר"
      label={formatTime(seconds)}
    />
  );
}

export default function AppHeader() {
  const { session } = useSessionContext();
  const { currentPhase } = usePhaseContext();

  if (currentPhase === Phase.LOGIN || currentPhase === Phase.DASHBOARD) {
    return null;
  }

  const phaseConfig = PHASE_CONFIG[currentPhase];
  const isRenato = session.activityPath === ActivityPath.RENATO;

  return (
    <header className="app-header">
      <h1 className="app-brand">
        <span className="app-brand-mark" aria-hidden="true">B</span>
        <span>Burrito</span>
      </h1>
      <div className="header-info">
        <AppBadge>{session.studentId}</AppBadge>
        <AppBadge className={`badge ${isRenato ? 'badge-renato' : 'badge-classic'}`}>
          {isRenato ? 'מסלול רנאטו' : 'מסלול קלאסי'}
        </AppBadge>
        <AppBadge>
          {phaseConfig?.icon} {phaseConfig?.label}
        </AppBadge>
        {session.mode === Mode.STUDENT && session.learningStartedAt && !session.learningEndedAt && (
          <StudyTimer startedAt={session.learningStartedAt} />
        )}
      </div>
    </header>
  );
}
