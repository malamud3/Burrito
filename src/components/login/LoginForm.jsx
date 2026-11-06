import React from 'react';
import { Mode } from '../../core/types/enums';
import TextInputField from '../form/TextInputField';
import SelectField from '../form/SelectField';
import ScreenActions from '../layout/ScreenActions';
import ActionButton from '../ui/ActionButton';
import LoginPathPicker from './LoginPathPicker';
import LoginResearchNotice from './LoginResearchNotice';

const MODE_OPTIONS = [
  { value: Mode.STUDENT, label: 'תלמיד/ה' },
  { value: Mode.RESEARCHER, label: 'חוקר/ת — לוח בקרה' },
];

export default function LoginForm({
  durationMinutes,
  studentId,
  mode,
  activityPath,
  showPathPicker,
  onStudentIdChange,
  onModeChange,
  onActivityPathChange,
  onStart,
}) {
  return (
    <section className="card login-card" aria-labelledby="login-form-title">
      <div className="login-card-heading">
        <span className="login-form-eyebrow">הכניסה למרחב שלך</span>
        <h2 id="login-form-title">מתחילים כאן</h2>
      </div>
      <p className="login-subtitle">
        הזינו קוד ובחרו מסלול למידה. לאחר הבוחן המקדים תתחיל הפעילות במסלול שבחרתם.
      </p>

      <TextInputField
        id="student-id"
        className="login-field login-id-field"
        label="קוד תלמיד/ה"
        type="text"
        dir="auto"
        value={studentId}
        onChange={onStudentIdChange}
        onKeyDown={(event) => event.key === 'Enter' && onStart()}
        placeholder="הכנס קוד משתתף/ת"
      />

      {showPathPicker && (
        <LoginPathPicker value={activityPath} onChange={onActivityPathChange} />
      )}

      <SelectField
        id="mode"
        className="login-field login-mode-field"
        label="כניסה בתור"
        value={mode}
        options={MODE_OPTIONS}
        onChange={onModeChange}
      />

      {mode === Mode.STUDENT && (
        <LoginResearchNotice durationMinutes={durationMinutes} />
      )}

      <ScreenActions className="login-actions">
        <ActionButton onClick={onStart}>
          {mode === Mode.STUDENT ? 'התחל/י בוחן מקדים' : 'פתח/י לוח בקרה'}
        </ActionButton>
      </ScreenActions>
    </section>
  );
}
