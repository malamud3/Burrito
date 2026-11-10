import { describe, expect, test } from 'vitest';
import {
  getNextPhase,
  getPathForPhase,
  getRedirect,
  isLearningPhase,
} from '../src/coordinator';
import { LogActionType, Mode, Phase } from '../src/core/types/enums';

const activeStudent = {
  isActive: true,
  mode: Mode.STUDENT,
  learningStartedAt: 1000,
  learningEndedAt: null,
  sessionId: 'session-1',
};

describe('phase coordinator', () => {
  test('owns the single Renato learning sequence', () => {
    expect(getNextPhase(Phase.PRE_ASSESSMENT)).toBe(Phase.RENATO);
    expect(getNextPhase(Phase.RENATO)).toBe(Phase.RENATO_EXTREMA);
    expect(getNextPhase(Phase.RENATO_GRAPH)).toBe(Phase.TRANSFER_EXAM);
    expect(isLearningPhase(Phase.RENATO_ASYMPTOTES)).toBe(true);
    expect(isLearningPhase(Phase.LOGIN)).toBe(false);
  });

  test('redirects an inactive session to login', () => {
    expect(getRedirect({
      phase: Phase.RENATO,
      session: { ...activeStudent, isActive: false },
    })).toBe(getPathForPhase(Phase.LOGIN));
  });

  test('allows an in-flow transfer route and blocks direct access', () => {
    expect(getRedirect({
      phase: Phase.TRANSFER_EXAM,
      session: { ...activeStudent, learningEndedAt: null },
      now: 1001,
      isTransferNavigation: true,
    })).toBeNull();
    expect(getRedirect({
      phase: Phase.TRANSFER_EXAM,
      session: { ...activeStudent, learningEndedAt: null },
      now: 1001,
    })).toBe(getPathForPhase(Phase.RENATO));
  });

  test('prevents reopening a submitted transfer test', () => {
    expect(getRedirect({
      phase: Phase.TRANSFER_EXAM,
      session: { ...activeStudent, learningEndedAt: 2000 },
      logs: [{
        actionType: LogActionType.TRANSFER_SUBMIT,
        data: { sessionId: 'session-1' },
      }],
    })).toBe(getPathForPhase(Phase.COMPLETION));
  });
});
