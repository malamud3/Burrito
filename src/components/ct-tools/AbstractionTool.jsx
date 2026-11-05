import React, { useCallback, useEffect } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useLogger } from '../../hooks/useLogger';
import { CTSkill, LogActionType } from '../../core/types/enums';
import { MAIN_PROBLEM } from '../../core/constants/problems';
import CTToolWrapper from './CTToolWrapper';

export default function AbstractionTool({ status }) {
  const { session, updateAbstractionRows } = useSessionContext();
  const { log } = useLogger();
  const rows = session.toolState.abstraction.rows;

  // Seed rows from the problem definition the first time the tool mounts.
  useEffect(() => {
    if (rows.length === 0) {
      updateAbstractionRows(
        MAIN_PROBLEM.abstractionData.map((item, i) => ({
          id: `abs_${i}`,
          datum: item.datum,
          actualRelevant: item.relevant,
          actualRole: item.role,
          userRelevant: undefined,
          userRole: '',
        })),
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const patchRow = useCallback(
    (rowId, patch, field, value) => {
      updateAbstractionRows(rows.map((r) => (r.id === rowId ? { ...r, ...patch } : r)));
      log(LogActionType.EDIT, { rowId, field, value }, CTSkill.ABSTRACTION);
    },
    [rows, updateAbstractionRows, log],
  );

  const handleRelevanceChange = (rowId, raw) => {
    if (raw === '') {
      patchRow(rowId, { userRelevant: undefined }, 'relevant', null);
      return;
    }
    const value = raw === 'כן';
    patchRow(rowId, { userRelevant: value }, 'relevant', value);
  };

  const handleRoleChange = (rowId, value) =>
    patchRow(rowId, { userRole: value }, 'role', value);

  const selectValue = (row) =>
    row.userRelevant === undefined ? '' : row.userRelevant ? 'כן' : 'לא';

  return (
    <CTToolWrapper skill={CTSkill.ABSTRACTION} status={status}>
      <table className="abstraction-table">
        <thead>
          <tr>
            <th style={{ width: '40%' }}>נתון / מידע</th>
            <th style={{ width: '25%' }}>רלוונטי?</th>
            <th style={{ width: '35%' }}>תפקיד בפתרון</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td style={{ color: 'var(--text)', fontSize: '0.9rem' }}>{row.datum}</td>
              <td>
                <select
                  value={selectValue(row)}
                  onChange={(e) => handleRelevanceChange(row.id, e.target.value)}
                  style={{ fontSize: '0.85rem', padding: '6px 8px' }}
                >
                  <option value="">—</option>
                  <option value="כן">כן</option>
                  <option value="לא">לא</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={row.userRole}
                  placeholder="תפקיד..."
                  onChange={(e) => handleRoleChange(row.id, e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </CTToolWrapper>
  );
}
