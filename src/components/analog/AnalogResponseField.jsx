import React from 'react';

export default function AnalogResponseField({
  id,
  label,
  value,
  onChange,
  rows,
  placeholder,
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        placeholder={placeholder}
      />
    </div>
  );
}
