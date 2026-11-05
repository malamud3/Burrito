import React from 'react';
import { MAIN_PROBLEM } from '../../core/constants/problems';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import ProblemBox from '../problem/ProblemBox';
import ProgressBar from '../layout/ProgressBar';

export default function ProblemScreen() {
  const { goToSolving } = usePhaseNavigation();

  return (
    <div className="container learning-screen problem-screen">
      <ProgressBar />

      <ProblemBox
        label={MAIN_PROBLEM.label}
        text={MAIN_PROBLEM.text}
        question={MAIN_PROBLEM.question}
      />

      <div className="card">
        <h2>📋 קרא/י את הבעיה בעיון</h2>
        <p>
          לפני שתתחיל/י לפתור, קרא/י את הבעיה בעיון. כשתהיה/י מוכן/ה, לחץ/י על
          הכפתור.
        </p>
        <div className="btn-group" style={{ justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={goToSolving}>
            מוכן/ה להתחיל לפתור
          </button>
        </div>
      </div>
    </div>
  );
}
