import React from 'react';
import ProgressBar from '../layout/ProgressBar';
import LearningScreen from '../layout/LearningScreen';
import ScreenCard from '../layout/ScreenCard';
import ScreenActions from '../layout/ScreenActions';
import ActionButton from '../ui/ActionButton';
import CompletionSummary from './CompletionSummary';

export default function CompletionView({ rows, onDashboard, onExport, canAccessDashboard }) {
  return (
    <LearningScreen className="completion-screen">
      <ProgressBar />
      <ScreenCard className="completion-card">
        <div className="completion-icon">🎉</div>
        <h2>סיימת! תודה רבה!</h2>
        <p className="completion-message">
          כל הנתונים נשמרו בהצלחה.
          <br />
          הפעילות הושלמה.
        </p>
        <CompletionSummary rows={rows} />
        <ScreenActions centered className="completion-actions">
          {canAccessDashboard && (
            <ActionButton tone="outline" onClick={onDashboard}>
              📊 צפייה בנתונים (חוקר/ת)
            </ActionButton>
          )}
          <ActionButton tone="outline" onClick={onExport}>
            ⬇️ הורדת לוגים
          </ActionButton>
        </ScreenActions>
      </ScreenCard>
    </LearningScreen>
  );
}
