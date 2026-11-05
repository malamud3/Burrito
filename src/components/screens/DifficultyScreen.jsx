import React from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import { CT_SKILL_CONFIG } from '../../core/constants/ctSkills';
import ProgressBar from '../layout/ProgressBar';

export default function DifficultyScreen() {
  const { session } = useSessionContext();
  const { goToAnalog } = usePhaseNavigation();

  const skillConfig = session.detectedDifficulty
    ? CT_SKILL_CONFIG[session.detectedDifficulty.skill]
    : null;

  return (
    <div className="container">
      <ProgressBar />

      <div className="card" style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔎</div>
        <h2>המערכת זיהתה נקודה שכדאי לחזק</h2>
        <p style={{ fontSize: '1.05rem', margin: '16px 0', color: 'var(--text2)' }}>
          {skillConfig?.difficultyMessage ||
            'בוא/י ננסה משימה שתעזור לך להתקדם.'}
        </p>
        <p style={{ color: 'var(--text2)' }}>
          לפני שנחזור לבעיה, בוא/י ננסה משימה קצרה שתעזור לך.
        </p>
        <div className="btn-group" style={{ justifyContent: 'center', marginTop: 24 }}>
          <button className="btn btn-primary" onClick={goToAnalog}>
            בוא/י נתחיל ←
          </button>
        </div>
      </div>
    </div>
  );
}
