import React from 'react';

export default function AnswerBox({
  title = '✍️ התשובה שלך',
  fieldLabel = 'רשום/י את הפתרון המלא',
  value,
  onChange,
  placeholder = 'כתוב/י כאן את הפתרון שלך...',
  rows = 4,
  accentBorder = true,
  children,
}) {
  return (
    <div className={`card ${accentBorder ? 'card-accent' : ''}`}>
      <h2>{title}</h2>
      <div className="field">
        <label>{fieldLabel}</label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
        />
      </div>
      {children}
    </div>
  );
}
