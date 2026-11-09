import { describe, expect, test } from 'vitest';
import { SCREEN_REGISTRY } from '../src/app/screenRegistry';
import { getPhaseFromPath, PHASE_PATHS } from '../src/core/constants/routes';
import { getNextPhase } from '../src/core/constants/phases';
import { getPhaseRedirect } from '../src/app/routeGuards';
import { ActivityPath, LogActionType, Mode, Phase } from '../src/core/types/enums';

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

  test('allows in-flow transfer navigation before learning end is persisted', () => {
    const session = {
      isActive: true,
      mode: Mode.STUDENT,
      activityPath: ActivityPath.CLASSIC,
      learningStartedAt: 1000,
      learningEndedAt: null,
    };

    expect(getPhaseRedirect({
      phase: Phase.TRANSFER_EXAM,
      session,
      logs: [],
      isTransferNavigation: true,
      now: 1001,
    })).toBeNull();
  });

  test('allows transfer assessment after learning completion is restored', () => {
    const session = {
      isActive: true,
      mode: Mode.STUDENT,
      activityPath: ActivityPath.CLASSIC,
      learningStartedAt: 1000,
      learningEndedAt: 2000,
    };

    expect(getPhaseRedirect({
      phase: Phase.TRANSFER_EXAM,
      session,
      logs: [],
      now: 3000,
    })).toBeNull();
  });

  test('redirects students away from the researcher dashboard', () => {
    expect(getPhaseRedirect({
      phase: Phase.DASHBOARD,
      session: {
        isActive: true,
        mode: Mode.STUDENT,
        activityPath: ActivityPath.CLASSIC,
      },
      logs: [],
    })).toBe(PHASE_PATHS[Phase.COMPLETION]);
  });

  test('does not reopen a submitted transfer assessment', () => {
    expect(getPhaseRedirect({
      phase: Phase.TRANSFER_EXAM,
      session: {
        isActive: true,
        mode: Mode.STUDENT,
        activityPath: ActivityPath.CLASSIC,
        learningStartedAt: 1000,
        learningEndedAt: 2000,
        sessionId: 'session-1',
      },
      logs: [{
        actionType: LogActionType.TRANSFER_SUBMIT,
        data: { sessionId: 'session-1', assessment: {} },
      }],
    })).toBe(PHASE_PATHS[Phase.COMPLETION]);
  });
});
