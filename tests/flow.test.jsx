import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, expect, test } from 'vitest';
import App from '../src/app/App';

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, '', '/');
});

test('student login starts the shared pre-assessment without path selection', () => {
  render(<App />);
  fireEvent.change(screen.getByPlaceholderText('הכנס קוד משתתף/ת'), {
    target: { value: 'R01' },
  });
  fireEvent.click(screen.getByRole('button', { name: /התחל\/י בוחן מקדים/ }));

  expect(screen.getByRole('heading', { name: 'בוחן מקדים' })).toBeInTheDocument();
  expect(screen.queryByRole('radio')).not.toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('ctAdapt.session')).activityPath).toBe('renato');
});

test('researcher login opens the dashboard directly', () => {
  render(<App />);
  fireEvent.change(screen.getByPlaceholderText('הכנס קוד משתתף/ת'), {
    target: { value: 'researcher' },
  });
  fireEvent.change(screen.getByLabelText('כניסה בתור'), {
    target: { value: 'researcher' },
  });
  fireEvent.click(screen.getByRole('button', { name: /פתח\/י לוח בקרה/ }));

  expect(window.location.pathname).toBe('/researcher');
});
