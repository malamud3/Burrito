// ============================================================
// src/hooks/useEffortScale.js
// ============================================================

import { useCallback } from 'react';
import { useSessionContext } from '../context/SessionContext';
import { useLogContext } from '../context/LogContext';
import { LogActionType } from '../core/types/enums';
import {
  EFFORT_SCALE_MIN,
  EFFORT_SCALE_MAX,
  EFFORT_SCALE_LABELS,
} from '../core/constants/effortScale';

export function useEffortScale() {
  const { session, setEffortRating } = useSessionContext();
  const { addLog } = useLogContext();

  const rate = useCallback(
    (taskKey, value) => {
      if (value < EFFORT_SCALE_MIN || value > EFFORT_SCALE_MAX) return;

      setEffortRating(taskKey, value);
      addLog(LogActionType.EFFORT_RATING, {
        taskKey,
        value,
        label: EFFORT_SCALE_LABELS[value],
      });
    },
    [setEffortRating, addLog],
  );

  return {
    ratings: session.effortRatings,
    rate,
    scaleMin: EFFORT_SCALE_MIN,
    scaleMax: EFFORT_SCALE_MAX,
    scaleLabels: EFFORT_SCALE_LABELS,
  };
}
