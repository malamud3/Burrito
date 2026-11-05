import React, { useState } from 'react';

export default function StudyHint({ hints, onReveal }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const hasMoreHints = visibleCount < hints.length;

  const revealNextHint = () => {
    if (!hasMoreHints) return;
    const nextHint = visibleCount + 1;
    setVisibleCount(nextHint);
    onReveal?.(nextHint);
  };

  return (
    <section className="study-hint" aria-label="רמזים מדורגים">
      {visibleCount > 0 && (
        <ol className="study-hint-list" aria-live="polite">
          {hints.slice(0, visibleCount).map((hint, index) => (
            <li className="study-hint-item" key={hint}>
              <span className="study-hint-number">{index + 1}</span>
              <p dir="auto">{hint}</p>
            </li>
          ))}
        </ol>
      )}
      {hasMoreHints ? (
        <button
          className="study-hint-trigger"
          type="button"
          onClick={revealNextHint}
        >
          {visibleCount === 0 ? 'צריך/ה כיוון?' : 'עדיין צריך/ה כיוון?'}
          <span>
            הצגת שלב עזר {visibleCount + 1} מתוך {hints.length}
          </span>
        </button>
      ) : (
        <p className="study-hint-complete" role="status">
          כל שלבי העזר זמינים למעלה.
        </p>
      )}
    </section>
  );
}
