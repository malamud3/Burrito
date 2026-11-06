import React from 'react';

export default function TextAreaField({
  id,
  label,
  value,
  onChange,
  rows,
  placeholder,
  dir,
  ariaLabel,
  labelClassName = '',
  className = '',
  ...props
}) {
  const classes = ['field', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {label && (
        <label className={labelClassName} htmlFor={id}>
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        dir={dir}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        {...props}
      />
    </div>
  );
}
