import React from 'react';
import { useEffortScale } from '../../hooks/useEffortScale';

export default function EffortScale({ taskKey, title }) {
  const { ratings, rate, scaleMin, scaleMax, scaleLabels } = useEffortScale();
  const current = ratings[taskKey];

  const values = Array.from(
    { length: scaleMax - scaleMin + 1 },
    (_, i) => scaleMin + i,
  );

  return (
    <div className="card">
      <h2>📊 {title || 'דירוג מאמץ מנטלי'}</h2>
      <p style={{ color: 'var(--text2)', marginBottom: 16 }}>
        באיזו מידה נדרשת ממך השקעת מאמץ מנטלי במשימה זו?
      </p>

      <div className="effort-scale">
        {values.map((value) => (
          <button
            key={value}
            className={`effort-btn ${current === value ? 'selected' : ''}`}
            onClick={() => rate(taskKey, value)}
            title={scaleLabels[value]}
            aria-label={`${value} — ${scaleLabels[value]}`}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="effort-labels">
        <span>{scaleLabels[scaleMin]}</span>
        <span>{scaleLabels[scaleMax]}</span>
      </div>

      {current && (
        <p
          style={{
            textAlign: 'center',
            marginTop: 12,
            color: 'var(--primary)',
            fontWeight: 600,
          }}
        >
          בחרת: {current} — {scaleLabels[current]}
        </p>
      )}
    </div>
  );
}
