import React, { useState } from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { LogActionType } from '../../core/types/enums';
import { RENATO_FUNCTION, RENATO_TABLE_COLUMNS } from '../../core/constants/renato';
import { useLogger } from '../../hooks/useLogger';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import ProgressBar from '../layout/ProgressBar';

const CARD_DEFINITIONS = [
  {
    id: 'domain',
    title: 'תחום ההגדרה',
    description: 'מהו תחום ההגדרה של הפונקציה?',
    fields: [{ key: 'answer', label: 'תשובה', placeholder: 'x ≠ 1, x ≠ 3' }],
    button: 'חשב והזן',
    notes: [
      'x² − 4x + 3 ≠ 0',
      '(x − 1)(x − 3) ≠ 0',
      'x ≠ 1, x ≠ 3',
    ],
  },
  {
    id: 'extrema',
    title: 'נקודות החשודות כנקודות קיצון',
    description: 'מציאת נקודות חשודות ובדיקת שינוי סימן הנגזרת',
    fields: [
      { key: 'suspectedX', label: 'נקודות חשודות (x)', placeholder: 'x = 0, x = 1.5' },
      { key: 'points', label: 'נקודות קיצון (לאחר הטבלה)', placeholder: 'Min (0, 0), Max (1.5, −3)' },
      { key: 'derivative', label: "הנגזרת f'(x)", placeholder: '(-4x² + 6x) / (x² − 4x + 3)²' },
    ],
    checkDomain: true,
    button: 'גזור וחשב',
    notes: [
      "f'(x) = [2x(x² − 4x + 3) − x²(2x − 4)] / (x² − 4x + 3)²",
      "f'(x) = (-4x² + 6x) / (x² − 4x + 3)²",
      '−4x² + 6x = 0  ⇒  x = 0, x = 1.5',
      'את סוג הקיצון קובעים לפי שינוי סימן הנגזרת בטבלה.',
    ],
  },
  {
    id: 'asymptotes',
    title: 'אסימפטוטות מקבילות לצירים',
    description: 'אסימפטוטות אנכיות ואופקיות',
    fields: [
      { key: 'vertical', label: 'אסימפטוטות אנכיות', placeholder: 'x = 1, x = 3' },
      { key: 'horizontal', label: 'אסימפטוטה אופקית', placeholder: 'y = 1' },
    ],
    checkDomain: true,
    button: 'חשב והזן',
    notes: [
      'אנכיות: המכנה מתאפס ב־x = 1 וב־x = 3; המונה אינו מתאפס שם.',
      'אופקית: דרגות המונה והמכנה שוות, ולכן יחס המקדמים הוא 1/1.',
      'y = 1 היא אסימפטוטה אופקית; הגרף יכול לחצות אותה בתוך תחום ההגדרה.',
    ],
  },
  {
    id: 'intercepts',
    title: 'נקודות חיתוך עם הצירים',
    description: 'בחיתוך עם y מציבים x = 0; בחיתוך עם x משווים y ל־0',
    fields: [
      { key: 'yAxis', label: 'חיתוך עם ציר y (x = 0)', placeholder: '(0, 0)' },
      { key: 'xAxis', label: 'חיתוך עם ציר x (y = 0)', placeholder: '(0, 0)' },
    ],
    checkDomain: true,
    button: 'חשב ושמור במטמון',
    notes: [
      'x = 0  ⇒  f(0) = 0² / (0² − 4·0 + 3) = 0  ⇒  (0, 0)',
      'y = 0  ⇒  x² / (x² − 4x + 3) = 0  ⇒  x = 0  ⇒  (0, 0)',
    ],
  },
];

const GRAPH_WIDTH = 700;
const GRAPH_HEIGHT = 420;
const GRAPH_DOMAINS = [
  { id: 1, label: 'תחום 1', interval: 'x ≤ 0', description: 'יורדת עד Min (0, 0)' },
  { id: 2, label: 'תחום 2', interval: '0 < x < 1', description: 'עולה וחוצה את y = 1' },
  { id: 3, label: 'תחום 3', interval: '1 < x < 3', description: 'עולה ל־Max ואז יורדת' },
  { id: 4, label: 'תחום 4', interval: 'x > 3', description: 'יורדת ומתקרבת ל־y = 1' },
];

function graphCoordinates(x, y) {
  return {
    x: (x + 3.5) * 70,
    y: (4.5 - y) * 42,
  };
}

function functionPath(from, to, step) {
  const points = [];
  for (let x = from; x <= to + step / 2; x += step) {
    const y = (x * x) / (x * x - 4 * x + 3);
    const point = graphCoordinates(x, y);
    if (point.y >= 8 && point.y <= GRAPH_HEIGHT - 8) {
      points.push(`${points.length ? 'L' : 'M'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`);
    }
  }
  return points.join(' ');
}

function RenatoCard({ definition, value, onChange, onSolve }) {
  const { id, title, description, fields, checkDomain, button, notes } = definition;
  return (
    <article className={`renato-card renato-card-${id}`}>
      <header className="renato-card-heading">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <label className="renato-order">
          <span>סדר שלב</span>
          <input
            type="number"
            min="1"
            max="4"
            aria-label={`סדר פתרון: ${title}`}
            value={value.order}
            onChange={(event) => onChange(id, 'order', event.target.value)}
          />
        </label>
      </header>
      <div className="renato-card-fields">
        {fields.map(({ key, label, placeholder }) => (
          <label className="renato-field" key={key}>
            <span>{label}</span>
            <textarea
              rows="1"
              dir="ltr"
              aria-label={label}
              placeholder={placeholder}
              value={value[key]}
              onChange={(event) => onChange(id, key, event.target.value)}
            />
          </label>
        ))}
        <button className="renato-solve-button" onClick={() => onSolve(id)}>
          {button}
        </button>
      </div>
      <details className="renato-scratchpad" open={id === 'domain'}>
        <summary>דף טיוטה ודרך הפתרון</summary>
        <div className="renato-scratchpad-content" dir="ltr">
          {notes.map((note) => <p key={note}>{note}</p>)}
        </div>
      </details>
      {checkDomain && (
        <label className="renato-checkbox">
          <input
            type="checkbox"
            checked={value.checked}
            onChange={(event) => onChange(id, 'checked', event.target.checked)}
          />
          <span>בדקתי התאמה לתחום ההגדרה</span>
        </label>
      )}
    </article>
  );
}

function FunctionTable({ columns, values, onChange, onFillCorrect, tableErrors }) {
  const derivativeOptions = ['', '+', '-', '0', '///'];
  const behaviorOptions = ['', '↗', '↘', 'Min', 'Max', '///'];
  return (
    <section className="renato-panel renato-table-panel">
      <div className="renato-panel-heading">
        <div>
          <h2>טבלה — איסוף וזיהוי תבניות</h2>
          <p>שורה 1: ערכי x • שורה 2: סימן הנגזרת • שורה 3: התנהגות הפונקציה</p>
        </div>
        <button className="renato-secondary-button" onClick={onFillCorrect}>
          מלא טבלה תקינה
        </button>
      </div>
      {tableErrors.length > 0 && (
        <p className="renato-table-alert" role="status">
          קיימת אי־התאמה בטבלה. בדקו את התאים המסומנים.
        </p>
      )}
      <div className="renato-table-scroll" dir="ltr">
        <table className="renato-table">
          <thead>
            <tr>
              <th scope="col">x</th>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={column.isPoint ? 'is-critical-point' : ''}
                >
                  {!column.isPoint && <small>x = {column.testX}</small>}
                  <span>{column.xLabel}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { field: 'derivative', label: "f'(x)", options: derivativeOptions },
              { field: 'behavior', label: 'f(x)', options: behaviorOptions },
            ].map(({ field, label, options }) => (
              <tr key={field}>
                <th scope="row">{label}</th>
                {columns.map((column) => {
                  const value = values[column.id]?.[field] || '';
                  const expected = column[field];
                  const invalid = value !== '' && value !== expected;
                  return (
                    <td
                      key={column.id}
                      className={`${column.isPoint ? 'is-critical-point ' : ''}${invalid ? 'is-invalid' : ''}${value === '///' ? ' is-undefined' : ''}`}
                    >
                      <select
                        aria-label={`${label} — ${column.xLabel}`}
                        value={value}
                        onChange={(event) => onChange(column.id, field, event.target.value)}
                      >
                        {options.map((option) => (
                          <option key={option || 'empty'} value={option}>
                            {option || '?'}
                          </option>
                        ))}
                      </select>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="renato-domain-links">
        {GRAPH_DOMAINS.map(({ id, label, interval, description }) => (
          <div className="renato-domain-link" key={id}>
            <b>{label} ({interval})</b>
            <span>{description}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FunctionGraph({ work, onUpdate }) {
  const [showCrossingNote, setShowCrossingNote] = useState(false);
  const graphPathDefinitions = {
    1: [-3.4, 0, 0.05],
    2: [0, 0.84, 0.02],
    3: [1.18, 2.75, 0.03],
    4: [3.52, 6.4, 0.05],
  };

  const toggleDomain = (id) => {
    onUpdate({ drawnDomains: { ...work.drawnDomains, [id]: !work.drawnDomains[id] } });
  };

  return (
    <section className="renato-panel renato-graph-panel">
      <div className="renato-panel-heading">
        <div>
          <h2>גרף הפונקציה — צומת סנכרון</h2>
          <p>1. סמנו מאפיינים על הצירים  2–3. בחרו תחום ושרטטו את ענף הפונקציה</p>
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
          className="renato-secondary-button"
          onClick={() => onUpdate({ graphMarkers: !work.graphMarkers })}
          aria-pressed={work.graphMarkers}
        >
          שלב 1: {work.graphMarkers ? 'הסתרת' : 'סימון'} אסימפטוטות ונקודות
        </button>
        <span>שלבים 2–3: שרטוט לפי תחום</span>
        {GRAPH_DOMAINS.map(({ id }) => (
          <button
            key={id}
            className={`renato-domain-button${work.drawnDomains[id] ? ' is-selected' : ''}`}
            onClick={() => toggleDomain(id)}
            aria-pressed={work.drawnDomains[id]}
          >
            תחום {id}{work.drawnDomains[id] ? ' ✓' : ''}
          </button>
        ))}
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
          הגרף יכול לחצות אותה בתוך תחום ההגדרה. כאן הוא חוצה את y = 1 בנקודה (0.75, 1).
        </p>
      )}

      <svg
        className={`renato-drawing-board${work.grid ? ' is-gridded' : ''}`}
        direction="ltr"
        viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
        role="img"
        aria-label="גרף הפונקציה עם צירים, אסימפטוטות וארבעה תחומים לשרטוט"
      >
        <defs>
          <pattern id="renato-small-grid" width="17.5" height="21" patternUnits="userSpaceOnUse">
            <path d="M 17.5 0 L 0 0 0 21" className="renato-grid-line" />
          </pattern>
          <pattern id="renato-major-grid" width="70" height="42" patternUnits="userSpaceOnUse">
            <rect width="70" height="42" fill="url(#renato-small-grid)" />
            <path d="M 70 0 L 0 0 0 42" className="renato-grid-major-line" />
          </pattern>
        </defs>
        {work.grid && <rect width={GRAPH_WIDTH} height={GRAPH_HEIGHT} fill="url(#renato-major-grid)" />}
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
        {work.graphMarkers && (
          <g className="renato-graph-features">
            {[1, 3].map((x) => {
              const point = graphCoordinates(x, 0);
              return (
                <g key={`vertical-${x}`}>
                  <line
                    x1={point.x}
                    y1="15"
                    x2={point.x}
                    y2="405"
                    className={`renato-asymptote${work.graphAsymptoteStyle === 'dashed' ? ' is-dashed' : ''}`}
                  />
                  <text x={point.x - 4} y="45" className="renato-feature-label" textAnchor="end">x = {x}</text>
                </g>
              );
            })}
            <line x1="20" y1="147" x2="680" y2="147" className="renato-asymptote is-dashed" />
            <text x="665" y="140" className="renato-feature-label" textAnchor="end">y = 1</text>
            <circle cx="245" cy="189" r="5" className="renato-extremum-point" />
            <text x="235" y="206" className="renato-feature-label" textAnchor="end">Min (0, 0)</text>
            <circle cx="350" cy="315" r="5" className="renato-extremum-point" />
            <text x="350" y="305" className="renato-feature-label" textAnchor="middle">Max (1.5, −3)</text>
          </g>
        )}
        {Object.entries(graphPathDefinitions).map(([domainId, [from, to, step]]) => (
          work.drawnDomains[domainId] && (
            <path
              key={`domain-${domainId}`}
              d={functionPath(from, to, step)}
              className="renato-function-curve"
            />
          )
        ))}
        {work.drawnDomains[2] && (
          <circle cx={(0.75 + 3.5) * 70} cy="147" r="4" className="renato-crossing-point" />
        )}
      </svg>
    </section>
  );
}

export default function RenatoScreen() {
  const { session, updateRenatoWork } = useSessionContext();
  const { log } = useLogger();
  const { goToCompletion } = usePhaseNavigation();
  const [showSignHelper, setShowSignHelper] = useState(false);
  const [selectedHelperColumn, setSelectedHelperColumn] = useState('left-of-zero');
  const work = session.renatoWork;
  const columns = RENATO_TABLE_COLUMNS;
  const tableValues = Object.fromEntries(
    work.table.columns.map(({ id, ...values }) => [id, values]),
  );

  const updateCard = (cardId, field, value) => {
    updateRenatoWork({
      cards: {
        ...work.cards,
        [cardId]: { ...work.cards[cardId], [field]: value },
      },
    });
    log(LogActionType.EDIT, { field: `renato.${cardId}.${field}`, value });
  };

  const updateTableCell = (columnId, field, value) => {
    const columnsWithUpdate = work.table.columns.map((column) =>
      column.id === columnId ? { ...column, [field]: value } : column,
    );
    updateRenatoWork({ table: { ...work.table, columns: columnsWithUpdate } });
    const definition = columns.find((column) => column.id === columnId);
    const isCorrect = value === definition[field];
    log(LogActionType.EDIT, {
      field: `renato.table.${columnId}.${field}`,
      value,
      expected: definition[field],
      isCorrect,
    });
  };

  const updateGraph = (patch) => {
    updateRenatoWork(patch);
    log(LogActionType.EDIT, {
      field: 'renato.graph',
      ...patch,
    });
  };

  const solveCard = (cardId) => {
    const solvedAnswers = {
      domain: { answer: 'x ≠ 1, x ≠ 3' },
      extrema: {
        suspectedX: 'x = 0, x = 1.5',
        points: 'Min (0, 0), Max (1.5, −3)',
        derivative: "f'(x) = (-4x² + 6x) / (x² − 4x + 3)²",
        checked: true,
      },
      asymptotes: { vertical: 'x = 1, x = 3', horizontal: 'y = 1', checked: true },
      intercepts: { yAxis: '(0, 0)', xAxis: '(0, 0)', checked: true },
    };
    updateRenatoWork({
      cards: {
        ...work.cards,
        [cardId]: { ...work.cards[cardId], ...solvedAnswers[cardId] },
      },
      ...(cardId === 'intercepts'
        ? {
          valueCache: { ...work.valueCache, 0: '0' },
          cacheNotification: 'נשמר בזיכרון המטמון: f(0) = 0.',
        }
        : cardId === 'extrema'
          ? {
            valueCache: { ...work.valueCache, 0: '0', 1.5: '-3' },
            cacheNotification: work.valueCache[0] !== undefined
              ? 'f(0) = 0 נשלף מהמטמון; f(1.5) = −3 חושב.'
              : work.cacheNotification,
          }
          : {}),
      ...(cardId === 'domain'
        ? {
          table: {
            ...work.table,
            columns: work.table.columns.map((column) =>
              column.id === 'one' || column.id === 'three'
                ? { ...column, derivative: '///', behavior: '///' }
                : column,
            ),
          },
        }
        : {}),
    });
    log(LogActionType.EDIT, { field: `renato.${cardId}.solve`, value: solvedAnswers[cardId] });
  };

  const fillCorrectTable = () => {
    updateRenatoWork({
      table: {
        ...work.table,
        columns: columns.map((column) => ({
          id: column.id,
          derivative: column.derivative,
          behavior: column.behavior,
        })),
      },
    });
    log(LogActionType.EDIT, { field: 'renato.table.fillCorrect' });
  };

  const tableErrors = columns.filter((column) => {
    const value = tableValues[column.id] || {};
    return (
      (value.derivative && value.derivative !== column.derivative) ||
      (value.behavior && value.behavior !== column.behavior)
    );
  });
  const activeHelperColumn =
    columns.find((column) => column.id === selectedHelperColumn) || columns[0];
  const helperNumerator = -4 * Number(activeHelperColumn.testX) ** 2 + 6 * Number(activeHelperColumn.testX);

  return (
    <div className="container-wide renato-screen" dir="rtl">
      <ProgressBar />
      <header className="renato-title">
        <span className="renato-eyebrow">מסלול רנאטו סאיג</span>
        <h1>כלי עזר לחקירת פונקציות</h1>
      </header>

      <section className="renato-function" aria-label="הפונקציה הנחקרת">
        <span className="renato-function-label">הפונקציה הנחקרת</span>
        <span className="renato-function-expression" dir="ltr">f(x) = {RENATO_FUNCTION}</span>
      </section>

      <div className="renato-workspace">
        <section className="renato-cards" aria-label="ארבע כרטיסיות חקירת הפונקציה">
          <p className="renato-cards-intro">
            ארבע כרטיסיות תת־הבעיות. מספרו את סדר הפתרון; התשובות נאספות בטבלה ובגרף.
          </p>
          {work.cacheNotification && (
            <p className="renato-cache-note" role="status">{work.cacheNotification}</p>
          )}
          {CARD_DEFINITIONS.map((definition) => (
            <RenatoCard
              key={definition.id}
              definition={definition}
              value={work.cards[definition.id]}
              onChange={updateCard}
              onSolve={solveCard}
            />
          ))}
        </section>

        <div className="renato-results">
          <FunctionTable
            columns={columns}
            values={tableValues}
            onChange={updateTableCell}
            onFillCorrect={fillCorrectTable}
            tableErrors={tableErrors}
          />
          <div className="renato-sign-helper">
            <button
              className="renato-secondary-button"
              onClick={() => setShowSignHelper((shown) => !shown)}
              aria-expanded={showSignHelper}
            >
              עוזר חישוב סימן הנגזרת
            </button>
            {showSignHelper && (
              <div className="renato-sign-helper-content">
                <label>
                  תחום לבדיקה
                  <select
                    value={selectedHelperColumn}
                    onChange={(event) => setSelectedHelperColumn(event.target.value)}
                  >
                    {columns.filter(({ isPoint }) => !isPoint).map(({ id, testX, xLabel }) => (
                      <option key={id} value={id}>x = {testX} ({xLabel})</option>
                    ))}
                  </select>
                </label>
                <p dir="ltr">
                  −4({activeHelperColumn.testX})² + 6({activeHelperColumn.testX}) = {helperNumerator.toFixed(2)}
                </p>
                <p>המכנה בריבוע חיובי, ולכן סימן הנגזרת נקבע לפי המונה.</p>
                <button
                  className="renato-secondary-button"
                  onClick={() => updateTableCell(
                    activeHelperColumn.id,
                    'derivative',
                    helperNumerator > 0 ? '+' : '-',
                  )}
                >
                  הזן {helperNumerator > 0 ? '+' : '-'} לטבלה
                </button>
              </div>
            )}
          </div>
          <FunctionGraph work={work} onUpdate={updateGraph} />
        </div>
      </div>

      <div className="renato-finish">
        <button className="btn btn-primary" onClick={goToCompletion}>
          סיימתי את חקירת הפונקציה
        </button>
      </div>
    </div>
  );
}
