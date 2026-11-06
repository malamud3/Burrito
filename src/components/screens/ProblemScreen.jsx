import React from 'react';
import { MAIN_PROBLEM } from '../../core/constants/problems';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import ProblemBox from '../problem/ProblemBox';
import ProgressBar from '../layout/ProgressBar';
import LearningScreen from '../layout/LearningScreen';
import ProblemInstructionCard from '../problem/ProblemInstructionCard';

export default function ProblemScreen() {
  const { goToSolving } = usePhaseNavigation();

  return (
    <LearningScreen className="problem-screen">
      <ProgressBar />
      <ProblemBox
        label={MAIN_PROBLEM.label}
        text={MAIN_PROBLEM.text}
        question={MAIN_PROBLEM.question}
      />
      <ProblemInstructionCard onStart={goToSolving} />
    </LearningScreen>
  );
}
