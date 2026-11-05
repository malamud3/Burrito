import React, { useCallback } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useNotification } from '../../context/NotificationContext';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import { useLogger } from '../../hooks/useLogger';
import { LogActionType } from '../../core/types/enums';
import { TRANSFER_PROBLEM } from '../../core/constants/problems';
import ProblemBox from '../problem/ProblemBox';
import AnswerBox from '../problem/AnswerBox';
import ProgressBar from '../layout/ProgressBar';

const SUB_TOOLS = [
  { key: 'transferDecomp', title: '🧩 פירוק הבעיה', rows: 3, placeholder: 'שלב 1: ... שלב 2: ...' },
  { key: 'transferAbstract', title: '🔍 נתונים רלוונטיים', rows: 2, placeholder: 'הנתונים החשובים הם...' },
  { key: 'transferAlgo', title: '⚡ סדר הפעולות', rows: 3, placeholder: '1. הגדר פונקציה ל... 2. השווה... 3. פתור...' },
];

export default function TransferScreen() {
  const { session, setAnswer } = useSessionContext();
  const { goToEffort } = usePhaseNavigation();
  const { log } = useLogger();
  const { show } = useNotification();

  const handleSubmit = useCallback(() => {
    if (!session.answers.transfer?.trim()) return show('נא לכתוב תשובה', '⚠️');

    log(LogActionType.TRANSFER_SUBMIT, {
      answer: session.answers.transfer,
      decomp: session.answers.transferDecomp,
      abstract: session.answers.transferAbstract,
      algo: session.answers.transferAlgo,
    });

    show('תשובה נשלחה! שלב אחרון — דירוג מאמץ.', '✅');
    goToEffort();
    return undefined;
  }, [session.answers, log, goToEffort, show]);

  return (
    <div className="container">
      <ProgressBar />

      <div className="card" style={{ textAlign: 'center', padding: 24 }}>
        <h2>🚀 משימה חדשה</h2>
        <p style={{ color: 'var(--text2)' }}>
          הבעיה הבאה היא בעיה חדשה. נסה/י לפתור אותה באופן עצמאי, תוך שימוש בכל
          מה שלמדת.
        </p>
      </div>

      <ProblemBox
        label={TRANSFER_PROBLEM.label}
        labelColor="var(--accent2)"
        text={TRANSFER_PROBLEM.text}
        question={TRANSFER_PROBLEM.question}
      />

      {SUB_TOOLS.map(({ key, title, rows, placeholder }) => (
        <div className="ct-tool" key={key}>
          <div className="ct-tool-header">
            <div className="ct-tool-title">
              <span>{title}</span>
            </div>
          </div>
          <div className="field">
            <textarea
              value={session.answers[key]}
              onChange={(e) => setAnswer(key, e.target.value)}
              rows={rows}
              placeholder={placeholder}
            />
          </div>
        </div>
      ))}

      <AnswerBox
        title="✍️ הפתרון המלא"
        fieldLabel="הפתרון המלא"
        value={session.answers.transfer}
        onChange={(v) => setAnswer('transfer', v)}
        placeholder="כתוב/י את הפתרון המלא..."
      >
        <div className="btn-group" style={{ justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={handleSubmit}>
            שלח/י ועבור/י לדירוג מאמץ
          </button>
        </div>
      </AnswerBox>
    </div>
  );
}
