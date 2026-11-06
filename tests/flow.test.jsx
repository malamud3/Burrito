import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import App from '../src/app/App';
import AppProviders from '../src/context/AppProviders';
import { useSessionContext } from '../src/context/SessionContext';
import { useLogContext } from '../src/context/LogContext';
import {
  ALLOCATION_STORAGE_KEY,
  STUDY_DURATION_SECONDS,
} from '../src/core/constants/study';
import { ActivityPath } from '../src/core/types/enums';
import { vi } from 'vitest';

const click = (name) => fireEvent.click(screen.getByRole('button', { name: new RegExp(name) }));
const choosePath = (name) => fireEvent.click(screen.getByRole('radio', { name: new RegExp(name) }));
const typeInto = (element, value) => fireEvent.change(element, { target: { value } });
const fillPreAssessment = () => {
  [
    'א. מצאו את תחום ההגדרה.',
    'ב. מצאו את הנגזרת.',
    'ג. מצאו את ערכי x החשודים כנקודות קיצון.',
    'ד. מצאו וסווגו את נקודות הקיצון.',
    'ה. מצאו את האסימפטוטות האנכיות.',
    'ו. מצאו את האסימפטוטה האופקית.',
    'ז. מצאו את נקודת החיתוך עם ציר y.',
    'ח. מצאו את נקודת החיתוך עם ציר x.',
    'ט. קבעו את סימן הנגזרת ואת תחומי העלייה והירידה.',
    'י. שרטטו סקיצה של הגרף וציינו את המאפיינים שסימנתם.',
  ].forEach((label, index) => {
    typeInto(screen.getByLabelText(label), `תשובת קדם ${index + 1}`);
  });
};
const drawOnGraph = () => {
  const graphBoard = screen.getByRole('img', { name: /לוח שרטוט הפונקציה/ });
  graphBoard.getBoundingClientRect = () => ({
    left: 0,
    top: 0,
    width: 700,
    height: 420,
    right: 700,
    bottom: 420,
  });
  fireEvent.pointerDown(graphBoard, { clientX: 100, clientY: 100, button: 0, pointerId: 1 });
  fireEvent.pointerMove(graphBoard, { clientX: 150, clientY: 140, pointerId: 1 });
  fireEvent.pointerUp(graphBoard, { clientX: 150, clientY: 140, pointerId: 1 });
};
const fillTransferAssessment = () => {
  [
    'א. מצאו את תחום ההגדרה.',
    'ב. מצאו את הנגזרת.',
    'ג. מצאו את ערכי x החשודים כנקודות קיצון.',
    'ד. מצאו וסווגו את נקודות הקיצון.',
    'ה. מצאו את האסימפטוטות האנכיות.',
    'ו. מצאו את האסימפטוטה האופקית.',
    'ז. מצאו את נקודת החיתוך עם ציר y.',
    'ח. מצאו את נקודת החיתוך עם ציר x.',
    'ט. קבעו את סימן הנגזרת ואת תחומי העלייה והירידה.',
    'י. שרטטו סקיצה של הגרף וציינו את המאפיינים שסימנתם.',
  ].forEach((label, index) => {
    typeInto(screen.getByLabelText(label), `תשובת בוחן ${index + 1}`);
  });
};
beforeEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  window.history.replaceState({}, '', '/');
});

test('classic path presents direct math questions and saves comparable responses', () => {
  render(<App />);
  typeInto(screen.getByPlaceholderText('הכנס קוד משתתף/ת'), 'C01');
  click('התחל/י');

  expect(screen.getByRole('heading', { name: 'בוחן מקדים' })).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('ctAdapt.session')).learningStartedAt).toBeNull();
  vi.spyOn(Math, 'random').mockReturnValue(0.1);
  fillPreAssessment();
  click('הגשת הבוחן והתחלת הלמידה');
  expect(screen.getByRole('heading', { name: 'חקירת פונקציה' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'בוחן מקדים' })).not.toBeInTheDocument();
  expect(screen.getByRole('math', { name: 'f(x) = x² / (x² − 4x + 3)' })).toBeInTheDocument();
  expect(screen.getByLabelText('א. מצאו את תחום ההגדרה של הפונקציה.')).toBeInTheDocument();
  expect(within(screen.getByRole('navigation', { name: 'שלבי חקירת הפונקציה' }))
    .getAllByRole('button')).toHaveLength(5);
  expect(screen.queryByRole('heading', { name: 'ארבע כרטיסיות חקירת הפונקציה' })).not.toBeInTheDocument();
  expect(screen.queryByRole('img', { name: /לוח שרטוט הפונקציה/ })).not.toBeInTheDocument();
  expect(screen.getByText(/לרשותכם 30 דקות/)).toBeInTheDocument();
  expect(screen.getByText(/נימוק מתמטי: הסבירו בקצרה את החישוב/)).toBeInTheDocument();
  click('המשך/י לשלב הבא');
  expect(screen.getByText(/יש להשלים את משימת העיבוד בשלב/)).toBeInTheDocument();

  typeInto(screen.getByLabelText('א. מצאו את תחום ההגדרה של הפונקציה.'), 'x ≠ 1, x ≠ 3');
  typeInto(screen.getByLabelText('משימת עיבוד קצרה'), 'המכנה מתאפס כאשר x=1 או x=3.');
  click('המשך/י לשלב הבא');

  expect(screen.getByRole('heading', { name: 'נקודות החשודות כנקודות קיצון' })).toBeInTheDocument();
  typeInto(screen.getByLabelText('משימת עיבוד קצרה'), 'גוזרים, מאפסים את הנגזרת ובודקים שינוי סימן.');
  click('המשך/י לשלב הבא');

  expect(screen.getByRole('heading', { name: 'אסימפטוטות מקבילות לצירים' })).toBeInTheDocument();
  typeInto(screen.getByLabelText('ה. מצאו את האסימפטוטות האנכיות.'), 'x=1, x=3');
  typeInto(screen.getByLabelText('ו. מצאו את האסימפטוטה האופקית.'), 'y=1');
  typeInto(screen.getByLabelText('משימת עיבוד קצרה'), 'האסימפטוטות נקבעות לפי המכנה והדרגות.');
  click('המשך/י לשלב הבא');

  expect(screen.getByRole('heading', { name: 'נקודות חיתוך עם הצירים' })).toBeInTheDocument();
  typeInto(screen.getByLabelText('משימת עיבוד קצרה'), 'מציבים x=0 לחיתוך y ומשווים את המונה לאפס לחיתוך x.');
  click('המשך/י לשלב הבא');

  expect(screen.getByRole('heading', { name: 'שרטוט הפונקציה', level: 2 })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /לוח שרטוט הפונקציה/ })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '✏️ שרטוט ביד חופשית' }));
  drawOnGraph();
  click('סיימתי את חקירת הפונקציה');

  expect(screen.getByRole('heading', { name: 'בוחן העברה' })).toBeInTheDocument();
  expect(screen.getByRole('math', { name: 'g(x) = x² / (x² − 6x + 8)' })).toBeInTheDocument();
  click('הגשת הבוחן וסיום');
  expect(screen.getByText('יש להשלים את כל סעיפי הבוחן לפני ההגשה.')).toBeInTheDocument();
  fillTransferAssessment();
  click('הגשת הבוחן וסיום');
  expect(screen.getByText('סיימת! תודה רבה!')).toBeInTheDocument();
  expect(screen.getByText('קלאסי')).toBeInTheDocument();
  const savedSession = JSON.parse(localStorage.getItem('ctAdapt.session'));
  expect(savedSession.activityPath).toBe('classic');
  expect(savedSession.classicWork.domain).toBe('x ≠ 1, x ≠ 3');
  expect(savedSession.classicWork.verticalAsymptotes).toBe('x=1, x=3');
  expect(savedSession.classicWork.horizontalAsymptote).toBe('y=1');
  expect(savedSession.studyPrompts.domain).toContain('המכנה מתאפס');
  const logs = JSON.parse(localStorage.getItem('ctAdapt.logs'));
  const start = logs.find(({ actionType }) => actionType === 'activity_start');
  const learningStart = logs.find(({ actionType }) => actionType === 'learning_start');
  const complete = logs.find(({ actionType }) => actionType === 'activity_complete');
  expect(start.data).toMatchObject({
    studentId: 'C01',
    activityPath: 'classic',
    mode: 'student',
    method: 'student_choice',
    chosenAt: expect.any(Number),
    studyDurationMinutes: 30,
  });
  expect(start.data.sessionId).toBeTruthy();
  expect(learningStart.data).toMatchObject({
    activityPath: 'classic',
    durationLimitMinutes: 30,
    startedAt: expect.any(Number),
  });
  const preAssessment = logs.find(({ actionType }) => actionType === 'pre_assessment_submit');
  expect(Object.keys(preAssessment.data.assessment)).toHaveLength(10);
  expect(complete.data.activityPath).toBe('classic');
  expect(complete.data.sessionId).toBe(start.data.sessionId);
  expect(complete.data.assessment).toMatchObject({
    domain: 'x ≠ 1, x ≠ 3',
    verticalAsymptotes: 'x=1, x=3',
    horizontalAsymptote: 'y=1',
    processResponses: {
      domain: 'המכנה מתאפס כאשר x=1 או x=3.',
    },
  });
  const transferSubmit = logs.find(({ actionType }) => actionType === 'transfer_submit');
  expect(transferSubmit.data).toMatchObject({
    activityPath: 'classic',
    functionExpression: 'x² / (x² − 6x + 8)',
  });
  expect(logs.some(({ actionType }) => actionType === 'learning_complete')).toBe(true);
  expect(Object.keys(transferSubmit.data.assessment)).toHaveLength(10);
});

test('researcher mode opens the dashboard without assigning a participant', () => {
  render(<App />);
  typeInto(screen.getByPlaceholderText('הכנס קוד משתתף/ת'), 'R1');
  typeInto(screen.getByLabelText('כניסה בתור'), 'researcher');
  click('לוח בקרה');

  expect(screen.getByRole('heading', { name: '📊 לוח בקרה — חוקר/ת' })).toBeInTheDocument();
  expect(screen.getByText('משתתפים')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /הורד ציוני בוחנים/ })).toBeInTheDocument();
  expect(screen.queryByRole('tab', { name: 'זיהוי קשיים' })).not.toBeInTheDocument();
});

test('researcher can score a submitted assessment without seeing participant code or path', async () => {
  const assessment = Object.fromEntries(
    [
      'domain',
      'derivative',
      'criticalPoints',
      'extremaPoints',
      'verticalAsymptotes',
      'horizontalAsymptote',
      'yAxisIntercept',
      'xAxisIntercept',
      'signBehavior',
      'graph',
    ].map((key) => [key, `answer for ${key}`]),
  );
  localStorage.setItem('ctAdapt.logs', JSON.stringify([{
    id: 'submitted-pretest',
    timestamp: 1000,
    isoTime: '2025-01-01T00:00:01.000Z',
    actionType: 'pre_assessment_submit',
    skill: null,
    data: {
      sessionId: 'session-anonymous',
      studentId: 'participant-secret',
      activityPath: 'renato',
      functionExpression: 'x² / (x² − 8x + 15)',
      assessment,
    },
  }]));

  render(<App />);
  typeInto(screen.getByPlaceholderText('הכנס קוד משתתף/ת'), 'R1');
  typeInto(screen.getByLabelText('כניסה בתור'), 'researcher');
  click('לוח בקרה');
  fireEvent.click(screen.getByRole('tab', { name: 'ניקוד בוחנים' }));

  expect(screen.getByText('מזהה סשן: session-anonymous')).toBeInTheDocument();
  expect(screen.queryByText('participant-secret')).not.toBeInTheDocument();
  expect(screen.queryByText('renato')).not.toBeInTheDocument();
  fireEvent.click(screen.getAllByText('מפתח תשובה ומדיניות ניקוד')[0]);
  expect(screen.getByText('ℝ \\ {3, 5}')).toBeInTheDocument();

  const questionLabels = [
    'א. מצאו את תחום ההגדרה.',
    'ב. מצאו את הנגזרת.',
    'ג. מצאו את ערכי x החשודים כנקודות קיצון.',
    'ד. מצאו וסווגו את נקודות הקיצון.',
    'ה. מצאו את האסימפטוטות האנכיות.',
    'ו. מצאו את האסימפטוטה האופקית.',
    'ז. מצאו את נקודת החיתוך עם ציר y.',
    'ח. מצאו את נקודת החיתוך עם ציר x.',
    'ט. קבעו את סימן הנגזרת ואת תחומי העלייה והירידה.',
    'י. שרטטו סקיצה של הגרף וציינו את המאפיינים שסימנתם.',
  ];
  questionLabels.forEach((label) => {
    fireEvent.change(screen.getByLabelText(`ציון ${label}`), { target: { value: '2' } });
  });
  fireEvent.click(screen.getByRole('button', { name: 'שמירת ניקוד' }));

  await waitFor(() => {
    const logs = JSON.parse(localStorage.getItem('ctAdapt.logs'));
    const score = logs.find(({ actionType }) => actionType === 'assessment_score');
    expect(score.data).toMatchObject({
      sessionId: 'session-anonymous',
      assessmentType: 'preAssessment',
      rubricVersion: 2,
      total: 20,
      maxScore: 20,
    });
    expect(score.data.scores).toEqual(Object.fromEntries(
      Object.keys(assessment).map((key) => [key, 2]),
    ));
    expect(score.data).not.toHaveProperty('studentId');
    expect(score.data).not.toHaveProperty('activityPath');
  });
});

test('students choose a learning path at login and complete the shared pretest first', () => {
  render(<App />);
  typeInto(screen.getByPlaceholderText('הכנס קוד משתתף/ת'), 'PRE01');
  choosePath('מסלול רנאטו');
  click('התחל/י');

  expect(screen.getByRole('heading', { name: 'בוחן מקדים' })).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('ctAdapt.session')).activityPath).toBe(ActivityPath.RENATO);
  expect(localStorage.getItem(ALLOCATION_STORAGE_KEY)).toBeNull();
  fillPreAssessment();
  click('הגשת הבוחן והתחלת הלמידה');

  expect(screen.getByRole('heading', { name: 'כלי עזר לחקירת פונקציות' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'בוחן מקדים' })).not.toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem(ALLOCATION_STORAGE_KEY)).participants.PRE01)
    .toMatchObject({ activityPath: ActivityPath.RENATO, method: 'student_choice' });
});

test('a student can select a path but cannot skip the shared pretest', () => {
  render(<App />);
  typeInto(screen.getByPlaceholderText('הכנס קוד משתתף/ת'), 'NO-PATH');
  choosePath('מסלול רנאטו');
  click('התחל/י');

  expect(screen.getByRole('heading', { name: 'בוחן מקדים' })).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('ctAdapt.session')).activityPath).toBe(ActivityPath.RENATO);
  expect(JSON.parse(localStorage.getItem('ctAdapt.session')).learningStartedAt).toBeNull();
  expect(localStorage.getItem(ALLOCATION_STORAGE_KEY)).toBeNull();

  window.history.replaceState({}, '', '/renato/domain');
  fireEvent.popState(window);
  expect(screen.getByRole('heading', { name: 'בוחן מקדים' })).toBeInTheDocument();
});

test('starting another participant preserves previous participant logs', () => {
  render(<App />);
  typeInto(screen.getByPlaceholderText('הכנס קוד משתתף/ת'), 'P01');
  click('התחל/י');
  vi.spyOn(Math, 'random').mockReturnValue(0.1);
  fillPreAssessment();
  click('הגשת הבוחן והתחלת הלמידה');
  window.history.replaceState({}, '', '/login');
  fireEvent.popState(window);
  typeInto(screen.getByPlaceholderText('הכנס קוד משתתף/ת'), 'P02');
  choosePath('מסלול רנאטו');
  click('התחל/י');
  fillPreAssessment();
  click('הגשת הבוחן והתחלת הלמידה');

  const starts = JSON.parse(localStorage.getItem('ctAdapt.logs'))
    .filter(({ actionType }) => actionType === 'activity_start');
  expect(starts).toHaveLength(2);
  expect(starts.map(({ data }) => data.activityPath)).toEqual([
    ActivityPath.CLASSIC,
    ActivityPath.RENATO,
  ]);
  expect(starts.map(({ data }) => data.method)).toEqual([
    'student_choice',
    'student_choice',
  ]);
});

test('session and logs restore from localStorage', () => {
  localStorage.setItem('ctAdapt.session', JSON.stringify({
    studentId: 'S99',
    activityPath: 'classic',
    mode: 'student',
    isActive: true,
    classicWork: { domain: 'answer saved' },
  }));
  localStorage.setItem('ctAdapt.logs', JSON.stringify([
    { id: 'log-1', actionType: 'edit', data: { value: 'saved' } },
  ]));

  function SessionProbe() {
    const { session } = useSessionContext();
    const { logs } = useLogContext();
    return (
      <div>
        <span data-testid="student-id">{session.studentId}</span>
        <span data-testid="classic-domain">{session.classicWork.domain}</span>
        <span data-testid="log-count">{logs.length}</span>
      </div>
    );
  }

  render(<AppProviders><SessionProbe /></AppProviders>);
  expect(screen.getByTestId('student-id')).toHaveTextContent('S99');
  expect(screen.getByTestId('classic-domain')).toHaveTextContent('answer saved');
  expect(screen.getByTestId('log-count')).toHaveTextContent('1');
});

test('a saved legacy adaptive phase resumes in the classic path', () => {
  localStorage.setItem('ctAdapt.session', JSON.stringify({
    studentId: 'S100',
    activityPath: 'ct-adapt',
    mode: 'student',
    isActive: true,
    learningStartedAt: Date.now(),
  }));
  localStorage.setItem('ctAdapt.phase', 'solving');

  render(<App />);
  expect(screen.getByRole('heading', { name: 'חקירת פונקציה' })).toBeInTheDocument();
  expect(screen.queryByPlaceholderText('הכנס קוד משתתף/ת')).not.toBeInTheDocument();
});

test('a session cannot switch study paths by opening the other path URL', () => {
  const now = Date.now();
  localStorage.setItem('ctAdapt.session', JSON.stringify({
    studentId: 'C02',
    sessionId: 'session-C02',
    activityPath: 'classic',
    mode: 'student',
    isActive: true,
    startTime: now,
    allocation: { method: 'balanced_randomized_blocks', allocationIndex: 1 },
    preAssessmentSubmittedAt: now,
    learningStartedAt: now,
  }));
  window.history.replaceState({}, '', '/renato/domain');

  render(<App />);
  expect(screen.getByRole('heading', { name: 'חקירת פונקציה' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'כלי עזר לחקירת פונקציות' })).not.toBeInTheDocument();
});

test('opening the transfer route directly cannot skip the learning activity', () => {
  const now = Date.now();
  localStorage.setItem('ctAdapt.session', JSON.stringify({
    studentId: 'C03',
    sessionId: 'session-no-skip',
    activityPath: 'classic',
    mode: 'student',
    isActive: true,
    startTime: now,
    allocation: { method: 'balanced_randomized_blocks', allocationIndex: 1 },
  }));
  window.history.replaceState({}, '', '/transfer-test');

  render(<App />);

  expect(screen.getByRole('heading', { name: 'בוחן מקדים' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'בוחן העברה' })).not.toBeInTheDocument();
});

test('Renato path uses matched open questions, saves a graph, and exports comparable responses', () => {
  const { unmount } = render(<App />);
  typeInto(screen.getByPlaceholderText('הכנס קוד משתתף/ת'), 'R-S01');
  choosePath('מסלול רנאטו');
  click('התחל/י');
  fillPreAssessment();
  click('הגשת הבוחן והתחלת הלמידה');

  expect(screen.getByRole('heading', { name: 'כלי עזר לחקירת פונקציות' })).toBeInTheDocument();
  expect(screen.getByRole('math', { name: 'f(x) = x² / (x² − 4x + 3)' })).toBeInTheDocument();
  expect(screen.getByText(/לרשותכם 30 דקות/)).toBeInTheDocument();
  expect(within(screen.getByRole('navigation', { name: 'שלבי חקירת הפונקציה' }))
    .getAllByRole('button')).toHaveLength(5);
  expect(screen.queryByRole('table')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: /שלב 1 · טרם התחלת תחום ההגדרה/ })).toBeInTheDocument();
  expect(screen.getByText(/פירוק: רשמו את סדר תתי-המשימות/)).toBeInTheDocument();
  expect(screen.queryByText('אילו ערכי x מאפסים את המכנה?')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /הצגת שלב עזר 1 מתוך 2/ }));
  expect(screen.getByText('אילו ערכי x מאפסים את המכנה?')).toBeInTheDocument();
  expect(screen.queryByText('תחום ההגדרה כולל את כל המספרים הממשיים מלבד הערכים שמצאת.')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /הצגת שלב עזר 2 מתוך 2/ }));
  expect(screen.getByText('תחום ההגדרה כולל את כל המספרים הממשיים מלבד הערכים שמצאת.')).toBeInTheDocument();
  expect(screen.getByText('כל שלבי העזר זמינים למעלה.')).toBeInTheDocument();
  const hintLogs = JSON.parse(localStorage.getItem('ctAdapt.logs'))
    .filter(({ actionType }) => actionType === 'hint_request');
  expect(hintLogs.map(({ data }) => data)).toEqual(expect.arrayContaining([
    expect.objectContaining({ phase: 'function_analysis', stepId: 'domain', hintIndex: 1 }),
    expect.objectContaining({ phase: 'function_analysis', stepId: 'domain', hintIndex: 2 }),
  ]));
  click('המשך/י לשלב הבא');
  expect(screen.getByText(/יש להשלים את משימת העיבוד בשלב/)).toBeInTheDocument();
  typeInto(screen.getByLabelText('א. מצאו את תחום ההגדרה של הפונקציה.'), 'x ≠ 1, x ≠ 3');
  typeInto(screen.getByLabelText('משימת עיבוד קצרה'), 'תחום, נקודות קיצון, אסימפטוטות, חיתוכים וגרף.');
  expect(screen.getByRole('button', { name: /שלב 1 · השדות מולאו תחום ההגדרה/ })).toBeInTheDocument();
  click('המשך/י לשלב הבא');

  expect(screen.getByRole('heading', { name: 'נקודות החשודות כנקודות קיצון' })).toBeInTheDocument();
  const phaseChanges = JSON.parse(localStorage.getItem('ctAdapt.logs'))
    .filter(({ actionType, data }) => (
      actionType === 'phase_change'
      && data.from === 'renato'
      && data.to === 'renato-extrema'
    ));
  expect(phaseChanges).toHaveLength(1);
  typeInto(screen.getByLabelText('ב. מצאו את הנגזרת של הפונקציה.'), "(-4x² + 6x)/(x² − 4x + 3)²");
  typeInto(screen.getByLabelText('ג. מצאו את ערכי x החשודים כנקודות קיצון.'), '0, 1.5');
  typeInto(screen.getByLabelText('ד. מצאו את נקודות הקיצון וסווגו אותן.'), 'Min (0, 0), Max (1.5, -3)');
  typeInto(screen.getByLabelText('משימת עיבוד קצרה'), 'המונה והנגזרת רלוונטיים; אסימפטוטות נבדקות בשלב אחר.');
  click('המשך/י לשלב הבא');

  expect(screen.getByRole('heading', { name: 'אסימפטוטות מקבילות לצירים' })).toBeInTheDocument();
  typeInto(screen.getByLabelText('ה. מצאו את האסימפטוטות האנכיות.'), 'x = 1, x = 3');
  typeInto(screen.getByLabelText('ו. מצאו את האסימפטוטה האופקית.'), 'y = 1');
  typeInto(screen.getByLabelText('משימת עיבוד קצרה'), 'המכנה מתאפס בשני ערכים, ומעלות המונה והמכנה שוות.');
  click('המשך/י לשלב הבא');

  expect(screen.getByRole('heading', { name: 'נקודות חיתוך עם הצירים' })).toBeInTheDocument();
  typeInto(screen.getByLabelText('ז. מצאו את נקודת החיתוך עם ציר y.'), '(0, 0)');
  typeInto(screen.getByLabelText('ח. מצאו את נקודת החיתוך עם ציר x.'), '(0, 0)');
  typeInto(screen.getByLabelText('משימת עיבוד קצרה'), '1. להציב x=0. 2. לאפס מונה. 3. לבדוק תחום.');
  click('המשך/י לשלב הבא');

  expect(screen.getByRole('heading', { name: 'שרטוט הפונקציה', level: 2 })).toBeInTheDocument();
  typeInto(
    screen.getByLabelText('ט. קבעו את סימן הנגזרת ואת תחומי העלייה והירידה.'),
    'סימן הנגזרת: −, 0, +, לא מוגדר, +, 0, −, לא מוגדר, −',
  );
  fireEvent.click(screen.getByRole('button', { name: '✏️ שרטוט ביד חופשית' }));
  drawOnGraph();
  fireEvent.click(screen.getByRole('button', { name: 'רקע משובץ' }));
  expect(screen.getByRole('button', { name: 'רקע חלק' })).toHaveAttribute('aria-pressed', 'false');

  const savedSession = JSON.parse(localStorage.getItem('ctAdapt.session'));
  expect(savedSession.activityPath).toBe('renato');
  expect(savedSession.renatoWork.functionExpression).toBe('x² / (x² − 4x + 3)');
  expect(savedSession.renatoWork.cards.domain.answer).toBe('x ≠ 1, x ≠ 3');
  expect(savedSession.renatoWork.cards.asymptotes.vertical).toBe('x = 1, x = 3');
  expect(savedSession.renatoWork.signBehavior).toMatch(/סימן הנגזרת/);
  expect(savedSession.studyPrompts).toMatchObject({
    domain: expect.stringContaining('תחום, נקודות קיצון'),
    extrema: expect.stringContaining('המונה והנגזרת'),
    asymptotes: expect.stringContaining('המכנה מתאפס'),
    intercepts: expect.stringContaining('1. להציב'),
  });
  expect(savedSession.renatoWork.graphStrokes).toHaveLength(1);
  expect(savedSession.renatoWork.grid).toBe(false);

  unmount();
  render(<App />);
  expect(screen.getByRole('heading', { name: 'שרטוט הפונקציה', level: 2 })).toBeInTheDocument();
  expect(document.querySelectorAll('.renato-student-stroke')).toHaveLength(1);
  fireEvent.click(screen.getByRole('button', { name: /תחום ההגדרה/ }));
  expect(screen.getByLabelText('א. מצאו את תחום ההגדרה של הפונקציה.')).toHaveValue('x ≠ 1, x ≠ 3');
  fireEvent.click(screen.getByRole('button', { name: /שרטוט הפונקציה/ }));
  expect(screen.getByRole('button', { name: 'רקע חלק' })).toHaveAttribute('aria-pressed', 'false');

  click('סיימתי את חקירת הפונקציה');
  expect(screen.getByRole('heading', { name: 'בוחן העברה' })).toBeInTheDocument();
  expect(screen.getByRole('math', { name: 'g(x) = x² / (x² − 6x + 8)' })).toBeInTheDocument();
  fillTransferAssessment();
  click('הגשת הבוחן וסיום');
  expect(screen.getByText('סיימת! תודה רבה!')).toBeInTheDocument();
  const renatoLogs = JSON.parse(localStorage.getItem('ctAdapt.logs'));
  const renatoCompletion = renatoLogs.find(({ actionType }) => actionType === 'activity_complete');
  expect(renatoCompletion.data.activityPath).toBe('renato');
  expect(renatoCompletion.data.sessionId).toBe(
    renatoLogs.find(({ actionType }) => actionType === 'activity_start').data.sessionId,
  );
  expect(renatoCompletion.data.assessment).toMatchObject({
    domain: 'x ≠ 1, x ≠ 3',
    verticalAsymptotes: 'x = 1, x = 3',
    horizontalAsymptote: 'y = 1',
    signBehavior: expect.any(String),
    processResponses: {
      domain: expect.stringContaining('תחום, נקודות קיצון'),
      intercepts: expect.stringContaining('1. להציב'),
    },
    graph: { graphStrokes: expect.any(Array) },
  });
  expect(renatoCompletion.data.assessment.signBehavior).toContain('סימן הנגזרת');
  const transferSubmit = renatoLogs.find(({ actionType }) => actionType === 'transfer_submit');
  expect(transferSubmit.data.activityPath).toBe('renato');
  expect(Object.keys(transferSubmit.data.assessment)).toHaveLength(10);
});

test('the 30-minute learning limit moves an active participant to the shared transfer test', async () => {
  const startTime = Date.now() - (STUDY_DURATION_SECONDS + 1) * 1000;
  localStorage.setItem('ctAdapt.session', JSON.stringify({
    studentId: 'TIME01',
    sessionId: 'session-time-limit',
    activityPath: 'classic',
    mode: 'student',
    isActive: true,
    startTime,
    allocation: { method: 'balanced_randomized_blocks', allocationIndex: 1 },
    preAssessmentSubmittedAt: startTime,
    learningStartedAt: startTime,
  }));
  window.history.replaceState({}, '', '/activities/classic');

  render(<App />);

  await waitFor(() => {
    expect(screen.getByRole('heading', { name: 'בוחן העברה' })).toBeInTheDocument();
  });
  const logs = JSON.parse(localStorage.getItem('ctAdapt.logs'));
  expect(logs.some((entry) => entry.actionType === 'time_limit_reached')).toBe(true);
});

test('a timed-out Renato participant can complete the transfer test without drawing a graph', async () => {
  const startTime = Date.now() - (STUDY_DURATION_SECONDS + 1) * 1000;
  localStorage.setItem('ctAdapt.session', JSON.stringify({
    studentId: 'TIME-RENATO',
    sessionId: 'session-time-limit-renato',
    activityPath: 'renato',
    mode: 'student',
    isActive: true,
    startTime,
    learningStartedAt: startTime,
  }));
  window.history.replaceState({}, '', '/renato/graph');

  render(<App />);

  await waitFor(() => {
    expect(screen.getByRole('heading', { name: 'בוחן העברה' })).toBeInTheDocument();
  });
  fillTransferAssessment();
  click('הגשת הבוחן וסיום');

  expect(await screen.findByText('סיימת! תודה רבה!')).toBeInTheDocument();
  const logs = JSON.parse(localStorage.getItem('ctAdapt.logs'));
  expect(logs.some((entry) => entry.actionType === 'learning_complete')).toBe(true);
});
