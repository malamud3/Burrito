import React from 'react';
import LearningScreen from '../layout/LearningScreen';
import StatCard from './StatCard';
import SegmentedTabs from '../ui/SegmentedTabs';
import ResearcherHeader from './ResearcherHeader';
import ResearcherTabContent from './ResearcherTabContent';

export default function ResearcherDashboardView({
  studentId,
  stats,
  logs,
  activeTab,
  tabs,
  onTabChange,
  onExportJSON,
  onExportCSV,
  onExportAssessmentScores,
  onReload,
}) {
  return (
    <LearningScreen wide className="dashboard-screen">
      <ResearcherHeader
        studentId={studentId}
        onExportJSON={onExportJSON}
        onExportCSV={onExportCSV}
        onExportAssessmentScores={onExportAssessmentScores}
        onReload={onReload}
      />
      <div className="dashboard-grid">
        {stats.map((stat) => (
          <StatCard key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </div>
      <p className="study-protocol-note">
        הנתונים וההקצאות נשמרים בדפדפן זה. ייצאו גיבוי לפני ניקוי נתוני הדפדפן;
        כל סשני המשתתפים נשמרים יחד בלוגים.
      </p>
      <SegmentedTabs
        tabs={tabs}
        value={activeTab}
        onChange={onTabChange}
        aria-label="לשוניות לוח הבקרה"
      />
      <ResearcherTabContent activeTab={activeTab} logs={logs} />
    </LearningScreen>
  );
}
