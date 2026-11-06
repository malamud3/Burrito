import React from 'react';
import ActionButton from '../ui/ActionButton';
import AnalogResponseField from './AnalogResponseField';

const RESPONSE_FIELDS = [
  {
    id: 'analog-decomp',
    answerKey: 'analogDecomp',
    label: 'פרק/י את המשימה לשלבים',
    rows: 3,
    placeholder: 'שלב 1: ... שלב 2: ...',
  },
  {
    id: 'analog-abstract',
    answerKey: 'analogAbstract',
    label: 'מה הנתונים החשובים?',
    rows: 2,
    placeholder: 'הנתונים הרלוונטיים הם...',
  },
  {
    id: 'analog-answer',
    answerKey: 'analogAnswer',
    label: 'הפתרון שלך',
    rows: 3,
    placeholder: 'כתוב/י את הפתרון...',
  },
];

export default function AnalogWorkPanel({ answers, onAnswerChange, onSubmit }) {
  return (
    <section className="ct-tool" aria-labelledby="analog-work-title">
      <div className="ct-tool-header">
        <div className="ct-tool-title">
          <span id="analog-work-title">🛠️ פתרון המשימה</span>
        </div>
      </div>

      {RESPONSE_FIELDS.map((field) => (
        <AnalogResponseField
          key={field.id}
          {...field}
          value={answers[field.answerKey]}
          onChange={(value) => onAnswerChange(field.answerKey, value)}
        />
      ))}

      <div className="btn-group analog-actions">
        <ActionButton tone="success" onClick={onSubmit}>
          סיימתי את המשימה — חזרה לבעיה ←
        </ActionButton>
      </div>
    </section>
  );
}
