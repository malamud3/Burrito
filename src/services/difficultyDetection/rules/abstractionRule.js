import { CTSkill } from '../../../core/types/enums';
import { getTimeInTool } from '../../logUtils';
import { DIFFICULTY_THRESHOLDS } from '../thresholds';
import { getSkillLogs } from '../ruleUtils';

const thresholds = DIFFICULTY_THRESHOLDS.abstraction;

export const abstractionRule = {
  id: 'abstract-struggle',
  description: 'Struggle with identifying relevant data',
  detect: (logs, toolState) => {
    const skillLogs = getSkillLogs(logs, CTSkill.ABSTRACTION);
    const rows = toolState.abstraction?.rows || [];
    const incorrect = rows.filter(
      (row) =>
        row.userRelevant !== undefined &&
        row.userRelevant !== row.actualRelevant,
    ).length;
    const timeInTool = getTimeInTool(skillLogs);

    const manyErrors = incorrect >= thresholds.manyErrors;
    const stalledNoProgress =
      rows.length > 0 &&
      timeInTool > thresholds.stalledSeconds &&
      rows.every((row) => row.userRelevant === undefined);

    return manyErrors || stalledNoProgress;
  },
};
