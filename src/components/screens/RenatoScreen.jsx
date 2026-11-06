import React from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { LogActionType, Phase } from '../../core/types/enums';
import { RENATO_FUNCTION } from '../../core/constants/renato';
import { STUDY_DURATION_MINUTES, STUDY_HINTS } from '../../core/constants/study';
import { PROCESS_TASKS } from '../../core/constants/processTasks';
import {
  FUNCTION_STUDY_QUESTIONS,
  FUNCTION_STUDY_STEPS,
} from '../../core/constants/functionStudy';
import { useLogger } from '../../hooks/useLogger';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import { useNotification } from '../../context/NotificationContext';
import FunctionFraction from '../math/FunctionFraction';
import FunctionGraph from '../math/FunctionGraph';
import FunctionStudyStep, {
  FunctionStudyNavigation,
  getStepStatus,
} from './FunctionStudyStep';

const CARD_DEFINITIONS = [
  {
    id: 'domain',
    fields: [{ key: 'answer', questionKey: 'domain' }],
    notes: STUDY_HINTS.domain,
  },
  {
    id: 'extrema',
    fields: [
      { key: 'derivative', questionKey: 'derivative' },
      { key: 'suspectedX', questionKey: 'criticalPoints' },
      { key: 'points', questionKey: 'extremaPoints' },
    ],
    notes: STUDY_HINTS.extrema,
  },
  {
    id: 'asymptotes',
    fields: [
      { key: 'vertical', questionKey: 'verticalAsymptotes' },
      { key: 'horizontal', questionKey: 'horizontalAsymptote' },
    ],
    notes: STUDY_HINTS.asymptotes,
  },
  {
    id: 'intercepts',
    fields: [
      { key: 'yAxis', questionKey: 'yAxisIntercept' },
      { key: 'xAxis', questionKey: 'xAxisIntercept' },
    ],
    notes: STUDY_HINTS.intercepts,
  },
];

const RENATO_LEARNING_PHASES = [
  Phase.RENATO,
  Phase.RENATO_EXTREMA,
  Phase.RENATO_ASYMPTOTES,
  Phase.RENATO_INTERCEPTS,
  Phase.RENATO_GRAPH,
];

export default function RenatoScreen({ step = Phase.RENATO } = {}) {
  const {
    session,
    updateRenatoWork,
    updateGraphWork,
    updateStudyPrompt,
  } = useSessionContext();
  const { log } = useLogger();
  const { goTo, goToTransferAssessment } = usePhaseNavigation();
  const { show } = useNotification();
  const work = session.renatoWork;
  const graphWork = session.graphWork;
  const currentStep = RENATO_LEARNING_PHASES.indexOf(step);
  const isGraphStep = step === Phase.RENATO_GRAPH;
  const currentStepDefinition = FUNCTION_STUDY_STEPS[currentStep];
  const currentCard = CARD_DEFINITIONS[currentStep];

  const stepStatuses = FUNCTION_STUDY_STEPS.map((_, index) => {
    if (index === FUNCTION_STUDY_STEPS.length - 1) {
      return getStepStatus([
        work.signBehavior,
        graphWork.graphStrokes.length ? 'drawn' : '',
      ]);
    }
    const definition = CARD_DEFINITIONS[index];
    const values = definition.fields.map(({ key }) => work.cards[definition.id][key]);
    values.push(session.studyPrompts[definition.id]);
    return getStepStatus(values);
  });

  const updateCard = (cardId, field, value) => {
    updateRenatoWork({
      cards: {
        ...work.cards,
        [cardId]: { ...work.cards[cardId], [field]: value },
      },
    });
    log(LogActionType.EDIT, { field: `renato.${cardId}.${field}`, value });
  };

  const updateSignBehavior = (value) => {
    updateRenatoWork({ signBehavior: value });
    log(LogActionType.EDIT, { field: 'renato.signBehavior', value });
  };

  const updateProcessTask = (stepId, value) => {
    updateStudyPrompt(stepId, value);
    log(LogActionType.EDIT, { field: `studyPrompts.${stepId}`, value });
  };

  const updateGraph = (patch) => {
    updateGraphWork(patch);
    updateRenatoWork(patch);
    log(LogActionType.EDIT, {
      field: 'renato.graph',
      ...patch,
    });
  };

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
    goTo(RENATO_LEARNING_PHASES[nextStep]);
  };

  const handleFinish = () => {
    const missingStep = FUNCTION_STUDY_STEPS
      .find(({ id }) => PROCESS_TASKS[id] && !session.studyPrompts[id].trim());
    if (missingStep) {
      show(`יש להשלים את משימת העיבוד בשלב "${missingStep.title}" לפני הסיום.`, '⚠️');
      return;
    }
    if (!graphWork.graphStrokes?.length) {
      show('לפני הסיום, יש לשרטט את הפונקציה על מערכת הצירים.', '⚠️');
      return;
    }

    log(LogActionType.ANSWER_SUBMIT, {
      answerType: 'function_graph',
      strokeCount: graphWork.graphStrokes.length,
    });
    log(LogActionType.ACTIVITY_COMPLETE, {
      schemaVersion: 1,
      assessment: {
        domain: work.cards.domain.answer,
        derivative: work.cards.extrema.derivative,
        criticalPoints: work.cards.extrema.suspectedX,
        extremaPoints: work.cards.extrema.points,
        verticalAsymptotes: work.cards.asymptotes.vertical,
        horizontalAsymptote: work.cards.asymptotes.horizontal,
        yAxisIntercept: work.cards.intercepts.yAxis,
        xAxisIntercept: work.cards.intercepts.xAxis,
        signBehavior: work.signBehavior,
        graph: { ...graphWork },
        processResponses: session.studyPrompts,
      },
      work: {
        ...work,
        studyPrompts: session.studyPrompts,
        graph: graphWork,
      },
    });
    goToTransferAssessment();
  };

  const fields = isGraphStep
    ? [{
      id: 'renato-signBehavior',
      ...FUNCTION_STUDY_QUESTIONS.signBehavior,
      value: work.signBehavior,
      onChange: updateSignBehavior,
    }]
    : currentCard.fields.map(({ key, questionKey }) => ({
      id: `renato-${questionKey}`,
      ...FUNCTION_STUDY_QUESTIONS[questionKey],
      value: work.cards[currentCard.id][key],
      onChange: (value) => updateCard(currentCard.id, key, value),
    }));
  const processTask = PROCESS_TASKS[currentStepDefinition.id]
    ? {
      id: `renato-process-${currentStepDefinition.id}`,
      prompt: PROCESS_TASKS[currentStepDefinition.id].ct,
      value: session.studyPrompts[currentStepDefinition.id],
      onChange: (value) => updateProcessTask(currentStepDefinition.id, value),
    }
    : null;

  const previousStep = currentStep > 0 ? currentStep - 1 : null;
  const nextStep = currentStep < RENATO_LEARNING_PHASES.length - 1
    ? currentStep + 1
    : null;

  return (
    <div className="container-wide learning-screen renato-screen" dir="rtl">
      <header className="renato-title">
        <span className="renato-eyebrow">מסלול רנאטו סאיג</span>
        <h1>כלי עזר לחקירת פונקציות</h1>
      </header>
      <p className="study-protocol-note">
        לרשותכם {STUDY_DURATION_MINUTES} דקות, דף טיוטה וכלי שרטוט דיגיטלי זהה לזה שבמסלול הקלאסי.
        ניתן לבקש מהמנחה הבהרה טכנית בלבד, ללא רמזים מתמטיים.
      </p>

      <section className="renato-function" aria-label="הפונקציה הנחקרת">
        <span className="renato-function-label">הפונקציה הנחקרת</span>
        <FunctionFraction
          numerator="x²"
          denominator="x² − 4x + 3"
          ariaLabel={`f(x) = ${RENATO_FUNCTION}`}
          className="renato-function-expression"
        />
      </section>

      <FunctionStudyNavigation
        steps={FUNCTION_STUDY_STEPS}
        currentStep={currentStep}
        statuses={stepStatuses}
        onSelect={navigateStep}
      />

      <section className="renato-single-step" aria-label={currentStepDefinition.title}>
        <p className="renato-cards-intro">
          אפשר לפתור לבד, לפתוח רמז לפי הצורך, ולהמשיך בכל שלב גם אם התשובה עדיין לא הושלמה.
        </p>
        <FunctionStudyStep
          id={currentStepDefinition.id}
          title={currentStepDefinition.title}
          fields={fields}
          processTask={processTask}
          hints={currentStepDefinition.hintKey
            ? STUDY_HINTS[currentStepDefinition.hintKey]
            : null}
          onHintReveal={(hintIndex) => log(LogActionType.HINT_REQUEST, {
            phase: 'function_analysis',
            stepId: currentStepDefinition.id,
            hintIndex,
            totalHints: currentCard.notes.length,
          })}
        />
        {isGraphStep && (
          <section className="card" aria-label="שרטוט משותף לשני המסלולים">
            <FunctionGraph work={graphWork} onUpdate={updateGraph} />
          </section>
        )}
      </section>

      <div className="renato-step-actions">
        {previousStep !== null ? (
          <button className="btn btn-outline" onClick={() => navigateStep(previousStep)}>
            ← חזרה
          </button>
        ) : <span />}
        {nextStep !== null ? (
          <button className="btn btn-primary" onClick={() => navigateStep(nextStep)}>
            המשך/י לשלב הבא ←
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleFinish}>
            סיימתי את חקירת הפונקציה
          </button>
        )}
      </div>
    </div>
  );
}

export function RenatoAsymptotesScreen() {
  return <RenatoScreen step={Phase.RENATO_ASYMPTOTES} />;
}

export function RenatoInterceptsScreen() {
  return <RenatoScreen step={Phase.RENATO_INTERCEPTS} />;
}

export function RenatoExtremaScreen() {
  return <RenatoScreen step={Phase.RENATO_EXTREMA} />;
}

export function RenatoGraphScreen() {
  return <RenatoScreen step={Phase.RENATO_GRAPH} />;
}
