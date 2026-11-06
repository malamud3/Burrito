import { CTSkill } from '../../../core/types/enums';
import { abstractionRule } from './abstractionRule';
import { algorithmicRule } from './algorithmicRule';
import { decompositionRule } from './decompositionRule';

/** Default rules are kept in skill order; the first match wins. */
export const DEFAULT_DETECTION_RULES = Object.freeze({
  [CTSkill.DECOMPOSITION]: decompositionRule,
  [CTSkill.ABSTRACTION]: abstractionRule,
  [CTSkill.ALGORITHMIC]: algorithmicRule,
});
