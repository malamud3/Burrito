import React from 'react';
import ScreenCard from '../layout/ScreenCard';
import ScreenActions from '../layout/ScreenActions';
import ActionButton from '../ui/ActionButton';

export default function ProblemInstructionCard({ onStart }) {
  return (
    <ScreenCard className="problem-instruction-card">
      <h2>📋 קרא/י את הבעיה בעיון</h2>
      <p>
        לפני שתתחיל/י לפתור, קרא/י את הבעיה בעיון. כשתהיה/י מוכן/ה, לחץ/י על
        הכפתור.
      </p>
      <ScreenActions centered>
        <ActionButton onClick={onStart}>
          מוכן/ה להתחיל לפתור
        </ActionButton>
      </ScreenActions>
    </ScreenCard>
  );
}
