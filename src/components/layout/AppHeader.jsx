import React from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { usePhaseContext } from '../../context/PhaseContext';
import { PHASE_CONFIG } from '../../core/constants/phases';
import { ActivityPath, Phase } from '../../core/types/enums';
import { formatTime } from '../../core/utils/timeFormatter';

export default function AppHeader({ seconds }) {
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
        <span className="badge badge-phase">{session.studentId}</span>
        <span className={`badge ${isRenato ? 'badge-renato' : 'badge-classic'}`}>
          {isRenato ? 'מסלול רנאטו' : 'מסלול קלאסי'}
        </span>
        <span className="badge badge-phase">
          {phaseConfig?.icon} {phaseConfig?.label}
        </span>
        {session.learningStartedAt && !session.learningEndedAt && (
          <span className="timer" aria-label="זמן נותר">{formatTime(seconds)}</span>
        )}
      </div>
    </header>
  );
}
