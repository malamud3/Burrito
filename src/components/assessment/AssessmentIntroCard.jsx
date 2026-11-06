import React from 'react';
import ScreenCard from '../layout/ScreenCard';
import FunctionFraction from '../math/FunctionFraction';

export default function AssessmentIntroCard({ description, assessmentFunction, ariaLabel }) {
  return (
    <ScreenCard>
      <p>{description}</p>
      <div className="renato-function" aria-label={ariaLabel}>
        <span className="renato-function-label">הפונקציה לבחינה</span>
        <FunctionFraction
          numerator={assessmentFunction.numerator}
          denominator={assessmentFunction.denominator}
          ariaLabel={`${assessmentFunction.name} = ${assessmentFunction.expression}`}
          functionName={assessmentFunction.name}
          className="renato-function-expression"
        />
      </div>
    </ScreenCard>
  );
}
