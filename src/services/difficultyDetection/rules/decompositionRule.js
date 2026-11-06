import { CTSkill, LogActionType } from '../../../core/types/enums';
import { getTimeInTool } from '../../logUtils';
import { DIFFICULTY_THRESHOLDS } from '../thresholds';
import { countFilledValues } from '../progress';
import { countAction, getSkillLogs } from '../ruleUtils';

const thresholds = DIFFICULTY_THRESHOLDS.decomposition;

export const decompositionRule = {
  id: 'decomp-struggle',
  description: 'Struggle with problem decomposition',
  detect: (logs, toolState) => {
    const skillLogs = getSkillLogs(logs, CTSkill.DECOMPOSITION);
    const editCount = countAction(skillLogs, LogActionType.EDIT);
    const addRemove =
      countAction(skillLogs, LogActionType.STEP_ADD) +
      countAction(skillLogs, LogActionType.STEP_REMOVE);
    const timeInTool = getTimeInTool(skillLogs);
    const stepsWithContent = countFilledValues(toolState.decomposition?.steps);

    const isChurning =
      addRemove > thresholds.churningActions &&
      stepsWithContent <= thresholds.maxLowProgress;
    const isStalled =
      timeInTool > thresholds.stalledSeconds && stepsWithContent === 0;
    const isRestarting =
      editCount > thresholds.restartingEdits &&
      stepsWithContent <= thresholds.maxLowProgress;

    return isChurning || isStalled || isRestarting;
  },
};
