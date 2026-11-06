import React from 'react';
import TextAreaField from '../form/TextAreaField';

export default function AnalogResponseField({
  id,
  label,
  value,
  onChange,
  rows,
  placeholder,
}) {
  return (
    <TextAreaField
      id={id}
      label={label}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
    />
  );
}
