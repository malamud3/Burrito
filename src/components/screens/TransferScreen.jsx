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
import LearningScreen from '../layout/LearningScreen';
import ScreenActions from '../layout/ScreenActions';
import ActionButton from '../ui/ActionButton';
import TransferIntroCard from '../transfer/TransferIntroCard';
import TransferToolList from '../transfer/TransferToolList';

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
    <LearningScreen className="transfer-screen">
      <ProgressBar />
      <TransferIntroCard />
      <ProblemBox
        label={TRANSFER_PROBLEM.label}
        text={TRANSFER_PROBLEM.text}
        question={TRANSFER_PROBLEM.question}
      />
      <TransferToolList
        tools={SUB_TOOLS}
        answers={session.answers}
        onChange={setAnswer}
      />
      <AnswerBox
        title="✍️ הפתרון המלא"
        fieldLabel="הפתרון המלא"
        value={session.answers.transfer}
        onChange={(v) => setAnswer('transfer', v)}
        placeholder="כתוב/י את הפתרון המלא..."
      >
        <ScreenActions centered>
          <ActionButton onClick={handleSubmit}>
            שלח/י ועבור/י לדירוג מאמץ
          </ActionButton>
        </ScreenActions>
      </AnswerBox>
    </LearningScreen>
  );
}
