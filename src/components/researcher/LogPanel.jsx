import React, { useEffect, useRef } from 'react';
import { formatTimeForLog } from '../../core/utils/timeFormatter';

export default function LogPanel({ logs }) {
  const panelRef = useRef(null);

  // Auto-scroll to the newest entry.
  useEffect(() => {
    const el = panelRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs.length]);

  if (!logs.length) {
    return <div className="empty-state">אין עדיין נתוני לוג להצגה.</div>;
  }

  return (
    <div className="log-panel" ref={panelRef} dir="ltr">
      {logs.map((entry) => (
        <div className="log-entry" key={entry.id}>
          <span className="log-time">[{formatTimeForLog(entry.timestamp)}]</span>{' '}
          <span className="log-action">{entry.actionType}</span>
          {entry.skill && <span> ({entry.skill})</span>}{' '}
          <span className="log-data">{JSON.stringify(entry.data)}</span>
        </div>
      ))}
    </div>
  );
}
