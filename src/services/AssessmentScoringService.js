import { FUNCTION_ASSESSMENT_QUESTIONS } from '../core/constants/functionAssessments';
import {
  ASSESSMENT_RUBRIC_VERSION,
  ASSESSMENT_SCORE_MAX,
} from '../core/constants/assessmentRubric';
import { LogActionType } from '../core/types/enums';

const SUBMISSION_TYPES = Object.freeze({
  [LogActionType.PRE_ASSESSMENT_SUBMIT]: 'preAssessment',
  [LogActionType.TRANSFER_SUBMIT]: 'transferAssessment',
});

const ASSESSMENT_LABELS = Object.freeze({
  preAssessment: 'בוחן מקדים',
  transferAssessment: 'בוחן העברה',
});

const recordKey = (sessionId, assessmentType) => `${sessionId}:${assessmentType}`;

function normalizeScore(value) {
  return Number.isInteger(value) && value >= 0 && value <= 2 ? value : '';
}

export function calculateAssessmentScore(scores) {
  return Object.values(scores).reduce(
    (total, score) => total + (Number.isInteger(score) && score >= 0 && score <= 2 ? score : 0),
    0,
  );
}

export function getAssessmentScoringRecords(logs) {
  const submissions = new Map();
  const savedScores = new Map();

  logs.forEach((entry) => {
    const sessionId = entry.data?.sessionId;
    if (!sessionId) return;

    const assessmentType = SUBMISSION_TYPES[entry.actionType];
    if (assessmentType && entry.data?.assessment) {
      submissions.set(recordKey(sessionId, assessmentType), entry);
    }

    if (entry.actionType === LogActionType.ASSESSMENT_SCORE &&
      Object.prototype.hasOwnProperty.call(ASSESSMENT_LABELS, entry.data?.assessmentType)) {
      savedScores.set(
        recordKey(sessionId, entry.data.assessmentType),
        entry,
      );
    }
  });

  return Array.from(submissions.entries())
    .map(([key, submission]) => {
      const sessionId = submission.data.sessionId;
      const assessmentType = SUBMISSION_TYPES[submission.actionType];
      const scoreEntry = savedScores.get(key);
      const scores = Object.fromEntries(
        FUNCTION_ASSESSMENT_QUESTIONS.map(({ key: questionKey }) => [
          questionKey,
          normalizeScore(scoreEntry?.data?.scores?.[questionKey]),
        ]),
      );

      return {
        id: key,
        sessionId,
        assessmentType,
        assessmentLabel: ASSESSMENT_LABELS[assessmentType],
        functionExpression: submission.data.functionExpression || '',
        submittedAt: submission.timestamp,
        answers: Object.fromEntries(
          FUNCTION_ASSESSMENT_QUESTIONS.map(({ key: questionKey }) => [
            questionKey,
            typeof submission.data.assessment[questionKey] === 'string'
              ? submission.data.assessment[questionKey]
              : '',
          ]),
        ),
        scores,
        total: scoreEntry ? calculateAssessmentScore(scores) : null,
        maxScore: ASSESSMENT_SCORE_MAX,
        scoredAt: scoreEntry?.timestamp || null,
        rubricVersion: scoreEntry
          ? scoreEntry.data.rubricVersion || 1
          : null,
      };
    })
    .sort((a, b) => a.submittedAt - b.submittedAt || a.id.localeCompare(b.id));
}

export function getLatestAssessmentScores(logs) {
  const scores = new Map();
  getAssessmentScoringRecords(logs).forEach((record) => {
    if (record.total === null) return;
    const session = scores.get(record.sessionId) || {};
    session[record.assessmentType] = {
      scores: record.scores,
      total: record.total,
      maxScore: record.maxScore,
      scoredAt: record.scoredAt,
      rubricVersion: record.rubricVersion || ASSESSMENT_RUBRIC_VERSION,
    };
    scores.set(record.sessionId, session);
  });
  return scores;
}
