import React from 'react';
import ScreenCard from '../layout/ScreenCard';
import LogPanel from './LogPanel';
import StudentTimeline from './StudentTimeline';
import AssessmentScoringPanel from './AssessmentScoringPanel';

export default function ResearcherTabContent({ activeTab, logs }) {
  return (
    <ScreenCard>
      {activeTab === 'log' && <LogPanel logs={logs} />}
      {activeTab === 'timeline' && (
        <section className="dashboard-timeline-panel">
          <h3 className="dashboard-timeline-title">ציר זמן — משך זמן בכל שלב</h3>
          <StudentTimeline logs={logs} />
        </section>
      )}
      {activeTab === 'scoring' && <AssessmentScoringPanel logs={logs} />}
    </ScreenCard>
  );
}
