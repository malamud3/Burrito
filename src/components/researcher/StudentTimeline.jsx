import React, { useMemo } from 'react';
import { computePhaseDurations } from '../../services/LogAnalyticsService';
import { PHASE_CONFIG } from '../../core/constants/phases';
import { formatTime } from '../../core/utils/timeFormatter';

export default function StudentTimeline({ logs }) {
  const durations = useMemo(() => computePhaseDurations(logs), [logs]);
  const max = Math.max(1, ...durations.map((d) => d.seconds));

  if (!durations.length) {
    return <div className="empty-state">אין עדיין נתוני ציר זמן.</div>;
  }

  return (
    <div>
      {durations.map((d, i) => (
        <div className="timeline-row" key={`${d.phase}-${i}`}>
          <div className="timeline-label">
            {PHASE_CONFIG[d.phase]?.icon} {PHASE_CONFIG[d.phase]?.label || d.phase}
          </div>
          <div className="timeline-track">
            <div
              className="timeline-fill"
              style={{ width: `${(d.seconds / max) * 100}%` }}
            />
          </div>
          <div className="timeline-value">{formatTime(d.seconds)}</div>
        </div>
      ))}
    </div>
  );
}
