import React, { useCallback, useEffect, useRef } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useNotification } from '../../context/NotificationContext';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import { useLogger } from '../../hooks/useLogger';
import { useDifficultyDetector } from '../../hooks/useDifficultyDetector';
import { useToolStatuses } from '../../hooks/useToolStatuses';
import { LogActionType } from '../../core/types/enums';
import { MAIN_PROBLEM } from '../../core/constants/problems';
import DecompositionTool from '../ct-tools/DecompositionTool';
import AbstractionTool from '../ct-tools/AbstractionTool';
import AlgorithmTool from '../ct-tools/AlgorithmTool';
import ProblemReminder from '../problem/ProblemReminder';
import AnswerBox from '../problem/AnswerBox';
import ProgressBar from '../layout/ProgressBar';
import LearningScreen from '../layout/LearningScreen';
import SolvingActions from '../solving/SolvingActions';
import { CTSkill } from '../../core/types/enums';

export default function SolvingScreen() {
  const { session, setAnswer } = useSessionContext();
  const { goToDifficulty, goToTransfer } = usePhaseNavigation();
  const { log } = useLogger();
  const { runDetection, forceDetection } = useDifficultyDetector();
  const { show } = useNotification();
  const statuses = useToolStatuses(session.detectedDifficulty?.skill ?? null);
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const delayedGoToDifficulty = useCallback(
    (ms) => {
      timeoutRef.current = setTimeout(goToDifficulty, ms);
    },
    [goToDifficulty],
  );

  const handleAnswerChange = useCallback(
    (value) => {
      setAnswer('main', value);
      log(LogActionType.EDIT, { field: 'mainAnswer', value });
    },
    [setAnswer, log],
  );

  const handleSubmit = useCallback(() => {
    const answer = session.answers.main.trim();
    if (!answer) return show('נא לכתוב תשובה לפני השליחה', '⚠️');

    log(LogActionType.ANSWER_SUBMIT, { answer });

    const detection = runDetection();
    if (detection.detected) {
      show('המערכת זיהתה נקודה שכדאי לחזק', '🔎');
      delayedGoToDifficulty(1500);
    } else {
      show('תשובה נשלחה! ממשיכים למשימת ההעברה.', '✅');
      goToTransfer();
    }
    return undefined;
  }, [session.answers.main, log, runDetection, delayedGoToDifficulty, goToTransfer, show]);

  const handleHelpRequest = useCallback(() => {
    log(LogActionType.HINT_REQUEST, { phase: 'solving' });
    forceDetection();
    show('בוא/י ננסה משימה שתעזור לך', '💡');
    delayedGoToDifficulty(1000);
  }, [log, forceDetection, delayedGoToDifficulty, show]);

  return (
    <LearningScreen className="solving-screen">
      <ProgressBar />
      <ProblemReminder
        problemText={`${MAIN_PROBLEM.text}\n\n${MAIN_PROBLEM.question}`}
      />
      <DecompositionTool status={statuses[CTSkill.DECOMPOSITION]} />
      <AbstractionTool status={statuses[CTSkill.ABSTRACTION]} />
      <AlgorithmTool status={statuses[CTSkill.ALGORITHMIC]} />
      <AnswerBox value={session.answers.main} onChange={handleAnswerChange}>
        <SolvingActions onSubmit={handleSubmit} onHelp={handleHelpRequest} />
      </AnswerBox>
    </LearningScreen>
  );
}
