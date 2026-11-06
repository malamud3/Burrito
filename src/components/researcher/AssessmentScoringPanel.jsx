import React, { useEffect, useMemo, useState } from 'react';
import { FUNCTION_ASSESSMENT_QUESTIONS } from '../../core/constants/functionAssessments';
import {
  ASSESSMENT_RUBRIC_VERSION,
  ASSESSMENT_RUBRIC_CRITERIA,
  ASSESSMENT_SCORE_ANCHORS,
  ASSESSMENT_SCORE_MAX,
} from '../../core/constants/assessmentRubric';
import { ASSESSMENT_ANSWER_KEYS } from '../../core/constants/assessmentAnswerKeys';
import { LogActionType } from '../../core/types/enums';
import { calculateAssessmentScore, getAssessmentScoringRecords } from '../../services/AssessmentScoringService';
import { useLogContext } from '../../context/LogContext';

const blankScores = () => Object.fromEntries(
  FUNCTION_ASSESSMENT_QUESTIONS.map(({ key }) => [key, '']),
);

export default function AssessmentScoringPanel({ logs }) {
  const { addLog } = useLogContext();
  const records = useMemo(() => getAssessmentScoringRecords(logs), [logs]);
  const [selectedId, setSelectedId] = useState('');
  const selected = records.find((record) => record.id === selectedId) || records[0] || null;
  const [draftScores, setDraftScores] = useState(blankScores);

  useEffect(() => {
    if (!selected) {
      setSelectedId('');
      setDraftScores(blankScores());
      return;
    }
    setSelectedId(selected.id);
    setDraftScores(
      selected.scoredAt
        ? Object.fromEntries(
          Object.entries(selected.scores).map(([key, score]) => [
            key,
            score === '' ? '' : String(score),
          ]),
        )
        : blankScores(),
    );
  }, [selected?.id, selected?.scoredAt]);

  const complete = FUNCTION_ASSESSMENT_QUESTIONS.every(
    ({ key }) => draftScores[key] !== '',
  );
  const total = calculateAssessmentScore(
    Object.fromEntries(
      Object.entries(draftScores).map(([key, score]) => [
        key,
        score === '' ? null : Number(score),
      ]),
    ),
  );

  const handleSelect = (event) => {
    setSelectedId(event.target.value);
  };

  const handleScoreChange = (key, value) => {
    setDraftScores((current) => ({ ...current, [key]: value }));
  };

  const handleSave = () => {
    if (!selected || !complete) return;
    const scores = Object.fromEntries(
      Object.entries(draftScores).map(([key, score]) => [key, Number(score)]),
    );
    addLog(LogActionType.ASSESSMENT_SCORE, {
      sessionId: selected.sessionId,
      assessmentType: selected.assessmentType,
      rubricVersion: ASSESSMENT_RUBRIC_VERSION,
      scores,
      total: calculateAssessmentScore(scores),
      maxScore: ASSESSMENT_SCORE_MAX,
    });
  };

  if (!records.length) {
    return <p>לא נמצאו בוחנים שהוגשו לניקוד בדפדפן זה.</p>;
  }

  return (
    <section className="assessment-scoring" aria-label="ניקוד בוחנים">
      <h2>ניקוד בוחנים — מחוון אחיד</h2>
      <p>
        זהו ניקוד ידני של עשרה סעיפים, 0–2 נקודות לכל סעיף (עד 20). קוד המשתתף
        והמסלול אינם מוצגים. התשובות נשמרות מקומית בלבד.
      </p>
      <ul className="assessment-rubric-anchors">
        {Object.entries(ASSESSMENT_SCORE_ANCHORS).map(([score, description]) => (
          <li key={score}><strong>{score}:</strong> {description}</li>
        ))}
      </ul>

      <div className="field">
        <label htmlFor="assessment-to-score">בחירת בוחן לפי מזהה סשן</label>
        <select id="assessment-to-score" value={selected?.id || ''} onChange={handleSelect}>
          {records.map((record) => (
            <option key={record.id} value={record.id}>
              {record.assessmentLabel} · {record.sessionId}
              {record.total === null ? ' · טרם נוקד' : ` · ציון ${record.total}/${record.maxScore}`}
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <>
          <div className="assessment-scoring-meta">
            <span>{selected.assessmentLabel}</span>
            <span>מזהה סשן: {selected.sessionId}</span>
            <span>
              הוגש: {new Intl.DateTimeFormat('he-IL', {
                dateStyle: 'short',
                timeStyle: 'short',
              }).format(new Date(selected.submittedAt))}
            </span>
            {selected.functionExpression && (
              <span dir="ltr">הפונקציה: {selected.functionExpression}</span>
            )}
          </div>

          {FUNCTION_ASSESSMENT_QUESTIONS.map(({ key, label }) => (
            <div className="assessment-score-row" key={key}>
              <div>
                <h3>{label}</h3>
                <p>{ASSESSMENT_RUBRIC_CRITERIA[key]}</p>
                <blockquote>{selected.answers[key] || 'לא נמסרה תשובה.'}</blockquote>
                <details className="assessment-answer-key">
                  <summary>מפתח תשובה ומדיניות ניקוד</summary>
                  <p><strong>תשובה צפויה:</strong> {ASSESSMENT_ANSWER_KEYS[selected.assessmentType][key].expected}</p>
                  <p><strong>2 נקודות:</strong> {ASSESSMENT_ANSWER_KEYS[selected.assessmentType][key].fullCredit}</p>
                  <p><strong>1 נקודה:</strong> {ASSESSMENT_ANSWER_KEYS[selected.assessmentType][key].partialCredit}</p>
                </details>
              </div>
              <label>
                ציון
                <select
                  aria-label={`ציון ${label}`}
                  value={draftScores[key]}
                  onChange={(event) => handleScoreChange(key, event.target.value)}
                >
                  <option value="">לבחירה</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </label>
            </div>
          ))}

          <div className="assessment-scoring-footer">
            <strong>סך הכול: {total}/{ASSESSMENT_SCORE_MAX}</strong>
            <button className="btn btn-primary" onClick={handleSave} disabled={!complete}>
              שמירת ניקוד
            </button>
            {selected.scoredAt && (
              <span>
                ניקוד קודם לפי מחוון v{selected.rubricVersion}; שמירה תיצור גרסה v{ASSESSMENT_RUBRIC_VERSION}.
              </span>
            )}
          </div>
        </>
      )}
    </section>
  );
}
