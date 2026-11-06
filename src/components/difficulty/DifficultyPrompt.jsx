import React from 'react';
import ScreenCard from '../layout/ScreenCard';
import ScreenActions from '../layout/ScreenActions';
import ActionButton from '../ui/ActionButton';

export default function DifficultyPrompt({ message, onStart }) {
  return (
    <ScreenCard className="difficulty-card">
      <div className="difficulty-icon" aria-hidden="true">🔎</div>
      <h2>המערכת זיהתה נקודה שכדאי לחזק</h2>
      <p className="difficulty-message">
        {message || 'בוא/י ננסה משימה שתעזור לך להתקדם.'}
      </p>
      <p className="difficulty-supporting-text">
        לפני שנחזור לבעיה, בוא/י ננסה משימה קצרה שתעזור לך.
      </p>
      <ScreenActions centered className="difficulty-actions">
        <ActionButton onClick={onStart}>
          בוא/י נתחיל ←
        </ActionButton>
      </ScreenActions>
    </ScreenCard>
  );
}
