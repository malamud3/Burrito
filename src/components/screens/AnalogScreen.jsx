import React, { useCallback } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { useNotification } from '../../context/NotificationContext';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import { useLogger } from '../../hooks/useLogger';
import { LogActionType } from '../../core/types/enums';
import ProblemBox from '../problem/ProblemBox';
import ProgressBar from '../layout/ProgressBar';
import LearningScreen from '../layout/LearningScreen';
import AnalogMissingTask from '../analog/AnalogMissingTask';
import AnalogTaskBanner from '../analog/AnalogTaskBanner';
import AnalogWorkPanel from '../analog/AnalogWorkPanel';

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
      <LearningScreen className="analog-screen">
        <AnalogMissingTask onBack={goToSolving} />
      </LearningScreen>
    );
  }

  return (
    <LearningScreen className="analog-screen">
      <ProgressBar />
      <AnalogTaskBanner />
      <ProblemBox
        label={task.label}
        text={task.text}
        question={task.question}
      />
      <AnalogWorkPanel
        answers={session.answers}
        onAnswerChange={setAnswer}
        onSubmit={handleSubmit}
      />
    </LearningScreen>
  );
}
