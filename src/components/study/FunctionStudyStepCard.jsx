import React from 'react';
import StudyHint from '../math/StudyHint';
import FunctionStudyFields from './FunctionStudyFields';
import FunctionProcessTask from './FunctionProcessTask';

export default function FunctionStudyStepCard({
  id,
  title,
  fields,
  hints,
  onHintReveal,
  processTask,
}) {
  return (
    <article className={`renato-card renato-card-${id}`}>
      <header className="renato-card-heading">
        <div>
          <span className="renato-hint-label">שלב בחקירה</span>
          <h3>{title}</h3>
        </div>
      </header>
      <FunctionStudyFields fields={fields} />
      {processTask && <FunctionProcessTask task={processTask} />}
      {hints && <StudyHint hints={hints} onReveal={onHintReveal} />}
    </article>
  );
}
