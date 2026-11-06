import { CTSkill } from '../../core/types/enums';

/** Count text-based tool items that contain a meaningful response. */
export function countFilledValues(items = []) {
  return items.filter(
    (item) => typeof item?.value === 'string' && item.value.trim().length > 0,
  ).length;
}

/** Count abstraction rows where the learner has made a relevance decision. */
export function countAnsweredRows(rows = []) {
  return rows.filter((row) => row.userRelevant !== undefined).length;
}

/** Return the visible progress for every computational-thinking skill. */
export function getSkillProgress(toolState = {}) {
  return {
    [CTSkill.DECOMPOSITION]: countFilledValues(toolState.decomposition?.steps),
    [CTSkill.ABSTRACTION]: countAnsweredRows(toolState.abstraction?.rows),
    [CTSkill.ALGORITHMIC]: countFilledValues(toolState.algorithmic?.nodes),
  };
}
