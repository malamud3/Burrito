import React from 'react';

export default function StudyHint({ hints }) {
  return (
    <details className="renato-scratchpad">
      <summary>צריך/ה כיוון? הצג/י רמז נוסף</summary>
      <div className="renato-scratchpad-content" dir="ltr">
        {hints.map((hint) => <p key={hint}>{hint}</p>)}
      </div>
    </details>
  );
}
