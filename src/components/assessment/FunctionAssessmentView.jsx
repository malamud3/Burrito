import React from 'react';
import ProgressBar from '../layout/ProgressBar';
import LearningScreen from '../layout/LearningScreen';
import ScreenTitle from '../layout/ScreenTitle';
import AssessmentIntroCard from './AssessmentIntroCard';
import AssessmentQuestionForm from './AssessmentQuestionForm';

export default function FunctionAssessmentView({
  eyebrow,
  title,
  description,
  assessmentFunction,
  functionAriaLabel,
  questions,
  answers,
  idPrefix,
  questionsAriaLabel,
  onChange,
  onSubmit,
  submitLabel,
}) {
  return (
    <LearningScreen wide className="transfer-assessment-screen" dir="rtl">
      <ProgressBar />
      <ScreenTitle eyebrow={eyebrow} title={title} />
      <AssessmentIntroCard
        description={description}
        assessmentFunction={assessmentFunction}
        ariaLabel={functionAriaLabel}
      />
      <AssessmentQuestionForm
        questions={questions}
        answers={answers}
        idPrefix={idPrefix}
        ariaLabel={questionsAriaLabel}
        onChange={onChange}
        onSubmit={onSubmit}
        submitLabel={submitLabel}
      />
    </LearningScreen>
  );
}
