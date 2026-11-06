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
import LearningScreen from '../layout/LearningScreen';
import ReturnIntroCard from '../returning/ReturnIntroCard';
import PreviousAnswerCard from '../returning/PreviousAnswerCard';
import CorrectionCard from '../returning/CorrectionCard';

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
    <LearningScreen className="return-screen">
      <ProgressBar />
      <ReturnIntroCard />
      <ProblemBox
        label="הבעיה המקורית"
        text={MAIN_PROBLEM.text}
        question={MAIN_PROBLEM.question}
      />
      <PreviousAnswerCard answer={session.answers.main} />
      <BridgingHints />
      <CorrectionCard
        corrected={session.answers.corrected}
        explanation={session.answers.correctionExplanation}
        onChange={setAnswer}
        onSubmit={handleSubmit}
        onEscalate={handleEscalate}
        canEscalate={canEscalate}
      />
    </LearningScreen>
  );
}
