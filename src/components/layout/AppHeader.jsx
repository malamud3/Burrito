import React from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { usePhaseContext } from '../../context/PhaseContext';
import { PHASE_CONFIG } from '../../core/constants/phases';
import { Group, Phase } from '../../core/types/enums';
import { formatTime } from '../../core/utils/timeFormatter';

export default function AppHeader({ seconds }) {
  const { session } = useSessionContext();
  const { currentPhase } = usePhaseContext();

  if (currentPhase === Phase.LOGIN || currentPhase === Phase.DASHBOARD) {
    return null;
  }

  const phaseConfig = PHASE_CONFIG[currentPhase];
  const isAdaptive = session.group === Group.ADAPTIVE;

  return (
    <header className="app-header">
      <h1>🧠 CT-Adapt</h1>
      <div className="header-info">
        <span className="badge badge-phase">{session.studentId}</span>
        <span className={`badge ${isAdaptive ? 'badge-adaptive' : 'badge-fixed'}`}>
          {isAdaptive ? 'אדפטיבית' : 'קבועה'}
        </span>
        <span className="badge badge-phase">
          {phaseConfig?.icon} {phaseConfig?.label}
        </span>
        <span className="timer">{formatTime(seconds)}</span>
      </div>
    </header>
  );
}
