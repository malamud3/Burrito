import React, { useCallback } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useLogger } from '../../hooks/useLogger';
import { CTSkill, LogActionType } from '../../core/types/enums';
import { generateStepId } from '../../core/utils/idGenerator';
import CTToolWrapper from './CTToolWrapper';

export default function DecompositionTool({ status }) {
  const { session, updateDecompSteps } = useSessionContext();
  const { log } = useLogger();
  const steps = session.toolState.decomposition.steps;

  const handleStepChange = useCallback(
    (stepId, value) => {
      updateDecompSteps(steps.map((s) => (s.id === stepId ? { ...s, value } : s)));
      log(LogActionType.EDIT, { stepId, value }, CTSkill.DECOMPOSITION);
    },
    [steps, updateDecompSteps, log],
  );

  const addStep = useCallback(() => {
    const newStep = { id: generateStepId(), value: '' };
    const updated = [...steps, newStep];
    updateDecompSteps(updated);
    log(
      LogActionType.STEP_ADD,
      { stepId: newStep.id, totalSteps: updated.length },
      CTSkill.DECOMPOSITION,
    );
  }, [steps, updateDecompSteps, log]);

  const removeStep = useCallback(
    (stepId) => {
      if (steps.length <= 1) return;
      const updated = steps.filter((s) => s.id !== stepId);
      updateDecompSteps(updated);
      log(
        LogActionType.STEP_REMOVE,
        { stepId, totalSteps: updated.length },
        CTSkill.DECOMPOSITION,
      );
    },
    [steps, updateDecompSteps, log],
  );

  return (
    <CTToolWrapper skill={CTSkill.DECOMPOSITION} status={status}>
      <div className="step-list">
        {steps.map((step, index) => (
          <div className="step-item" key={step.id}>
            <div className="step-number">{index + 1}</div>
            <div className="step-input">
              <input
                type="text"
                value={step.value}
                placeholder={`שלב ${index + 1}...`}
                onChange={(e) => handleStepChange(step.id, e.target.value)}
              />
            </div>
            {steps.length > 1 && (
              <button
                className="remove-step"
                onClick={() => removeStep(step.id)}
                title="הסר שלב"
                aria-label={`הסר שלב ${index + 1}`}
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        className="btn btn-outline btn-sm"
        onClick={addStep}
        style={{ marginTop: 8 }}
      >
        + הוסף שלב
      </button>
    </CTToolWrapper>
  );
}
