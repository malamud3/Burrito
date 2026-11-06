import React from 'react';
import ActionButton from '../ui/ActionButton';
import AppBadge from '../ui/AppBadge';

export default function ResearcherHeader({
  studentId,
  onExportJSON,
  onExportCSV,
  onExportAssessmentScores,
  onReload,
}) {
  return (
    <header className="app-header">
      <h1>📊 לוח בקרה — חוקר/ת</h1>
      <div className="header-info">
        <AppBadge>{studentId}</AppBadge>
        <ActionButton tone="outline" size="small" onClick={onExportJSON}>
          ⬇️ הורד לוגים
        </ActionButton>
        <ActionButton tone="outline" size="small" onClick={onExportCSV}>
          ⬇️ הורד CSV
        </ActionButton>
        <ActionButton tone="outline" size="small" onClick={onExportAssessmentScores}>
          ⬇️ הורד ציוני בוחנים
        </ActionButton>
        <ActionButton tone="outline" size="small" onClick={onReload}>
          ↺ משתתף/ת חדש/ה
        </ActionButton>
      </div>
    </header>
  );
}
