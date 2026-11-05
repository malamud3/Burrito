import React, { useCallback } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useNotification } from '../../context/NotificationContext';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import { useHintEscalation } from '../../hooks/useHintEscalation';
import { useLogger } from '../../hooks/useLogger';
import { LogActionType } from '../../core/types/enums';
import { MAIN_PROBLEM } from '../../core/constants/problems';
import ProblemBox from '../problem/ProblemBox';
import BridgingHints from '../hints/BridgingHints';
import ProgressBar from '../layout/ProgressBar';

export default function ReturnScreen() {
  const { session, setAnswer } = useSessionContext();
  const { goToTransfer } = usePhaseNavigation();
  const { canEscalate, escalate } = useHintEscalation();
  const { log } = useLogger();
  const { show } = useNotification();

  const handleSubmit = useCallback(() => {
    if (!session.answers.corrected?.trim()) {
      return show('נא לכתוב תשובה מתוקנת', '⚠️');
    }

    log(LogActionType.CORRECTION_SUBMIT, {
      originalAnswer: session.answers.main,
      correctedAnswer: session.answers.corrected,
      explanation: session.answers.correctionExplanation,
      hintLevelUsed: session.maxHintReached,
    });

    show('תשובה מתוקנת נשלחה! ממשיכים למשימה הבאה.', '✅');
    goToTransfer();
    return undefined;
  }, [session.answers, session.maxHintReached, log, goToTransfer, show]);

  const handleEscalate = useCallback(() => {
    if (!canEscalate) {
      show('אין רמזים נוספים. נסה/י להשתמש ברמזים שכבר קיבלת.', 'ℹ️');
      return;
    }
    const level = escalate();
    show(`רמז ברמה ${level} הוצג`, '💡');
  }, [canEscalate, escalate, show]);

  return (
    <div className="container learning-screen return-screen">
      <ProgressBar />

      <div className="card" style={{ textAlign: 'center', padding: 24 }}>
        <h2>🔁 חזרה לבעיה המקורית</h2>
        <p>נסה/י עכשיו לתקן או לשפר את הפתרון שלך.</p>
      </div>

      <ProblemBox
        label="הבעיה המקורית"
        text={MAIN_PROBLEM.text}
        question={MAIN_PROBLEM.question}
      />

      <div className="card">
        <h3>📝 התשובה הקודמת שלך</h3>
        <div
          style={{
            background: 'var(--surface3)',
            padding: 16,
            borderRadius: 'var(--radius-sm)',
            marginTop: 8,
            color: 'var(--text2)',
            fontStyle: 'italic',
            whiteSpace: 'pre-line',
          }}
        >
          {session.answers.main || '(לא הוזנה תשובה)'}
        </div>
      </div>

      <BridgingHints />

      <div className="card card-accent">
        <h2>✍️ התשובה המתוקנת</h2>
        <div className="field">
          <label>כתוב/י את הפתרון המעודכן</label>
          <textarea
            value={session.answers.corrected}
            onChange={(e) => setAnswer('corrected', e.target.value)}
            rows={4}
            placeholder="הפתרון המתוקן שלי..."
          />
        </div>
        <div className="field">
          <label>מה שינית ולמה?</label>
          <textarea
            value={session.answers.correctionExplanation}
            onChange={(e) => setAnswer('correctionExplanation', e.target.value)}
            rows={2}
            placeholder="שיניתי את... כי..."
          />
        </div>
        <div className="btn-group">
          <button className="btn btn-primary" onClick={handleSubmit}>
            שלח/י תשובה מתוקנת
          </button>
          <button
            className="btn btn-outline"
            onClick={handleEscalate}
            disabled={!canEscalate}
          >
            💡 אני צריך/ה רמז נוסף
          </button>
        </div>
      </div>
    </div>
  );
}
