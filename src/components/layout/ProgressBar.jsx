import React from 'react';
import { usePhaseContext } from '../../context/PhaseContext';
import { PHASE_CONFIG } from '../../core/constants/phases';

export default function ProgressBar() {
  const { currentPhase } = usePhaseContext();
  const progress = PHASE_CONFIG[currentPhase]?.progress || 0;

  return (
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
