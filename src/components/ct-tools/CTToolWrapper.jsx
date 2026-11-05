import React from 'react';
import { CT_SKILL_CONFIG } from '../../core/constants/ctSkills';
import { ToolStatus } from '../../core/types/enums';

const STATUS_CONFIG = {
  [ToolStatus.WAITING]: { label: 'ממתין', className: 'status-waiting' },
  [ToolStatus.WORKING]: { label: 'בעבודה', className: 'status-working' },
  [ToolStatus.DONE]: { label: 'הושלם', className: 'status-done' },
  [ToolStatus.STRUGGLE]: { label: 'קושי אפשרי', className: 'status-struggle' },
};

/**
 * Open/Closed: wraps any CT tool with consistent chrome
 * (header, status badge, instructions).
 */
export default function CTToolWrapper({
  skill,
  status = ToolStatus.WAITING,
  children,
}) {
  const config = CT_SKILL_CONFIG[skill];
  const statusConfig = STATUS_CONFIG[status];
  if (!config) return null;

  const isStruggle = status === ToolStatus.STRUGGLE;
  const isWorking = status === ToolStatus.WORKING;

  return (
    <div
      className={`ct-tool ${isWorking ? 'active-tool' : ''} ${
        isStruggle ? 'difficulty-detected pulse' : ''
      }`}
    >
      <div className="ct-tool-header">
        <div className="ct-tool-title">
          <div className={`ct-icon ${config.colorClass}`}>{config.icon}</div>
          <span>{config.description}</span>
        </div>
        <span className={`ct-status ${statusConfig.className}`}>
          {statusConfig.label}
        </span>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: 12 }}>
        {config.instructions}
      </p>
      {children}
    </div>
  );
}
