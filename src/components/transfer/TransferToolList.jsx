import React from 'react';
import TextAreaField from '../form/TextAreaField';

export default function TransferToolList({ tools, answers, onChange }) {
  return (
    <>
      {tools.map(({ key, title, rows, placeholder }) => (
        <section className="ct-tool" key={key} aria-labelledby={`${key}-title`}>
          <div className="ct-tool-header">
            <div className="ct-tool-title">
              <span id={`${key}-title`}>{title}</span>
            </div>
          </div>
          <TextAreaField
            id={`${key}-response`}
            value={answers[key]}
            onChange={(value) => onChange(key, value)}
            rows={rows}
            placeholder={placeholder}
            ariaLabel={title}
          />
        </section>
      ))}
    </>
  );
}
