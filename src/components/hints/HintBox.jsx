import React from 'react';
import { HINT_LEVEL_LABELS } from '../../core/constants/hintLevels';

export default function HintBox({ level, text, visible }) {
  if (!visible || !text) return null;

  return (
    <div className="hint-box visible">
      <div className="hint-level">{HINT_LEVEL_LABELS[level]}</div>
      <p>{text}</p>
    </div>
  );
}
