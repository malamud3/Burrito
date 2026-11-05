import React, { useMemo } from 'react';
import {
  computeToolEngagement,
  getDetectionEvents,
} from '../../services/LogAnalyticsService';
import { CT_SKILL_CONFIG } from '../../core/constants/ctSkills';
import { formatTime } from '../../core/utils/timeFormatter';

export default function DetectionReport({ logs }) {
  const events = useMemo(() => getDetectionEvents(logs), [logs]);
  const engagement = useMemo(() => computeToolEngagement(logs), [logs]);

  return (
    <div>
      <h4 style={{ marginBottom: 8 }}>אירועי זיהוי</h4>
      {events.length === 0 ? (
        <div className="empty-state">לא זוהו קשיים בפגישה זו.</div>
      ) : (
        events.map((e, i) => (
          <div className="detection-row" key={i}>
            <span>
              {CT_SKILL_CONFIG[e.skill]?.icon} {CT_SKILL_CONFIG[e.skill]?.label || e.skill}
            </span>
            <span style={{ color: 'var(--text2)' }}>
              כלל: {e.ruleId} · הפעלה: {e.trigger === 'student_request' ? 'בקשת תלמיד' : 'אוטומטית'}
            </span>
          </div>
        ))
      )}

      <h4 style={{ margin: '24px 0 8px' }}>מעורבות בכלי חשיבה חישובית</h4>
      {engagement.map((e) => (
        <div className="detection-row" key={e.skill}>
          <span>
            {CT_SKILL_CONFIG[e.skill].icon} {CT_SKILL_CONFIG[e.skill].label}
          </span>
          <span style={{ color: 'var(--text2)' }}>
            {e.totalInteractions} פעולות · {e.edits} עריכות · {formatTime(e.timeSpentSeconds)}
          </span>
        </div>
      ))}
    </div>
  );
}
