import React from 'react';
import LearningScreen from '../layout/LearningScreen';
import ScreenTitle from '../layout/ScreenTitle';
import ScreenCard from '../layout/ScreenCard';
import ActionButton from '../ui/ActionButton';
import FunctionFraction from '../math/FunctionFraction';
import FunctionGraph from '../math/FunctionGraph';
import FunctionStudyStep, {
  FunctionStudyNavigation,
} from '../screens/FunctionStudyStep';

export default function ClassicLearningView({
  studyDurationMinutes,
  renatoFunction,
  steps,
  currentStep,
  statuses,
  step,
  fields,
  hints,
  processTask,
  graphWork,
  previousStep,
  nextStep,
  onSelectStep,
  onGraphUpdate,
  onHintReveal,
  onNavigateStep,
  onFinish,
}) {
  return (
    <LearningScreen wide className="renato-screen classic-screen" dir="rtl">
      <ScreenTitle eyebrow="מסלול קלאסי" title="חקירת פונקציה" />
      <p className="study-protocol-note">
        לרשותכם {studyDurationMinutes} דקות, דף טיוטה וכלי שרטוט דיגיטלי זהה לזה שבמסלול רנאטו.
        ניתן לבקש מהמנחה הבהרה טכנית בלבד, ללא רמזים מתמטיים.
      </p>

      <section className="renato-function" aria-label="הפונקציה הנחקרת">
        <span className="renato-function-label">הפונקציה הנחקרת</span>
        <FunctionFraction
          numerator="x²"
          denominator="x² − 4x + 3"
          ariaLabel={`f(x) = ${renatoFunction}`}
          functionName="f(x)"
          className="renato-function-expression"
        />
      </section>

      <FunctionStudyNavigation
        steps={steps}
        currentStep={currentStep}
        statuses={statuses}
        onSelect={onSelectStep}
      />

      <section className="renato-single-step" aria-label={step.title}>
        <p className="renato-cards-intro">
          אפשר לפתור לבד, לפתוח רמז לפי הצורך, ולהמשיך בכל שלב גם אם התשובה עדיין לא הושלמה.
        </p>
        <FunctionStudyStep
          id={step.id}
          title={step.title}
          fields={fields}
          hints={hints}
          processTask={processTask}
          onHintReveal={onHintReveal}
        />
        {step.graph && (
          <ScreenCard aria-label="שרטוט משותף לשני המסלולים">
            <FunctionGraph work={graphWork} onUpdate={onGraphUpdate} />
          </ScreenCard>
        )}
      </section>

      <div className="renato-step-actions">
        {previousStep !== null ? (
          <ActionButton tone="outline" onClick={() => onNavigateStep(previousStep)}>
            ← חזרה
          </ActionButton>
        ) : <span aria-hidden="true" />}
        {nextStep !== null ? (
          <ActionButton onClick={() => onNavigateStep(nextStep)}>
            המשך/י לשלב הבא ←
          </ActionButton>
        ) : (
          <ActionButton onClick={onFinish}>
            סיימתי את חקירת הפונקציה
          </ActionButton>
        )}
      </div>
    </LearningScreen>
  );
}
