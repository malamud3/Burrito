import React from 'react';
import TextAreaField from '../form/TextAreaField';
import ScreenCard from '../layout/ScreenCard';
import ScreenActions from '../layout/ScreenActions';
import ActionButton from '../ui/ActionButton';

export default function AssessmentQuestionForm({
  questions,
  answers,
  idPrefix,
  ariaLabel,
  onChange,
  onSubmit,
  submitLabel,
}) {
  return (
    <ScreenCard aria-label={ariaLabel}>
      {questions.map(({ key, label, rows }) => (
        <TextAreaField
          key={key}
          id={`${idPrefix}-${key}`}
          label={label}
          rows={rows}
          dir="auto"
          value={answers[key]}
          onChange={(value) => onChange(key, value)}
        />
      ))}
      <ScreenActions centered>
        <ActionButton onClick={onSubmit}>
          {submitLabel}
        </ActionButton>
      </ScreenActions>
    </ScreenCard>
  );
}
