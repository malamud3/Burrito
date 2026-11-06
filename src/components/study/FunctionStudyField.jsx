import React from 'react';
import TextAreaField from '../form/TextAreaField';

export default function FunctionStudyField({
  id,
  label,
  rows,
  placeholder,
  value,
  onChange,
}) {
  return (
    <TextAreaField
      id={id}
      label={label}
      labelClassName="renato-field-label"
      className="renato-field"
      rows={rows}
      dir="auto"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
