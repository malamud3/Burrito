import { Phase } from '../core/types/enums';
import { PHASE_PATHS } from '../core/constants/routes';
import LoginScreen from '../components/screens/LoginScreen';
import PreAssessmentScreen from '../components/screens/PreAssessmentScreen';
import RenatoScreen, {
  RenatoAsymptotesScreen,
  RenatoExtremaScreen,
  RenatoGraphScreen,
  RenatoInterceptsScreen,
} from '../components/screens/RenatoScreen';
import TransferAssessmentScreen from '../components/screens/TransferAssessmentScreen';
import CompletionScreen from '../components/screens/CompletionScreen';
import ResearcherDashboard from '../components/screens/ResearcherDashboard';

export const APP_ROUTES = Object.freeze([
  { phase: Phase.LOGIN, path: PHASE_PATHS[Phase.LOGIN], Screen: LoginScreen },
  { phase: Phase.PRE_ASSESSMENT, path: PHASE_PATHS[Phase.PRE_ASSESSMENT], Screen: PreAssessmentScreen },
  { phase: Phase.RENATO, path: PHASE_PATHS[Phase.RENATO], Screen: RenatoScreen },
  { phase: Phase.RENATO_ASYMPTOTES, path: PHASE_PATHS[Phase.RENATO_ASYMPTOTES], Screen: RenatoAsymptotesScreen },
  { phase: Phase.RENATO_INTERCEPTS, path: PHASE_PATHS[Phase.RENATO_INTERCEPTS], Screen: RenatoInterceptsScreen },
  { phase: Phase.RENATO_EXTREMA, path: PHASE_PATHS[Phase.RENATO_EXTREMA], Screen: RenatoExtremaScreen },
  { phase: Phase.RENATO_GRAPH, path: PHASE_PATHS[Phase.RENATO_GRAPH], Screen: RenatoGraphScreen },
  { phase: Phase.TRANSFER_EXAM, path: PHASE_PATHS[Phase.TRANSFER_EXAM], Screen: TransferAssessmentScreen },
  { phase: Phase.COMPLETION, path: PHASE_PATHS[Phase.COMPLETION], Screen: CompletionScreen },
  { phase: Phase.DASHBOARD, path: PHASE_PATHS[Phase.DASHBOARD], Screen: ResearcherDashboard },
]);

export const LEGACY_REDIRECTS = Object.freeze([
  { path: '/renato', to: PHASE_PATHS[Phase.RENATO] },
]);

export const SCREEN_REGISTRY = Object.freeze(
  Object.fromEntries(APP_ROUTES.map(({ phase, Screen }) => [phase, Screen])),
);
