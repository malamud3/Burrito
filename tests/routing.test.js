import { describe, expect, test } from 'vitest';
import { SCREEN_REGISTRY } from '../src/app/screenRegistry';
import { getPhaseFromPath, PHASE_PATHS } from '../src/core/constants/routes';
import { getNextPhase } from '../src/core/constants/phases';
import { ActivityPath, Phase } from '../src/core/types/enums';

describe('routing configuration', () => {
  test('every registered screen has a unique, reversible route', () => {
    const entries = Object.entries(SCREEN_REGISTRY);
    const paths = entries.map(([phase]) => PHASE_PATHS[phase]);

    expect(paths.every(Boolean)).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
    entries.forEach(([phase]) => {
      expect(getPhaseFromPath(PHASE_PATHS[phase])).toBe(phase);
    });
  });

  test.each([
    [ActivityPath.CLASSIC, [
      Phase.CLASSIC,
      Phase.CLASSIC_EXTREMA,
      Phase.CLASSIC_ASYMPTOTES,
      Phase.CLASSIC_INTERCEPTS,
      Phase.CLASSIC_GRAPH,
    ]],
    [ActivityPath.RENATO, [
      Phase.RENATO,
      Phase.RENATO_EXTREMA,
      Phase.RENATO_ASYMPTOTES,
      Phase.RENATO_INTERCEPTS,
      Phase.RENATO_GRAPH,
    ]],
  ])('%s advances only through its own learning route', (activityPath, phases) => {
    expect(getNextPhase(Phase.LOGIN, activityPath)).toBe(Phase.PRE_ASSESSMENT);
    expect(getNextPhase(Phase.PRE_ASSESSMENT, activityPath)).toBe(phases[0]);
    phases.forEach((phase, index) => {
      expect(getNextPhase(phase, activityPath)).toBe(
        phases[index + 1] || Phase.TRANSFER_EXAM,
      );
    });
    expect(getNextPhase(Phase.TRANSFER_EXAM, activityPath)).toBe(Phase.COMPLETION);
  });

  test('does not guess a learning path before allocation', () => {
    expect(getNextPhase(Phase.PRE_ASSESSMENT, null)).toBeNull();
  });
});
