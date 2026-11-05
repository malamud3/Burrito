import React, { useState } from 'react';

export default function ProblemReminder({ problemText }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div
      className="card"
      style={{ padding: '14px 20px', marginBottom: 16, cursor: 'pointer' }}
      onClick={toggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggle()}
      aria-expanded={isOpen}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>📌 הבעיה</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>
          {isOpen ? 'הסתר ▴' : 'הצג ▾'}
        </span>
      </div>
      {isOpen && (
        <div
          style={{
            marginTop: 12,
            fontSize: '0.9rem',
            color: 'var(--text2)',
            whiteSpace: 'pre-line',
          }}
        >
          {problemText}
        </div>
      )}
    </div>
  );
}
