import React from 'react';
import StudyHint from '../math/StudyHint';

export function getStepStatus(values) {
  const answeredFields = values.filter(Boolean).length;
  return answeredFields === 0
    ? 'טרם התחלת'
    : answeredFields === values.length
      ? 'השדות מולאו'
      : 'בתהליך';
}

export function FunctionStudyNavigation({ steps, currentStep, statuses, onSelect }) {
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

export default function FunctionStudyStep({
  id,
  title,
  fields,
  hints,
  onHintReveal,
  processTask,
}) {
  return (
    <article className={`renato-card renato-card-${id}`}>
      <header className="renato-card-heading">
        <div>
          <span className="renato-hint-label">שלב בחקירה</span>
          <h3>{title}</h3>
        </div>
      </header>
      <div className="renato-card-fields">
        {fields.map(({ id: fieldId, label, rows, placeholder, value, onChange }) => (
          <div className="renato-field" key={fieldId}>
            <label className="renato-field-label" htmlFor={fieldId}>{label}</label>
            <textarea
              id={fieldId}
              rows={rows}
              dir="auto"
              placeholder={placeholder}
              value={value}
              onChange={(event) => onChange(event.target.value)}
            />
          </div>
        ))}
      </div>
      {processTask && (
        <div className="function-process-task">
          <p>{processTask.prompt}</p>
          <label className="renato-field-label" htmlFor={processTask.id}>
            משימת עיבוד קצרה
          </label>
          <textarea
            id={processTask.id}
            rows={2}
            dir="auto"
            value={processTask.value}
            onChange={(event) => processTask.onChange(event.target.value)}
          />
        </div>
      )}
      {hints && <StudyHint hints={hints} onReveal={onHintReveal} />}
    </article>
  );
}
