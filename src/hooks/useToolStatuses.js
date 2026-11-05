// ============================================================
// src/hooks/useToolStatuses.js
// Derives each CT tool's status from the log trace.
// ============================================================

import { useMemo } from 'react';
import { useLogContext } from '../context/LogContext';
import { CTSkill, ToolStatus } from '../core/types/enums';

export function useToolStatuses(struggleSkill = null) {
  const { logs } = useLogContext();

  return useMemo(
    () =>
      Object.values(CTSkill).reduce((acc, skill) => {
        if (skill === struggleSkill) acc[skill] = ToolStatus.STRUGGLE;
        else if (logs.some((l) => l.skill === skill)) acc[skill] = ToolStatus.WORKING;
        else acc[skill] = ToolStatus.WAITING;
        return acc;
      }, {}),
    [logs, struggleSkill],
  );
}
