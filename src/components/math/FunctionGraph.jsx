import React, { useRef, useState } from 'react';

const GRAPH_WIDTH = 700;
const GRAPH_HEIGHT = 420;

function graphCoordinates(x, y) {
  return { x: (x + 3.5) * 70, y: (4.5 - y) * 42 };
}

export default function FunctionGraph({ work, onUpdate }) {
  const [showCrossingNote, setShowCrossingNote] = useState(false);
  const [draftStroke, setDraftStroke] = useState('');
  const strokeRef = useRef('');
  const isDrawing = useRef(false);
  const getGraphPoint = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const width = bounds.width || GRAPH_WIDTH;
    const height = bounds.height || GRAPH_HEIGHT;
    const x = ((event.clientX - bounds.left) / width) * GRAPH_WIDTH;
    const y = ((event.clientY - bounds.top) / height) * GRAPH_HEIGHT;
    return {
      x: Math.max(0, Math.min(GRAPH_WIDTH, x)),
      y: Math.max(0, Math.min(GRAPH_HEIGHT, y)),
    };
  };

  const startDrawing = (event) => {
    if (!work.drawMode || (event.button !== undefined && event.button !== 0)) return;
    const { x, y } = getGraphPoint(event);
    isDrawing.current = true;
    strokeRef.current = `M ${x.toFixed(1)} ${y.toFixed(1)}`;
    setDraftStroke(strokeRef.current);
    if (event.currentTarget.setPointerCapture && Number.isInteger(event.pointerId)) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const continueDrawing = (event) => {
    if (!isDrawing.current) return;
    const { x, y } = getGraphPoint(event);
    strokeRef.current += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    setDraftStroke(strokeRef.current);
  };

  const finishDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const completedStroke = strokeRef.current;
    strokeRef.current = '';
    setDraftStroke('');
    if (completedStroke.includes(' L ')) {
      onUpdate({ graphStrokes: [...(work.graphStrokes || []), completedStroke] });
    }
  };

  return (
    <section className="renato-panel renato-graph-panel">
      <div className="renato-panel-heading">
        <div>
          <h2>שרטוט הפונקציה</h2>
          <p>שרטטו את הפונקציה על מערכת הצירים לפי המסקנות שלכם.</p>
        </div>
        <div className="renato-graph-controls">
          <button
            className="renato-secondary-button"
            onClick={() => onUpdate({ grid: !work.grid })}
            aria-pressed={work.grid}
          >
            {work.grid ? 'רקע משובץ' : 'רקע חלק'}
          </button>
          <button
            className="renato-secondary-button"
            onClick={() => onUpdate({
              graphAsymptoteStyle: work.graphAsymptoteStyle === 'dashed' ? 'solid' : 'dashed',
            })}
          >
            אסימפטוטה אנכית: {work.graphAsymptoteStyle === 'dashed' ? 'קו מקווקו' : 'קו מלא'}
          </button>
        </div>
      </div>

      <div className="renato-plot-steps">
        <button
          className={`renato-secondary-button${work.drawMode ? ' is-active' : ''}`}
          onClick={() => onUpdate({ drawMode: !work.drawMode })}
          aria-pressed={Boolean(work.drawMode)}
        >
          {work.drawMode ? 'סיום שרטוט' : '✏️ שרטוט ביד חופשית'}
        </button>
        <button
          className="renato-secondary-button"
          onClick={() => onUpdate({ graphStrokes: [] })}
          disabled={!(work.graphStrokes || []).length}
        >
          ניקוי השרטוט
        </button>
        <button
          className="renato-help-button"
          onClick={() => setShowCrossingNote((shown) => !shown)}
          aria-expanded={showCrossingNote}
        >
          האם מותר לחצות אסימפטוטה אופקית?
        </button>
      </div>

      {showCrossingNote && (
        <p className="renato-crossing-note">
          כן. אסימפטוטה אופקית מתארת את התנהגות הפונקציה כאשר x שואף לאינסוף;
          הגרף יכול לחצות אותה בתוך תחום ההגדרה.
        </p>
      )}

      <svg
        className={`renato-drawing-board${work.grid ? ' is-gridded' : ''}${work.drawMode ? ' is-drawing' : ''}`}
        direction="ltr"
        viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
        role="img"
        aria-label="לוח שרטוט הפונקציה. במצב שרטוט, ציירו על הלוח עם העכבר או האצבע."
        onPointerDown={startDrawing}
        onPointerMove={continueDrawing}
        onPointerUp={finishDrawing}
        onPointerCancel={finishDrawing}
      >
        <defs>
          <pattern id="function-graph-small-grid" width="17.5" height="21" patternUnits="userSpaceOnUse">
            <path d="M 17.5 0 L 0 0 0 21" className="renato-grid-line" />
          </pattern>
          <pattern id="function-graph-major-grid" width="70" height="42" patternUnits="userSpaceOnUse">
            <rect width="70" height="42" fill="url(#function-graph-small-grid)" />
            <path d="M 70 0 L 0 0 0 42" className="renato-grid-major-line" />
          </pattern>
        </defs>
        {work.grid && <rect width={GRAPH_WIDTH} height={GRAPH_HEIGHT} fill="url(#function-graph-major-grid)" />}
        <line x1="15" y1="189" x2="685" y2="189" className="renato-axis" />
        <polygon points="690,189 680,184 680,194" className="renato-axis-arrow" />
        <polygon points="10,189 20,184 20,194" className="renato-axis-arrow" />
        <line x1="245" y1="12" x2="245" y2="408" className="renato-axis" />
        <polygon points="245,7 240,17 250,17" className="renato-axis-arrow" />
        <polygon points="245,413 240,403 250,403" className="renato-axis-arrow" />
        <text x="675" y="178" className="renato-axis-label">x</text>
        <text x="256" y="22" className="renato-axis-label">y</text>
        {[-3, -2, -1, 1, 2, 3, 4, 5, 6].map((x) => {
          const point = graphCoordinates(x, 0);
          return (
            <g key={`xtick-${x}`}>
              <line x1={point.x} y1="185" x2={point.x} y2="193" className="renato-tick" />
              <text x={point.x} y="205" className="renato-tick-label" textAnchor="middle">{x}</text>
            </g>
          );
        })}
        {[-5, -4, -3, -2, -1, 1, 2, 3, 4].map((y) => {
          const point = graphCoordinates(0, y);
          return (
            <g key={`ytick-${y}`}>
              <line x1="241" y1={point.y} x2="249" y2={point.y} className="renato-tick" />
              <text x="233" y={point.y + 3} className="renato-tick-label" textAnchor="end">{y}</text>
            </g>
          );
        })}
        {(work.graphStrokes || []).map((stroke, index) => (
          <path key={`student-stroke-${index}`} d={stroke} className="renato-student-stroke" />
        ))}
        {draftStroke && <path d={draftStroke} className="renato-student-stroke is-draft" />}
      </svg>
      <p className="renato-drawing-hint">
        {work.drawMode
          ? 'מצב שרטוט פעיל — ציירו על מערכת הצירים; השרטוט נשמר אוטומטית.'
          : 'לחצו על „שרטוט ביד חופשית” כדי לצייר על מערכת הצירים.'}
      </p>
    </section>
  );
}
