import React from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import { CT_SKILL_CONFIG } from '../../core/constants/ctSkills';
import ProgressBar from '../layout/ProgressBar';
import LearningScreen from '../layout/LearningScreen';
import DifficultyPrompt from '../difficulty/DifficultyPrompt';

export default function DifficultyScreen() {
  const { session } = useSessionContext();
  const { goToAnalog } = usePhaseNavigation();

  const skillConfig = session.detectedDifficulty
    ? CT_SKILL_CONFIG[session.detectedDifficulty.skill]
    : null;

  return (
    <LearningScreen className="difficulty-screen">
      <ProgressBar />
      <DifficultyPrompt
        message={skillConfig?.difficultyMessage}
        onStart={goToAnalog}
      />
    </LearningScreen>
  );
}
