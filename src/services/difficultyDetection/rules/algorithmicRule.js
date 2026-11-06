import { CTSkill, LogActionType } from '../../../core/types/enums';
import { getTimeInTool } from '../../logUtils';
import { DIFFICULTY_THRESHOLDS } from '../thresholds';
import { countFilledValues } from '../progress';
import { countAction, getSkillLogs } from '../ruleUtils';

const thresholds = DIFFICULTY_THRESHOLDS.algorithmic;

export const algorithmicRule = {
  id: 'algo-struggle',
  description: 'Struggle with building action sequence',
  detect: (logs, toolState) => {
    const skillLogs = getSkillLogs(logs, CTSkill.ALGORITHMIC);
    const editCount = countAction(skillLogs, LogActionType.EDIT);
    const filled = countFilledValues(toolState.algorithmic?.nodes);
    const timeInTool = getTimeInTool(skillLogs);

    const frequentEditsLowOutput =
      editCount > thresholds.frequentEdits &&
      filled <= thresholds.maxLowOutput;
    const stalledEmpty = timeInTool > thresholds.stalledSeconds && filled === 0;

    return frequentEditsLowOutput || stalledEmpty;
  },
};
