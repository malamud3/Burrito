import React, { useCallback } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useNotification } from '../../context/NotificationContext';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import { useLogger } from '../../hooks/useLogger';
import { LogActionType } from '../../core/types/enums';
import ProblemBox from '../problem/ProblemBox';
import ProgressBar from '../layout/ProgressBar';

export default function AnalogScreen() {
  const { session, setAnswer } = useSessionContext();
  const { goToReturn, goToSolving } = usePhaseNavigation();
  const { log } = useLogger();
  const { show } = useNotification();

  const task = session.selectedAnalogTask;

  const handleSubmit = useCallback(() => {
    if (!session.answers.analogAnswer?.trim()) {
      return show('נא לכתוב תשובה לפני המשך', '⚠️');
    }

    log(LogActionType.ANALOG_COMPLETE, {
      taskId: task?.id,
      answers: {
        decomp: session.answers.analogDecomp,
        abstract: session.answers.analogAbstract,
        answer: session.answers.analogAnswer,
      },
    });

    show('מצוין! עכשיו נחזור לבעיה המקורית.', '✅');
    goToReturn();
    return undefined;
  }, [session.answers, task, log, goToReturn, show]);

  if (!task) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <p>שגיאה: לא נבחרה משימת תמיכה.</p>
          <div className="btn-group" style={{ justifyContent: 'center', marginTop: 16 }}>
            <button className="btn btn-outline" onClick={goToSolving}>
              חזרה לפתרון
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <ProgressBar />

      <div className="analog-banner">
        <h3>🔄 משימת תמיכה</h3>
        <p style={{ color: 'var(--text2)' }}>
          הבעיה הבאה בהקשר אחר. נסה/י לפתור אותה — היא עשויה לעזור לך אחר כך.
        </p>
      </div>

      <ProblemBox
        label={task.label}
        labelColor="var(--accent1)"
        text={task.text}
        question={task.question}
      />

      <div className="ct-tool">
        <div className="ct-tool-header">
          <div className="ct-tool-title">
            <span>🛠️ פתרון המשימה</span>
          </div>
        </div>

        <div className="field">
          <label>פרק/י את המשימה לשלבים</label>
          <textarea
            value={session.answers.analogDecomp}
            onChange={(e) => setAnswer('analogDecomp', e.target.value)}
            rows={3}
            placeholder="שלב 1: ... שלב 2: ..."
          />
        </div>

        <div className="field">
          <label>מה הנתונים החשובים?</label>
          <textarea
            value={session.answers.analogAbstract}
            onChange={(e) => setAnswer('analogAbstract', e.target.value)}
            rows={2}
            placeholder="הנתונים הרלוונטיים הם..."
          />
        </div>

        <div className="field">
          <label>הפתרון שלך</label>
          <textarea
            value={session.answers.analogAnswer}
            onChange={(e) => setAnswer('analogAnswer', e.target.value)}
            rows={3}
            placeholder="כתוב/י את הפתרון..."
          />
        </div>

        <div className="btn-group" style={{ justifyContent: 'center' }}>
          <button className="btn btn-success" onClick={handleSubmit}>
            סיימתי את המשימה — חזרה לבעיה ←
          </button>
        </div>
      </div>
    </div>
  );
}
