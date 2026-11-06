import React from 'react';
import FunctionStudyField from './FunctionStudyField';

export default function FunctionStudyFields({ fields }) {
  return (
    <div className="renato-card-fields">
      {fields.map((field) => (
        <FunctionStudyField
          key={field.id}
          {...field}
        />
      ))}
    </div>
  );
}
