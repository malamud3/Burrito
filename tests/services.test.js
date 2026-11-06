import { detectDifficulty, inferWeakestSkill } from '../src/services/DifficultyDetectionService';
import { selectAnalogTask } from '../src/services/AnalogTaskSelector';
import { computeLearningDurations, computePhaseDurations } from '../src/services/LogAnalyticsService';
import {
  logsToAssessmentScoresCSV,
  logsToCSV,
  logsToJSON,
} from '../src/services/ExportService';
import { CTSkill, LogActionType, Group } from '../src/core/types/enums';
import { getAssessmentScoringRecords } from '../src/services/AssessmentScoringService';
import { FUNCTION_ASSESSMENT_QUESTIONS } from '../src/core/constants/functionAssessments';
import { ASSESSMENT_ANSWER_KEYS } from '../src/core/constants/assessmentAnswerKeys';

const toolState = (o = {}) => ({
  decomposition: { steps: [{ id: 1, value: '' }] },
  abstraction: { rows: [] },
  algorithmic: { nodes: [{ id: 1, value: '' }] },
  ...o,
});
const log = (actionType, skill, t) => ({ id: Math.random(), timestamp: t, actionType, skill, data: {} });

test('no logs → nothing detected', () => {
  expect(detectDifficulty([], toolState()).detected).toBe(false);
});
test('decomposition churning detected', () => {
  const logs = Array.from({ length: 5 }, (_, i) => log(LogActionType.STEP_ADD, CTSkill.DECOMPOSITION, i * 1000));
  const r = detectDifficulty(logs, toolState());
  expect(r).toMatchObject({ detected: true, skill: CTSkill.DECOMPOSITION });
});
test('abstraction: 3 wrong markings detected', () => {
  const rows = [0, 1, 2].map((i) => ({ id: i, actualRelevant: true, userRelevant: false }));
  const r = detectDifficulty([], toolState({ abstraction: { rows } }));
  expect(r.skill).toBe(CTSkill.ABSTRACTION);
});
test('algorithmic stalled-empty detected (121s)', () => {
  const logs = [log(LogActionType.EDIT, CTSkill.ALGORITHMIC, 0), log(LogActionType.EDIT, CTSkill.ALGORITHMIC, 121000)];
  expect(detectDifficulty(logs, toolState()).skill).toBe(CTSkill.ALGORITHMIC);
});
test('weakest skill inference', () => {
  const ts = toolState({
    decomposition: { steps: [{ id: 1, value: 'a' }, { id: 2, value: 'b' }] },
    abstraction: { rows: [{ userRelevant: true }] },
    algorithmic: { nodes: [{ id: 1, value: '' }] },
  });
  expect(inferWeakestSkill(ts)).toBe(CTSkill.ALGORITHMIC);
});
test('adaptive selects matching task; fixed ignores detection', () => {
  expect(selectAnalogTask(Group.ADAPTIVE, CTSkill.ABSTRACTION).id).toBe('analog-abstract-gym');
  const f = selectAnalogTask(Group.FIXED, CTSkill.ABSTRACTION, 0);
  expect(f.id).toBe('analog-decomp-factory');
  expect(f.matchesDetectedSkill).toBe(false);
  expect(() => selectAnalogTask('x', 'y')).toThrow();
});
test('phase durations', () => {
  const logs = [
    { ...log(LogActionType.PHASE_CHANGE, null, 0), data: { to: 'problem' } },
    { ...log(LogActionType.PHASE_CHANGE, null, 5000), data: { to: 'solving' } },
    log(LogActionType.EDIT, null, 12000),
  ];
  expect(computePhaseDurations(logs)).toEqual([{ phase: 'problem', seconds: 5 }, { phase: 'solving', seconds: 7 }]);
});
test('learning durations use paired start and completion events per session', () => {
  const logs = [
    { ...log(LogActionType.LEARNING_START, null, 1000), data: { sessionId: 's1', startedAt: 1000 } },
    { ...log(LogActionType.LEARNING_START, null, 2000), data: { sessionId: 's2', startedAt: 2000 } },
    { ...log(LogActionType.LEARNING_COMPLETE, null, 21000), data: { sessionId: 's1', activityPath: 'classic' } },
    { ...log(LogActionType.LEARNING_COMPLETE, null, 32000), data: { sessionId: 's2', activityPath: 'renato', reason: 'time_limit' } },
  ];
  expect(computeLearningDurations(logs)).toEqual([
    { sessionId: 's1', activityPath: 'classic', seconds: 20, reason: 'completed' },
    { sessionId: 's2', activityPath: 'renato', seconds: 30, reason: 'time_limit' },
  ]);
});
test('csv escapes quotes + BOM', () => {
  const csv = logsToCSV([{ id: 'a', isoTime: 'x', timestamp: 1, actionType: 'edit', skill: null, data: { v: 'he said "hi"' } }]);
  expect(csv.startsWith('\uFEFF')).toBe(true);
  const dataCell = csv.split('\n')[1].match(/^"a","x","1","edit","","(.*)"$/)[1].replace(/""/g, '"');
  expect(JSON.parse(dataCell)).toEqual({ v: 'he said "hi"' });
});

test('JSON export preserves matched study-prompt responses', () => {
  const exported = JSON.parse(logsToJSON([], {
    studentId: 'P01',
    sessionId: 's1',
    activityPath: 'renato',
    mode: 'student',
    studyPrompts: { domain: 'ordered steps' },
  }));

  expect(exported.session.studyPrompts).toEqual({ domain: 'ordered steps' });
});

test('assessment scoring records are deidentified and use the latest manual score', () => {
  const assessment = Object.fromEntries(
    FUNCTION_ASSESSMENT_QUESTIONS.map(({ key }, index) => [key, `answer ${index}`]),
  );
  const logs = [
    {
      ...log(LogActionType.PRE_ASSESSMENT_SUBMIT, null, 1000),
      data: {
        sessionId: 'session-1',
        studentId: 'P01',
        activityPath: 'renato',
        functionExpression: 'x² / (x² − 8x + 15)',
        assessment,
      },
    },
    {
      ...log(LogActionType.ASSESSMENT_SCORE, null, 2000),
      data: {
        sessionId: 'session-1',
        assessmentType: 'preAssessment',
        rubricVersion: 1,
        scores: Object.fromEntries(FUNCTION_ASSESSMENT_QUESTIONS.map(({ key }) => [key, 1])),
      },
    },
    {
      ...log(LogActionType.ASSESSMENT_SCORE, null, 3000),
      data: {
        sessionId: 'session-1',
        assessmentType: 'preAssessment',
        rubricVersion: 2,
        scores: Object.fromEntries(FUNCTION_ASSESSMENT_QUESTIONS.map(({ key }) => [key, 2])),
      },
    },
  ];

  const [record] = getAssessmentScoringRecords(logs);
  expect(record).toMatchObject({
    sessionId: 'session-1',
    assessmentType: 'preAssessment',
    total: 20,
    maxScore: 20,
    scoredAt: 3000,
    rubricVersion: 2,
  });
  expect(record.answers.domain).toBe('answer 0');
  expect(record).not.toHaveProperty('studentId');
  expect(record).not.toHaveProperty('activityPath');
});

test('both form-specific answer keys cover all scored items', () => {
  const questionKeys = FUNCTION_ASSESSMENT_QUESTIONS.map(({ key }) => key).sort();

  expect(Object.keys(ASSESSMENT_ANSWER_KEYS.preAssessment).sort()).toEqual(questionKeys);
  expect(Object.keys(ASSESSMENT_ANSWER_KEYS.transferAssessment).sort()).toEqual(questionKeys);
  expect(ASSESSMENT_ANSWER_KEYS.preAssessment.domain.expected).toContain('3, 5');
  expect(ASSESSMENT_ANSWER_KEYS.transferAssessment.domain.expected).toContain('2, 4');
  expect(ASSESSMENT_ANSWER_KEYS.preAssessment.extremaPoints.expected).toContain('−15');
  expect(ASSESSMENT_ANSWER_KEYS.transferAssessment.extremaPoints.expected).toContain('−8');
});

test('JSON export aggregates latest manual assessment scores by session', () => {
  const scores = Object.fromEntries(FUNCTION_ASSESSMENT_QUESTIONS.map(({ key }) => [key, 2]));
  const logs = [
    {
      ...log(LogActionType.PRE_ASSESSMENT_SUBMIT, null, 1000),
      data: {
        sessionId: 'session-1',
        assessment: {},
        functionExpression: 'h(x)',
      },
    },
    {
      ...log(LogActionType.ASSESSMENT_SCORE, null, 2000),
      data: {
        sessionId: 'session-1',
        assessmentType: 'preAssessment',
        rubricVersion: 2,
        scores,
      },
    },
  ];
  const exported = JSON.parse(logsToJSON(logs, { sessionId: 'researcher-session' }));

  expect(exported.sessions.find(({ sessionId }) => sessionId === 'session-1')
    .assessmentScores.preAssessment).toMatchObject({
      total: 20,
      maxScore: 20,
      rubricVersion: 2,
    });
});

test('assessment score CSV joins pre and transfer scores without participant codes', () => {
  const preScores = Object.fromEntries(FUNCTION_ASSESSMENT_QUESTIONS.map(({ key }) => [key, 2]));
  const transferScores = Object.fromEntries(FUNCTION_ASSESSMENT_QUESTIONS.map(({ key }) => [key, 1]));
  const assessment = Object.fromEntries(FUNCTION_ASSESSMENT_QUESTIONS.map(({ key }) => [key, 'answer']));
  const logs = [
    {
      ...log(LogActionType.ACTIVITY_START, null, 1000),
      data: { sessionId: 's1', studentId: 'P01', activityPath: 'renato', mode: 'student' },
    },
    {
      ...log(LogActionType.PRE_ASSESSMENT_SUBMIT, null, 2000),
      data: { sessionId: 's1', assessment, functionExpression: 'h(x)' },
    },
    {
      ...log(LogActionType.TRANSFER_SUBMIT, null, 3000),
      data: { sessionId: 's1', activityPath: 'renato', assessment, functionExpression: 'g(x)' },
    },
    {
      ...log(LogActionType.ASSESSMENT_SCORE, null, 4000),
      data: { sessionId: 's1', assessmentType: 'preAssessment', rubricVersion: 2, scores: preScores },
    },
    {
      ...log(LogActionType.ASSESSMENT_SCORE, null, 5000),
      data: { sessionId: 's1', assessmentType: 'transferAssessment', rubricVersion: 2, scores: transferScores },
    },
  ];

  const csv = logsToAssessmentScoresCSV(logs);
  const [headerLine, rowLine] = csv.replace(/^\uFEFF/, '').split('\n');
  const header = headerLine.split(',');
  const values = rowLine.match(/"(?:[^"]|"")*"/g).map((cell) =>
    cell.slice(1, -1).replace(/""/g, '"'),
  );
  const cell = (name) => values[header.indexOf(name)];

  expect(cell('sessionId')).toBe('s1');
  expect(cell('activityPath')).toBe('renato');
  expect(cell('preStatus')).toBe('scored');
  expect(cell('preTotal')).toBe('20');
  expect(cell('transferStatus')).toBe('scored');
  expect(cell('transferTotal')).toBe('10');
  expect(cell('preRubricVersion')).toBe('2');
  expect(cell('transferRubricVersion')).toBe('2');
  expect(cell('preAssessment_domain')).toBe('2');
  expect(cell('transferAssessment_domain')).toBe('1');
  expect(csv).not.toContain('P01');
});
