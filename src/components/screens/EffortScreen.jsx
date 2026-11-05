import React, { useCallback } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useNotification } from '../../context/NotificationContext';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import EffortScale from '../effort/EffortScale';
import ProgressBar from '../layout/ProgressBar';

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
    <div className="container learning-screen effort-screen">
      <ProgressBar />

      <div className="card" style={{ textAlign: 'center', padding: 24 }}>
        <h2>📊 דירוג מאמץ מנטלי</h2>
        <p style={{ color: 'var(--text2)' }}>
          דרג/י את המאמץ שנדרש ממך בכל אחת מהמשימות (סולם Paas, 1–9).
        </p>
      </div>

      <EffortScale taskKey="main" title="הבעיה המקורית" />
      {needsAnalogRating && (
        <EffortScale taskKey="analog" title="משימת התמיכה האנלוגית" />
      )}
      <EffortScale taskKey="transfer" title="משימת ההעברה" />

      <div className="btn-group" style={{ justifyContent: 'center', marginTop: 20 }}>
        <button
          className="btn btn-success"
          onClick={handleComplete}
          disabled={!allComplete}
        >
          סיום ←
        </button>
      </div>
    </div>
  );
}
