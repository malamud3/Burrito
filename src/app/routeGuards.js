// Compatibility facade. Routing decisions live in the coordinator library.
export {
  getRedirect as getPhaseRedirect,
  isLearningPhase,
} from '../coordinator/phaseCoordinator';
