import React from 'react';
import TextAreaField from '../form/TextAreaField';

export default function FunctionProcessTask({ task }) {
  return (
    <div className="function-process-task">
      <p>{task.prompt}</p>
      <TextAreaField
        id={task.id}
        label="משימת עיבוד קצרה"
        labelClassName="renato-field-label"
        rows={2}
        dir="auto"
        value={task.value}
        onChange={task.onChange}
      />
    </div>
  );
}
