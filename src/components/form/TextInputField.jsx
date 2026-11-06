import React from 'react';

export default function TextInputField({
  id,
  label,
  value,
  onChange,
  className = '',
  ...props
}) {
  const classes = ['field', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        {...props}
      />
    </div>
  );
}
