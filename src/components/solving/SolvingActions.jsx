import React from 'react';
import ScreenActions from '../layout/ScreenActions';
import ActionButton from '../ui/ActionButton';

export default function SolvingActions({ onSubmit, onHelp }) {
  return (
    <ScreenActions>
      <ActionButton onClick={onSubmit}>
        שלח/י תשובה
      </ActionButton>
      <ActionButton tone="outline" onClick={onHelp}>
        💡 אני צריך/ה עזרה
      </ActionButton>
    </ScreenActions>
  );
}
