import React from 'react';

export default function FunctionFraction({
  functionName = 'f(x)',
  numerator,
  denominator,
  ariaLabel,
  className = '',
}) {
  const accessibleLabel =
    ariaLabel || `${functionName} = ${numerator} over ${denominator}`;

  return (
    <span
      className={`function-fraction${className ? ` ${className}` : ''}`}
      dir="ltr"
      role="math"
      aria-label={accessibleLabel}
    >
      <span className="function-fraction-name" aria-hidden="true">
        {functionName} =
      </span>
      <span className="function-fraction-stack" aria-hidden="true">
        <span className="function-fraction-numerator">{numerator}</span>
        <span className="function-fraction-denominator">{denominator}</span>
      </span>
    </span>
  );
}
