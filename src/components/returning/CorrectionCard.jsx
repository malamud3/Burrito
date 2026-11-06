import React from 'react';
import ScreenCard from '../layout/ScreenCard';
import TextAreaField from '../form/TextAreaField';
import ScreenActions from '../layout/ScreenActions';
import ActionButton from '../ui/ActionButton';

export default function CorrectionCard({
  corrected,
  explanation,
  onChange,
  onSubmit,
  onEscalate,
  canEscalate,
}) {
  return (
    <ScreenCard className="card-accent">
      <h2>✍️ התשובה המתוקנת</h2>
      <TextAreaField
        id="corrected-answer"
        label="כתוב/י את הפתרון המעודכן"
        value={corrected}
        onChange={(value) => onChange('corrected', value)}
        rows={4}
        placeholder="הפתרון המתוקן שלי..."
      />
      <TextAreaField
        id="correction-explanation"
        label="מה שינית ולמה?"
        value={explanation}
        onChange={(value) => onChange('correctionExplanation', value)}
        rows={2}
        placeholder="שיניתי את... כי..."
      />
      <ScreenActions>
        <ActionButton onClick={onSubmit}>
          שלח/י תשובה מתוקנת
        </ActionButton>
        <ActionButton tone="outline" onClick={onEscalate} disabled={!canEscalate}>
          💡 אני צריך/ה רמז נוסף
        </ActionButton>
      </ScreenActions>
    </ScreenCard>
  );
}
