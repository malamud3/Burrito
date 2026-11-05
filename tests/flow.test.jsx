import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/app/App';
import AppProviders from '../src/context/AppProviders';
import { useSessionContext } from '../src/context/SessionContext';
import { useLogContext } from '../src/context/LogContext';
import { STUDY_DURATION_SECONDS } from '../src/core/constants/study';
import { ActivityPath } from '../src/core/types/enums';

const click = (name) => fireEvent.click(screen.getByRole('button', { name: new RegExp(name) }));
const typeInto = (element, value) => fireEvent.change(element, { target: { value } });
const choosePath = (name) => fireEvent.click(screen.getByRole('radio', { name: new RegExp(name) }));
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
  click('הגשת הבוחן והתחלת הלמידה');
};

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, '', '/');
});

test('classic path presents direct math questions and saves comparable responses', () => {
  render(<App />);
  typeInto(screen.getByPlaceholderText('הכנס קוד משתתף/ת'), 'C01');
  choosePath('המסלול הקלאסי');
  click('התחל/י');

  expect(screen.getByRole('heading', { name: 'בוחן מקדים' })).toBeInTheDocument();
  expect(screen.getByRole('math', { name: 'h(x) = x² / (x² − 8x + 15)' })).toBeInTheDocument();
  fillPreAssessment();
  expect(screen.getByRole('heading', { name: 'חקירת פונקציה' })).toBeInTheDocument();
  expect(screen.getByText('f(x) = x² / (x² − 4x + 3)')).toBeInTheDocument();
  expect(screen.getByLabelText('א. מצאו את תחום ההגדרה של הפונקציה.')).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'תחום ההגדרה' })).not.toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'ארבע כרטיסיות חקירת הפונקציה' })).not.toBeInTheDocument();
  expect(screen.getByRole('img', { name: /לוח שרטוט הפונקציה/ })).toBeInTheDocument();
  expect(screen.getByText(/לרשותכם 30 דקות/)).toBeInTheDocument();

  typeInto(screen.getByLabelText('א. מצאו את תחום ההגדרה של הפונקציה.'), 'x ≠ 1, x ≠ 3');
  typeInto(screen.getByLabelText('ה. מצאו את האסימפטוטות האנכיות.'), 'x=1, x=3');
  typeInto(screen.getByLabelText('ו. מצאו את האסימפטוטה האופקית.'), 'y=1');
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
  const logs = JSON.parse(localStorage.getItem('ctAdapt.logs'));
  const start = logs.find(({ actionType }) => actionType === 'activity_start');
  const preSubmit = logs.find(({ actionType }) => actionType === 'pre_assessment_submit');
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
  expect(preSubmit.data).toMatchObject({
    functionExpression: 'x² / (x² − 8x + 15)',
    assessment: { domain: 'תשובת קדם 1' },
  });
  expect(complete.data.activityPath).toBe('classic');
  expect(complete.data.sessionId).toBe(start.data.sessionId);
  expect(complete.data.assessment).toMatchObject({
    domain: 'x ≠ 1, x ≠ 3',
    verticalAsymptotes: 'x=1, x=3',
    horizontalAsymptote: 'y=1',
  });
  const transferSubmit = logs.find(({ actionType }) => actionType === 'transfer_submit');
  expect(transferSubmit.data).toMatchObject({
    activityPath: 'classic',
    functionExpression: 'x² / (x² − 6x + 8)',
  });
  expect(Object.keys(transferSubmit.data.assessment)).toHaveLength(10);
});

test('researcher mode opens the dashboard without assigning a participant', () => {
  render(<App />);
  typeInto(screen.getByPlaceholderText('הכנס קוד משתתף/ת'), 'R1');
  typeInto(screen.getByLabelText('מצב'), 'researcher');
  click('התחל/י');

  expect(screen.getByRole('heading', { name: '📊 לוח בקרה — חוקר/ת' })).toBeInTheDocument();
  expect(screen.getByText('משתתפים')).toBeInTheDocument();
  expect(screen.queryByRole('tab', { name: 'זיהוי קשיים' })).not.toBeInTheDocument();
});

test('pre-assessment must be completed before learning begins', () => {
  render(<App />);
  typeInto(screen.getByPlaceholderText('הכנס קוד משתתף/ת'), 'PRE01');
  choosePath('המסלול הקלאסי');
  click('התחל/י');

  expect(screen.getByRole('heading', { name: 'בוחן מקדים' })).toBeInTheDocument();
  click('הגשת הבוחן והתחלת הלמידה');
  expect(screen.getByText('יש להשלים את כל סעיפי הבוחן המקדים לפני ההמשך.')).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'חקירת פונקציה' })).not.toBeInTheDocument();
});

test('a student must choose one of the two learning paths before starting', () => {
  render(<App />);
  typeInto(screen.getByPlaceholderText('הכנס קוד משתתף/ת'), 'NO-PATH');
  click('התחל/י');

  expect(screen.getByText('נא לבחור מסלול למידה')).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'בוחן מקדים' })).not.toBeInTheDocument();
  expect(localStorage.getItem('ctAdapt.session')).toBeNull();
});

test('starting another participant preserves previous participant logs', () => {
  render(<App />);
  typeInto(screen.getByPlaceholderText('הכנס קוד משתתף/ת'), 'P01');
  choosePath('המסלול הקלאסי');
  click('התחל/י');
  window.history.replaceState({}, '', '/login');
  fireEvent.popState(window);
  typeInto(screen.getByPlaceholderText('הכנס קוד משתתף/ת'), 'P02');
  choosePath('מסלול רנאטו');
  click('התחל/י');

  const starts = JSON.parse(localStorage.getItem('ctAdapt.logs'))
    .filter(({ actionType }) => actionType === 'activity_start');
  expect(starts).toHaveLength(2);
  expect(starts.map(({ data }) => data.activityPath)).toEqual([
    ActivityPath.CLASSIC,
    ActivityPath.RENATO,
  ]);
  expect(starts.every(({ data }) => data.method === 'student_choice')).toBe(true);
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

test('Renato path guides through the cards, saves a graph, and exports comparable responses', () => {
  const { unmount } = render(<App />);
  typeInto(screen.getByPlaceholderText('הכנס קוד משתתף/ת'), 'R-S01');
  choosePath('מסלול רנאטו');
  click('התחל/י');

  expect(screen.getByRole('heading', { name: 'בוחן מקדים' })).toBeInTheDocument();
  fillPreAssessment();
  expect(screen.getByRole('heading', { name: 'כלי עזר לחקירת פונקציות' })).toBeInTheDocument();
  expect(screen.getByRole('math', { name: 'f(x) = x² / (x² − 4x + 3)' })).toBeInTheDocument();
  expect(screen.getByText(/לרשותכם 30 דקות/)).toBeInTheDocument();
  typeInto(screen.getByLabelText('תחום ההגדרה שמצאת'), 'x ≠ 1, x ≠ 3');
  click('המשך/י לרמז הבא');

  expect(screen.getByRole('heading', { name: 'אסימפטוטות מקבילות לצירים' })).toBeInTheDocument();
  typeInto(screen.getByLabelText('אסימפטוטות אנכיות'), 'x = 1, x = 3');
  typeInto(screen.getByLabelText('אסימפטוטה אופקית'), 'y = 1');
  click('המשך/י לרמז הבא');

  expect(screen.getByRole('heading', { name: 'נקודות חיתוך עם הצירים' })).toBeInTheDocument();
  typeInto(screen.getByLabelText('חיתוך עם ציר y'), '(0, 0)');
  typeInto(screen.getByLabelText('חיתוך עם ציר x'), '(0, 0)');
  click('המשך/י לרמז הבא');

  expect(screen.getByRole('heading', { name: 'נקודות החשודות כנקודות קיצון' })).toBeInTheDocument();
  typeInto(screen.getByLabelText('נקודות חשודות (x)'), 'x = 0, x = 1.5');
  typeInto(screen.getByLabelText('נקודות קיצון'), 'Min (0,0), Max (1.5,-3)');
  typeInto(screen.getByLabelText("הנגזרת f'(x)"), "(-4x² + 6x)/(x² − 4x + 3)²");
  fireEvent.click(screen.getByRole('button', { name: 'לשרטוט הפונקציה ←' }));

  expect(screen.getByRole('heading', { name: 'שרטוט הפונקציה' })).toBeInTheDocument();
  const leftIntervalSign = screen.getByLabelText("f'(x) — x < 0");
  typeInto(leftIntervalSign, '-');
  fireEvent.click(screen.getByRole('button', { name: '✏️ שרטוט ביד חופשית' }));
  drawOnGraph();
  fireEvent.click(screen.getByRole('button', { name: 'רקע משובץ' }));
  expect(screen.getByRole('button', { name: 'רקע חלק' })).toHaveAttribute('aria-pressed', 'false');

  const savedSession = JSON.parse(localStorage.getItem('ctAdapt.session'));
  expect(savedSession.activityPath).toBe('renato');
  expect(savedSession.renatoWork.functionExpression).toBe('x² / (x² − 4x + 3)');
  expect(savedSession.renatoWork.cards.domain.answer).toBe('x ≠ 1, x ≠ 3');
  expect(savedSession.renatoWork.cards.asymptotes.vertical).toBe('x = 1, x = 3');
  expect(savedSession.renatoWork.table.columns[0].derivative).toBe('-');
  expect(savedSession.renatoWork.graphStrokes).toHaveLength(1);
  expect(savedSession.renatoWork.grid).toBe(false);

  unmount();
  render(<App />);
  expect(screen.getByRole('heading', { name: 'שרטוט הפונקציה' })).toBeInTheDocument();
  expect(document.querySelectorAll('.renato-student-stroke')).toHaveLength(1);
  fireEvent.click(screen.getByRole('button', { name: /תחום ההגדרה/ }));
  expect(screen.getByLabelText('תחום ההגדרה שמצאת')).toHaveValue('x ≠ 1, x ≠ 3');
  fireEvent.click(screen.getByRole('button', { name: /שרטוט הפונקציה/ }));
  expect(screen.getByRole('button', { name: 'רקע חלק' })).toHaveAttribute('aria-pressed', 'false');

  click('הגשת שרטוט וסיום');
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
    signBehavior: expect.any(Array),
    graph: { graphStrokes: expect.any(Array) },
  });
  expect(renatoCompletion.data.assessment.signBehavior).toHaveLength(9);
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
