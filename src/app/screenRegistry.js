// ============================================================
// src/app/screenRegistry.js
// Open/Closed: add a screen by registering it — App.jsx never changes.
// ============================================================

import { Phase } from '../core/types/enums';
import LoginScreen from '../components/screens/LoginScreen';
import RenatoScreen, {
  RenatoAsymptotesScreen,
  RenatoExtremaScreen,
  RenatoGraphScreen,
  RenatoInterceptsScreen,
} from '../components/screens/RenatoScreen';
import ClassicScreen from '../components/screens/ClassicScreen';
import TransferAssessmentScreen from '../components/screens/TransferAssessmentScreen';
import CompletionScreen from '../components/screens/CompletionScreen';
import ResearcherDashboard from '../components/screens/ResearcherDashboard';

export const SCREEN_REGISTRY = {
  [Phase.LOGIN]: LoginScreen,
  [Phase.CLASSIC]: ClassicScreen,
  [Phase.RENATO]: RenatoScreen,
  [Phase.RENATO_ASYMPTOTES]: RenatoAsymptotesScreen,
  [Phase.RENATO_INTERCEPTS]: RenatoInterceptsScreen,
  [Phase.RENATO_EXTREMA]: RenatoExtremaScreen,
  [Phase.RENATO_GRAPH]: RenatoGraphScreen,
  [Phase.TRANSFER_EXAM]: TransferAssessmentScreen,
  [Phase.COMPLETION]: CompletionScreen,
  [Phase.DASHBOARD]: ResearcherDashboard,
};
