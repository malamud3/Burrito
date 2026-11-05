import React from 'react';
import { useHintEscalation } from '../../hooks/useHintEscalation';
import { HintLevel } from '../../core/types/enums';
import HintBox from './HintBox';

/** Composes HintBoxes according to the current escalation level. */
export default function BridgingHints() {
  const { currentLevel, getHintTextForLevel } = useHintEscalation();

  return (
    <>
      {currentLevel === HintLevel.NONE && (
        <div className="hint-box visible">
          <div className="hint-level">רמה 0 — ללא רמז</div>
          <p>
            נסה/י לתקן את הפתרון בעצמך. אם את/ה צריך/ה עזרה, לחץ/י על הכפתור
            למטה.
          </p>
        </div>
      )}

      <HintBox
        level={HintLevel.META_COGNITIVE}
        text={getHintTextForLevel(HintLevel.META_COGNITIVE)}
        visible={currentLevel >= HintLevel.META_COGNITIVE}
      />
      <HintBox
        level={HintLevel.STRUCTURE_ORIENTED}
        text={getHintTextForLevel(HintLevel.STRUCTURE_ORIENTED)}
        visible={currentLevel >= HintLevel.STRUCTURE_ORIENTED}
      />
    </>
  );
}
