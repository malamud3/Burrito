import React, { useCallback } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useNotification } from '../../context/NotificationContext';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import EffortScale from '../effort/EffortScale';
import ProgressBar from '../layout/ProgressBar';
import LearningScreen from '../layout/LearningScreen';
import ScreenActions from '../layout/ScreenActions';
import ActionButton from '../ui/ActionButton';
import EffortIntroCard from '../effort/EffortIntroCard';

export default function EffortScreen() {
  const { session } = useSessionContext();
  const { goToCompletion } = usePhaseNavigation();
  const { show } = useNotification();

  const { effortRatings, selectedAnalogTask } = session;
  const needsAnalogRating = selectedAnalogTask !== null;

  const allComplete =
    effortRatings.main !== null &&
    effortRatings.transfer !== null &&
    (!needsAnalogRating || effortRatings.analog !== null);

  const handleComplete = useCallback(() => {
    if (!allComplete) return show('נא לדרג את המאמץ בכל המשימות', '⚠️');
    goToCompletion();
    return undefined;
  }, [allComplete, goToCompletion, show]);

  return (
    <LearningScreen className="effort-screen">
      <ProgressBar />
      <EffortIntroCard />

      <EffortScale taskKey="main" title="הבעיה המקורית" />
      {needsAnalogRating && (
        <EffortScale taskKey="analog" title="משימת התמיכה האנלוגית" />
      )}
      <EffortScale taskKey="transfer" title="משימת ההעברה" />

      <ScreenActions centered className="effort-actions">
        <ActionButton
          tone="success"
          onClick={handleComplete}
          disabled={!allComplete}
        >
          סיום ←
        </ActionButton>
      </ScreenActions>
    </LearningScreen>
  );
}
