import React, { useEffect, useMemo, useRef, useState } from 'react';
import { formatTimeForLog } from '../../core/utils/timeFormatter';

const PAGE_SIZE = 250;

export default function LogPanel({ logs }) {
  const panelRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [logs.length]);

  // Auto-scroll to the newest entry.
  useEffect(() => {
    const el = panelRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs.length]);

  const visibleLogs = useMemo(
    () => logs.slice(Math.max(0, logs.length - visibleCount)),
    [logs, visibleCount],
  );
  const hiddenCount = logs.length - visibleLogs.length;

  if (!logs.length) {
    return <div className="empty-state">אין עדיין נתוני לוג להצגה.</div>;
  }

  return (
    <div>
      {hiddenCount > 0 && (
        <button
          className="btn btn-outline btn-sm log-load-more"
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
        >
          הצגת {Math.min(PAGE_SIZE, hiddenCount)} רשומות קודמות
        </button>
      )}
      <div className="log-panel" ref={panelRef} dir="ltr">
        {visibleLogs.map((entry) => (
          <div className="log-entry" key={entry.id}>
            <span className="log-time">[{formatTimeForLog(entry.timestamp)}]</span>{' '}
            <span className="log-action">{entry.actionType}</span>
            {entry.skill && <span> ({entry.skill})</span>}{' '}
            <span className="log-data">{JSON.stringify(entry.data)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
