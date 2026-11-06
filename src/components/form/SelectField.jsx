import React from 'react';

export default function SelectField({
  id,
  label,
  value,
  options,
  onChange,
  className = '',
}) {
  const classes = ['field', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
