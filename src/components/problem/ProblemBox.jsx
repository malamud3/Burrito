import React from 'react';

export default function ProblemBox({ label, labelColor, text, question, children }) {
  return (
    <div className="problem-box">
      <span
        className="problem-label"
        style={labelColor ? { background: labelColor } : undefined}
      >
        {label}
      </span>
      <div className="problem-text" style={{ whiteSpace: 'pre-line' }}>
        {text}
      </div>
      {question && (
        <div className="problem-question" style={{ whiteSpace: 'pre-line' }}>
          {question}
        </div>
      )}
      {children}
    </div>
  );
}
