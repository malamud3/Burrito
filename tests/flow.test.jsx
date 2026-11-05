import React from 'react';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import App from '../src/app/App';
import AppProviders from '../src/context/AppProviders';
import { useSessionContext } from '../src/context/SessionContext';
import { useLogContext } from '../src/context/LogContext';

const click = (name) => fireEvent.click(screen.getByRole('button', { name: new RegExp(name) }));
const typeInto = (el, value) => fireEvent.change(el, { target: { value } });

test('full adaptive student flow with help request → analog → hints → transfer → effort → completion', async () => {
  vi.useFakeTimers();
  render(<App />);

  // login validation
  click('התחל/י');
  expect(screen.getByText('נא להזין קוד תלמיד/ה')).toBeInTheDocument();

  typeInto(screen.getByPlaceholderText('הכנס קוד משתתף/ת'), 'S01');
  const [groupSel] = screen.getAllByRole('combobox');
  typeInto(groupSel, 'adaptive');
  click('התחל/י');

  // problem → solving
  click('מוכן/ה להתחיל לפתור');
  expect(screen.getByText('פירוק הבעיה לתתי-משימות')).toBeInTheDocument();
  expect(screen.getByText('זיהוי המידע הרלוונטי')).toBeInTheDocument();
  expect(screen.getAllByRole('combobox').length).toBe(7); // abstraction rows seeded

  // mark 3 wrong in abstraction (relevant rows marked "לא") → detection on submit
  const selects = screen.getAllByRole('combobox');
  [0, 1, 2].forEach((i) => typeInto(selects[i], 'לא'));
  typeInto(screen.getByPlaceholderText('כתוב/י כאן את הפתרון שלך...'), 'תשובה שגויה');
  click('שלח/י תשובה');
  expect(screen.getByText('המערכת זיהתה נקודה שכדאי לחזק')).toBeInTheDocument();

  act(() => { vi.advanceTimersByTime(1600); });
  expect(screen.getByText(/נראה שיש קושי בזיהוי הנתונים החשובים/)).toBeInTheDocument();

  click('בוא/י נתחיל');
  expect(screen.getByText('משימת תמיכה — הפשטה')).toBeInTheDocument(); // adaptive → abstraction analog

  // empty analog answer blocked
  click('סיימתי את המשימה');
  expect(screen.getByText('נא לכתוב תשובה לפני המשך')).toBeInTheDocument();
  typeInto(screen.getByPlaceholderText('כתוב/י את הפתרון...'), 'פתרון אנלוגי');
  click('סיימתי את המשימה');

  // return screen with graduated hints
  expect(screen.getByRole('heading', { name: '🔁 חזרה לבעיה המקורית' })).toBeInTheDocument();
  expect(screen.getByText('רמה 0 — ללא רמז')).toBeInTheDocument();
  click('אני צריך/ה רמז נוסף');
  expect(screen.getByText(/האם גם כאן יש נתונים שמסיחים/)).toBeInTheDocument();
  click('אני צריך/ה רמז נוסף');
  expect(screen.getByText(/שמות, טלפונים, שעות/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /אני צריך\/ה רמז נוסף/ })).toBeDisabled();

  typeInto(screen.getByPlaceholderText('הפתרון המתוקן שלי...'), 'מתוקן');
  click('שלח/י תשובה מתוקנת');

  // transfer
  typeInto(screen.getByPlaceholderText('כתוב/י את הפתרון המלא...'), 'פתרון העברה');
  click('שלח/י ועבור/י לדירוג מאמץ');

  // effort: 3 scales (analog included)
  expect(screen.getByRole('heading', { name: '📊 משימת התמיכה האנלוגית' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /סיום/ })).toBeDisabled();
  const scales = document.querySelectorAll('.effort-scale');
  expect(scales.length).toBe(3);
  scales.forEach((s) => fireEvent.click(within(s).getByText('5')));
  click('סיום');

  expect(screen.getByText('סיימת! תודה רבה!')).toBeInTheDocument();
  click('צפייה בנתונים');
  expect(screen.getByRole('heading', { name: '📊 לוח בקרה — חוקר/ת' })).toBeInTheDocument();
  expect(screen.getByText(/difficulty_detected/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('tab', { name: 'זיהוי קשיים' }));
  expect(screen.getByText('אירועי זיהוי')).toBeInTheDocument();
  vi.useRealTimers();
});

test('help request with no rule fired still routes to an analog task', () => {
  vi.useFakeTimers();
  render(<App />);
  typeInto(screen.getByPlaceholderText('הכנס קוד משתתף/ת'), 'S02');
  typeInto(screen.getAllByRole('combobox')[0], 'fixed');
  click('התחל/י');
  click('מוכן/ה להתחיל לפתור');
  click('אני צריך/ה עזרה');
  act(() => { vi.advanceTimersByTime(1100); });
  expect(screen.getByText('המערכת זיהתה נקודה שכדאי לחזק')).toBeInTheDocument();
  click('בוא/י נתחיל');
  // fixed group → rotation index 0 → decomposition task regardless of skill
  expect(screen.getByText('משימת תמיכה — פירוק')).toBeInTheDocument();
  vi.useRealTimers();
});

test('clean answer with no difficulty skips straight to transfer', () => {
  render(<App />);
  typeInto(screen.getByPlaceholderText('הכנס קוד משתתף/ת'), 'S03');
  typeInto(screen.getAllByRole('combobox')[0], 'adaptive');
  click('התחל/י');
  click('מוכן/ה להתחיל לפתור');
  typeInto(screen.getByPlaceholderText('כתוב/י כאן את הפתרון שלך...'), 'פתרון');
  click('שלח/י תשובה');
  expect(screen.getByRole('heading', { name: '🚀 משימה חדשה' })).toBeInTheDocument();
});

test('researcher mode opens the dashboard with empty-state', () => {
  render(<App />);
  typeInto(screen.getByPlaceholderText('הכנס קוד משתתף/ת'), 'R1');
  const [groupSel, modeSel] = screen.getAllByRole('combobox');
  typeInto(groupSel, 'adaptive');
  typeInto(modeSel, 'researcher');
  click('התחל/י');
  expect(screen.getByRole('heading', { name: '📊 לוח בקרה — חוקר/ת' })).toBeInTheDocument();
});

test('session and logs restore from localStorage after reload', () => {
  localStorage.setItem('ctAdapt.session', JSON.stringify({
    studentId: 'S99',
    group: 'adaptive',
    mode: 'student',
    isActive: true,
    answers: { main: 'saved answer' },
  }));
  localStorage.setItem('ctAdapt.logs', JSON.stringify([
    { id: 'log-1', actionType: 'edit', skill: 'decomposition', data: { value: 'saved' } },
  ]));

  function SessionProbe() {
    const { session } = useSessionContext();
    const { logs } = useLogContext();
    return (
      <div>
        <span data-testid="student-id">{session.studentId}</span>
        <span data-testid="log-count">{logs.length}</span>
      </div>
    );
  }

  render(
    <AppProviders>
      <SessionProbe />
    </AppProviders>,
  );

  expect(screen.getByTestId('student-id')).toHaveTextContent('S99');
  expect(screen.getByTestId('log-count')).toHaveTextContent('1');
});
