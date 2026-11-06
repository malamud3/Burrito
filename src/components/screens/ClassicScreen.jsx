import React from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import { useLogger } from '../../hooks/useLogger';
import { LogActionType, Phase } from '../../core/types/enums';
import { RENATO_FUNCTION } from '../../core/constants/renato';
import { STUDY_DURATION_MINUTES, STUDY_HINTS } from '../../core/constants/study';
import { PROCESS_TASKS } from '../../core/constants/processTasks';
import {
  FUNCTION_STUDY_QUESTIONS,
  FUNCTION_STUDY_STEPS,
} from '../../core/constants/functionStudy';
import { useNotification } from '../../context/NotificationContext';
import { getStepStatus } from './FunctionStudyStep';
import ClassicLearningView from '../classic/ClassicLearningView';

const CLASSIC_LEARNING_PHASES = [
  Phase.CLASSIC,
  Phase.CLASSIC_EXTREMA,
  Phase.CLASSIC_ASYMPTOTES,
  Phase.CLASSIC_INTERCEPTS,
  Phase.CLASSIC_GRAPH,
];

export default function ClassicScreen({ phase = Phase.CLASSIC } = {}) {
  const { session, updateClassicWork, updateGraphWork, updateStudyPrompt } = useSessionContext();
  const { goTo, goToTransferAssessment } = usePhaseNavigation();
  const { log } = useLogger();
  const { show } = useNotification();
  const graphWork = session.graphWork;
  const currentStep = CLASSIC_LEARNING_PHASES.indexOf(phase);
  const step = FUNCTION_STUDY_STEPS[currentStep];

  const stepStatuses = FUNCTION_STUDY_STEPS.map((item) => {
    const values = item.questionKeys.map((key) => session.classicWork[key]);
    if (PROCESS_TASKS[item.id]) values.push(session.studyPrompts[item.id]);
    if (item.graph) values.push(graphWork.graphStrokes.length ? 'drawn' : '');
    return getStepStatus(values);
  });

  const navigateStep = (nextStep) => {
    if (nextStep === currentStep) return;
    if (nextStep > currentStep) {
      const missingStep = FUNCTION_STUDY_STEPS
        .slice(0, nextStep)
        .find(({ id }) => PROCESS_TASKS[id] && !session.studyPrompts[id].trim());
      if (missingStep) {
        show(`יש להשלים את משימת העיבוד בשלב "${missingStep.title}" לפני המעבר.`, '⚠️');
        return;
      }
    }
    goTo(CLASSIC_LEARNING_PHASES[nextStep]);
  };

  const handleChange = (key, value) => {
    updateClassicWork({ [key]: value });
    log(LogActionType.EDIT, { field: `classic.${key}`, value });
  };

  const handleGraphUpdate = (patch) => {
    updateGraphWork(patch);
    log(LogActionType.EDIT, { field: 'classic.graph', ...patch });
  };

  const handleProcessTaskChange = (stepId, value) => {
    updateStudyPrompt(stepId, value);
    log(LogActionType.EDIT, { field: `studyPrompts.${stepId}`, value });
  };

  const handleFinish = () => {
    const missingStep = FUNCTION_STUDY_STEPS
      .find(({ id }) => PROCESS_TASKS[id] && !session.studyPrompts[id].trim());
    if (missingStep) {
      show(`יש להשלים את משימת העיבוד בשלב "${missingStep.title}" לפני הסיום.`, '⚠️');
      return;
    }
    if (!graphWork.graphStrokes.length) {
      show('לפני הסיום, יש לשרטט את הפונקציה על מערכת הצירים.', '⚠️');
      return;
    }

    log(LogActionType.ACTIVITY_COMPLETE, {
      schemaVersion: 1,
      assessment: {
        domain: session.classicWork.domain,
        derivative: session.classicWork.derivative,
        criticalPoints: session.classicWork.criticalPoints,
        extremaPoints: session.classicWork.extremaPoints,
        verticalAsymptotes: session.classicWork.verticalAsymptotes,
        horizontalAsymptote: session.classicWork.horizontalAsymptote,
        yAxisIntercept: session.classicWork.yAxisIntercept,
        xAxisIntercept: session.classicWork.xAxisIntercept,
        signBehavior: session.classicWork.signBehavior,
        graph: graphWork,
        processResponses: session.studyPrompts,
      },
      work: {
        ...session.classicWork,
        studyPrompts: session.studyPrompts,
        graph: graphWork,
      },
    });
    goToTransferAssessment();
  };

  const fields = step.questionKeys.map((key) => ({
    id: `classic-${key}`,
    ...FUNCTION_STUDY_QUESTIONS[key],
    value: session.classicWork[key],
    onChange: (value) => handleChange(key, value),
  }));
  const processTask = PROCESS_TASKS[step.id]
    ? {
      id: `classic-process-${step.id}`,
      prompt: PROCESS_TASKS[step.id].control,
      value: session.studyPrompts[step.id],
      onChange: (value) => handleProcessTaskChange(step.id, value),
    }
    : null;
  const previousStep = currentStep > 0 ? currentStep - 1 : null;
  const nextStep = currentStep < FUNCTION_STUDY_STEPS.length - 1
    ? currentStep + 1
    : null;

  return (
    <ClassicLearningView
      studyDurationMinutes={STUDY_DURATION_MINUTES}
      renatoFunction={RENATO_FUNCTION}
      steps={FUNCTION_STUDY_STEPS}
      currentStep={currentStep}
      statuses={stepStatuses}
      step={step}
      fields={fields}
      hints={step.hintKey ? STUDY_HINTS[step.hintKey] : null}
      processTask={processTask}
      graphWork={graphWork}
      previousStep={previousStep}
      nextStep={nextStep}
      onSelectStep={navigateStep}
      onGraphUpdate={handleGraphUpdate}
      onHintReveal={(hintIndex) => log(LogActionType.HINT_REQUEST, {
        phase: 'function_analysis',
        stepId: step.id,
        hintIndex,
        totalHints: STUDY_HINTS[step.hintKey].length,
      })}
      onNavigateStep={navigateStep}
      onFinish={handleFinish}
    />
  );
}

export function ClassicExtremaScreen() {
  return <ClassicScreen phase={Phase.CLASSIC_EXTREMA} />;
}

export function ClassicAsymptotesScreen() {
  return <ClassicScreen phase={Phase.CLASSIC_ASYMPTOTES} />;
}

export function ClassicInterceptsScreen() {
  return <ClassicScreen phase={Phase.CLASSIC_INTERCEPTS} />;
}

export function ClassicGraphScreen() {
  return <ClassicScreen phase={Phase.CLASSIC_GRAPH} />;
}
