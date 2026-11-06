import React from 'react';
import ActionButton from '../ui/ActionButton';

export default function AnalogMissingTask({ onBack }) {
  return (
    <section className="card analog-missing-state" role="alert">
      <p>שגיאה: לא נבחרה משימת תמיכה.</p>
      <div className="btn-group analog-missing-actions">
        <ActionButton tone="outline" onClick={onBack}>
          חזרה לפתרון
        </ActionButton>
      </div>
    </section>
  );
}
