// ============================================================
// src/app/screenRegistry.js
// Open/Closed: add a screen by registering it — App.jsx never changes.
// ============================================================

import { Phase } from '../core/types/enums';
import LoginScreen from '../components/screens/LoginScreen';
import ProblemScreen from '../components/screens/ProblemScreen';
import SolvingScreen from '../components/screens/SolvingScreen';
import DifficultyScreen from '../components/screens/DifficultyScreen';
import AnalogScreen from '../components/screens/AnalogScreen';
import ReturnScreen from '../components/screens/ReturnScreen';
import TransferScreen from '../components/screens/TransferScreen';
import EffortScreen from '../components/screens/EffortScreen';
import CompletionScreen from '../components/screens/CompletionScreen';
import ResearcherDashboard from '../components/screens/ResearcherDashboard';

export const SCREEN_REGISTRY = {
  [Phase.LOGIN]: LoginScreen,
  [Phase.PROBLEM]: ProblemScreen,
  [Phase.SOLVING]: SolvingScreen,
  [Phase.DIFFICULTY]: DifficultyScreen,
  [Phase.ANALOG]: AnalogScreen,
  [Phase.RETURN]: ReturnScreen,
  [Phase.TRANSFER]: TransferScreen,
  [Phase.EFFORT]: EffortScreen,
  [Phase.COMPLETION]: CompletionScreen,
  [Phase.DASHBOARD]: ResearcherDashboard,
};
