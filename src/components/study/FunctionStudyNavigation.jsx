import React from 'react';

export default function FunctionStudyNavigation({
  steps,
  currentStep,
  statuses,
  onSelect,
}) {
  return (
    <nav className="renato-step-navigation" aria-label="שלבי חקירת הפונקציה">
      {steps.map((step, index) => (
        <button
          key={step.id}
          type="button"
          className={`renato-step-link${index === currentStep ? ' is-current' : ''}`}
          aria-current={index === currentStep ? 'step' : undefined}
          onClick={() => onSelect(index)}
        >
          <span>
            {step.graph ? 'פתרון מסכם' : `שלב ${index + 1} · ${statuses[index]}`}
          </span>
          <strong>{step.title}</strong>
          {step.graph && <span>{statuses[index]}</span>}
        </button>
      ))}
    </nav>
  );
}
