import { Phase } from '../types/enums';

export const PHASE_PATHS = Object.freeze({
  [Phase.LOGIN]: '/login',
  [Phase.PRE_ASSESSMENT]: '/pre-test',
  [Phase.CLASSIC]: '/activities/classic',
  [Phase.RENATO]: '/renato/domain',
  [Phase.RENATO_ASYMPTOTES]: '/renato/asymptotes',
  [Phase.RENATO_INTERCEPTS]: '/renato/intercepts',
  [Phase.RENATO_EXTREMA]: '/renato/extrema',
  [Phase.RENATO_GRAPH]: '/renato/graph',
  [Phase.TRANSFER_EXAM]: '/transfer-test',
  [Phase.COMPLETION]: '/complete',
  [Phase.DASHBOARD]: '/researcher',
});

export const PATH_PHASES = Object.freeze(
  Object.fromEntries(
    Object.entries(PHASE_PATHS).map(([phase, path]) => [path, phase]),
  ),
);

export function getPhaseFromPath(pathname) {
  return PATH_PHASES[pathname.replace(/\/+$/, '') || '/'] || null;
}
