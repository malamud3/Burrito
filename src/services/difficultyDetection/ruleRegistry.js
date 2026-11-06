import { DEFAULT_DETECTION_RULES } from './rules';

const detectionRules = new Map(Object.entries(DEFAULT_DETECTION_RULES));

export function getDetectionRules() {
  return Array.from(detectionRules.entries());
}

export function registerDetectionRule(skill, rule) {
  detectionRules.set(skill, rule);
}

export function getRegisteredRules() {
  return getDetectionRules().map(([skill, rule]) => ({
    skill,
    id: rule.id,
    description: rule.description,
  }));
}
