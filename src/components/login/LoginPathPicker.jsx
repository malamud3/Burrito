import React from 'react';
import { ActivityPath } from '../../core/types/enums';

const OPTIONS = [
  {
    value: ActivityPath.CLASSIC,
    title: 'מסלול קלאסי',
    description: 'חקירה מתמטית, צעד אחר צעד',
  },
  {
    value: ActivityPath.RENATO,
    title: 'מסלול רנאטו',
    description: 'כלים לארגון ולפירוק החקירה',
  },
];

export default function LoginPathPicker({ value, onChange }) {
  return (
    <fieldset className="login-path-picker">
      <legend>בחרו מסלול למידה</legend>
      {OPTIONS.map((option) => (
        <label className="login-path-option" key={option.value}>
          <input
            type="radio"
            name="activity-path"
            value={option.value}
            checked={value === option.value}
            onChange={(event) => onChange(event.target.value)}
          />
          <span>
            <strong>{option.title}</strong>
            <span>{option.description}</span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}
