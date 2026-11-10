import { describe, expect, test } from 'vitest';
import { SCREEN_REGISTRY } from '../src/app/screenRegistry';
import { getPhaseFromPath, PHASE_PATHS } from '../src/core/constants/routes';
import { getNextPhase } from '../src/coordinator/phaseCoordinator';
import { getPhaseRedirect } from '../src/app/routeGuards';
import { LogActionType, Mode, Phase } from '../src/core/types/enums';

const session = {
  isActive: true,
  mode: Mode.STUDENT,
  activityPath: 'renato',
  learningStartedAt: 1000,
  learningEndedAt: 2000,
};

describe('single Renato routing', () => {
  test('every registered screen has a unique, reversible route', () => {
    const entries = Object.entries(SCREEN_REGISTRY);
    const paths = entries.map(([phase]) => PHASE_PATHS[phase]);

    expect(paths.every(Boolean)).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
    entries.forEach(([phase]) => {
      expect(getPhaseFromPath(PHASE_PATHS[phase])).toBe(phase);
    });
  });

  test('advances through the Renato learning route', () => {
    expect(getNextPhase(Phase.LOGIN)).toBe(Phase.PRE_ASSESSMENT);
    expect(getNextPhase(Phase.PRE_ASSESSMENT)).toBe(Phase.RENATO);
    expect(getNextPhase(Phase.RENATO)).toBe(Phase.RENATO_EXTREMA);
    expect(getNextPhase(Phase.RENATO_GRAPH)).toBe(Phase.TRANSFER_EXAM);
    expect(getNextPhase(Phase.TRANSFER_EXAM)).toBe(Phase.COMPLETION);
  });

  test('allows transfer after learning completion and blocks submitted transfer', () => {
    expect(getPhaseRedirect({
      phase: Phase.TRANSFER_EXAM,
      session,
      logs: [],
      now: 3000,
    })).toBeNull();

    expect(getPhaseRedirect({
      phase: Phase.TRANSFER_EXAM,
      session: { ...session, sessionId: 'session-1' },
      logs: [{
        actionType: LogActionType.TRANSFER_SUBMIT,
        data: { sessionId: 'session-1', assessment: {} },
      }],
    })).toBe(PHASE_PATHS[Phase.COMPLETION]);
  });

  test('redirects students away from the researcher dashboard', () => {
    expect(getPhaseRedirect({
      phase: Phase.DASHBOARD,
      session,
      logs: [],
    })).toBe(PHASE_PATHS[Phase.COMPLETION]);
  });
});
