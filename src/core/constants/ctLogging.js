import { CTSkill, LogActionType, Phase } from '../types/enums';

export const CT_LOG_SCHEMA_VERSION = 3;
export const CT_DATA_VERSION_KEY = 'ctAdapt.dataVersion';
export const CT_DATA_VERSION = 'single-renato-ct-v1';

const ACTION_TAGS = {
  [LogActionType.TOOL_INTERACTION]: [CTSkill.ALGORITHMIC],
  [LogActionType.HINT_REQUEST]: [CTSkill.SELF_REGULATION],
  [LogActionType.HINT_ESCALATION]: [CTSkill.SELF_REGULATION],
  [LogActionType.DIFFICULTY_DETECTED]: [CTSkill.DEBUGGING],
  [LogActionType.CORRECTION_SUBMIT]: [CTSkill.DEBUGGING],
  [LogActionType.ANALOG_START]: [CTSkill.ABSTRACTION, CTSkill.PATTERN_RECOGNITION],
  [LogActionType.ANALOG_COMPLETE]: [CTSkill.PATTERN_RECOGNITION],
};

const PHASE_TAGS = {
  [Phase.RENATO]: [CTSkill.DECOMPOSITION],
  [Phase.RENATO_EXTREMA]: [CTSkill.ALGORITHMIC],
  [Phase.RENATO_ASYMPTOTES]: [CTSkill.PATTERN_RECOGNITION, CTSkill.ABSTRACTION],
  [Phase.RENATO_INTERCEPTS]: [CTSkill.ALGORITHMIC],
  [Phase.RENATO_GRAPH]: [CTSkill.ABSTRACTION],
  [Phase.ANALOG]: [CTSkill.PATTERN_RECOGNITION, CTSkill.ABSTRACTION],
  [Phase.RETURN]: [CTSkill.DEBUGGING, CTSkill.SELF_REGULATION],
};

const unique = (values) => [...new Set(values.filter(Boolean))];

export function inferCognitiveTags(actionType, data = {}, skill = null) {
  const phaseTags = PHASE_TAGS[data.phase] || [];
  const actionTags = ACTION_TAGS[actionType] || [];
  const field = String(data.field || '');
  const fieldTags = field.includes('studyPrompts.domain')
    ? [CTSkill.DECOMPOSITION]
    : field.includes('studyPrompts.extrema')
      ? [CTSkill.ABSTRACTION]
      : field.includes('studyPrompts.asymptotes')
        ? [CTSkill.PATTERN_RECOGNITION]
        : field.includes('studyPrompts.intercepts')
          ? [CTSkill.ALGORITHMIC]
          : [];

  return unique([
    ...actionTags,
    ...phaseTags,
    ...fieldTags,
    skill,
  ]);
}
