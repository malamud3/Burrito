import React from 'react';

export default function CompletionSummary({ rows }) {
  return (
    <ul className="summary-list completion-summary">
      {rows.map(([label, value]) => (
        <li key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </li>
      ))}
    </ul>
  );
}
