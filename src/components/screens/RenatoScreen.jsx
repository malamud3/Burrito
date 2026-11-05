import React from 'react';
import { useSessionContext } from '../../context/SessionContext';
import { LogActionType, Phase } from '../../core/types/enums';
import { RENATO_FUNCTION, RENATO_TABLE_COLUMNS } from '../../core/constants/renato';
import { STUDY_DURATION_MINUTES, STUDY_HINTS } from '../../core/constants/study';
import { useLogger } from '../../hooks/useLogger';
import { usePhaseNavigation } from '../../hooks/usePhaseNavigation';
import { useNotification } from '../../context/NotificationContext';
import ProgressBar from '../layout/ProgressBar';
import FunctionFraction from '../math/FunctionFraction';
import FunctionGraph from '../math/FunctionGraph';
import StructuredMathAnswer from '../math/StructuredMathAnswer';
import StudyHint from '../math/StudyHint';

const CARD_DEFINITIONS = [
  {
    id: 'domain',
    title: 'תחום ההגדרה',
    description: 'מהו תחום ההגדרה של הפונקציה?',
    fields: [{
      key: 'answer',
      label: 'ערכי x שאינם בתחום',
      help: 'מצאו מתי המכנה שווה לאפס. הוסיפו שורה לכל ערך שאינו בתחום.',
      input: { format: 'x-values', prefix: 'x ≠' },
    }],
    notes: STUDY_HINTS.domain,
  },
  {
    id: 'asymptotes',
    title: 'אסימפטוטות מקבילות לצירים',
    description: 'אסימפטוטות אנכיות ואופקיות',
    fields: [
      {
        key: 'vertical',
        label: 'אסימפטוטות אנכיות',
        help: 'הזינו את ערכי x שבהם מופיעות אסימפטוטות אנכיות.',
        input: { format: 'x-values', prefix: 'x =' },
      },
      {
        key: 'horizontal',
        label: 'אסימפטוטה אופקית',
        help: 'הזינו את ערך y של האסימפטוטה.',
        input: { format: 'y-value', prefix: 'y =' },
      },
    ],
    checkDomain: true,
    notes: STUDY_HINTS.asymptotes,
  },
  {
    id: 'intercepts',
    title: 'נקודות חיתוך עם הצירים',
    description: 'בחיתוך עם y מציבים x = 0; בחיתוך עם x משווים y ל־0',
    fields: [
      {
        key: 'yAxis',
        label: 'חיתוך עם ציר y',
        help: 'הזינו בנפרד את ערכי x ו־y של נקודת החיתוך.',
        input: { format: 'coordinates' },
      },
      {
        key: 'xAxis',
        label: 'חיתוך עם ציר x',
        help: 'הזינו בנפרד את ערכי x ו־y של נקודת החיתוך.',
        input: { format: 'coordinates' },
      },
    ],
    checkDomain: true,
    notes: STUDY_HINTS.intercepts,
  },
  {
    id: 'extrema',
    title: 'נקודות החשודות כנקודות קיצון',
    description: 'מציאת נקודות חשודות ובדיקת שינוי סימן הנגזרת',
    fields: [
      {
        key: 'suspectedX',
        label: 'ערכי x חשודים',
        help: 'הוסיפו שורה לכל פתרון של f′(x) = 0, ובדקו שהוא בתחום.',
        input: { format: 'x-values', prefix: 'x =' },
      },
      {
        key: 'points',
        label: 'נקודות קיצון',
        help: 'בחרו סוג קיצון והזינו את הקואורדינטות של כל נקודה.',
        input: { format: 'extrema' },
      },
      {
        key: 'derivative',
        label: "הנגזרת f'(x)",
        placeholder: 'לדוגמה: (ביטוי במונה) / (ביטוי במכנה)',
        help: 'בשדה הזה אפשר להקליד את הביטוי המלא.',
      },
    ],
    checkDomain: true,
    notes: STUDY_HINTS.extrema,
  },
];

const RENATO_CARD_PHASES = [
  Phase.RENATO,
  Phase.RENATO_ASYMPTOTES,
  Phase.RENATO_INTERCEPTS,
  Phase.RENATO_EXTREMA,
];

const getDefinitionProgress = (definition, value) => {
  const answeredFields = definition.fields.filter(({ key }) =>
    typeof value[key] === 'string' && value[key].trim().length > 0,
  ).length;

  return {
    answeredFields,
    totalFields: definition.fields.length,
    status: answeredFields === 0
      ? 'טרם התחלת'
      : answeredFields === definition.fields.length
        ? 'השדות מולאו'
        : 'בתהליך',
  };
};

function RenatoCard({ definition, value, onChange, onHintReveal }) {
  const { id, title, description, fields, checkDomain, notes } = definition;
  return (
    <article className={`renato-card renato-card-${id}`}>
      <header className="renato-card-heading">
        <div>
          <span className="renato-hint-label">שלב בתהליך הפירוק</span>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </header>
      <div className="renato-card-fields">
        {fields.map(({ key, label, placeholder, help, input }) => (
          <div className="renato-field" key={key}>
            <span className="renato-field-label">{label}</span>
            {help && <span className="renato-field-help">{help}</span>}
            {input ? (
              <StructuredMathAnswer
                label={label}
                value={value[key]}
                onChange={(nextValue) => onChange(id, key, nextValue)}
                {...input}
              />
            ) : (
              <>
                <textarea
                  rows="1"
                  dir="ltr"
                  aria-label={label}
                  placeholder={placeholder}
                  value={value[key]}
                  onChange={(event) => onChange(id, key, event.target.value)}
                />
              </>
            )}
          </div>
        ))}
      </div>
      <StudyHint hints={notes} onReveal={onHintReveal} />
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

function FunctionTable({ columns, values, onChange }) {
  const derivativeOptions = ['', '+', '-', '0', '///'];
  const behaviorOptions = ['', '↗', '↘', 'Min', 'Max', '///'];
  return (
    <section className="renato-panel renato-table-panel">
      <div className="renato-panel-heading">
        <div>
          <h2>טבלה — איסוף וזיהוי תבניות</h2>
          <p>שורה 1: ערכי x • שורה 2: סימן הנגזרת • שורה 3: התנהגות הפונקציה</p>
        </div>
      </div>
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
                  return (
                    <td
                      key={column.id}
                      className={`${column.isPoint ? 'is-critical-point ' : ''}${value === '///' ? 'is-undefined' : ''}`}
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
    </section>
  );
}

export default function RenatoScreen({ step = Phase.RENATO } = {}) {
  const { session, updateRenatoWork, updateGraphWork } = useSessionContext();
  const { log } = useLogger();
  const { goTo, goToTransferAssessment } = usePhaseNavigation();
  const { show } = useNotification();
  const work = session.renatoWork;
  const graphWork = session.graphWork;
  const columns = RENATO_TABLE_COLUMNS;
  const stepIndex = RENATO_CARD_PHASES.indexOf(step);
  const isGraphStep = step === Phase.RENATO_GRAPH;
  const currentDefinition = CARD_DEFINITIONS[stepIndex];
  const tableValues = Object.fromEntries(
    work.table.columns.map(({ id, ...values }) => [id, values]),
  );
  const stepProgress = CARD_DEFINITIONS.map((definition) => ({
    definition,
    ...getDefinitionProgress(definition, work.cards[definition.id]),
  }));
  const answeredFields = stepProgress.reduce(
    (total, progress) => total + progress.answeredFields,
    0,
  );
  const totalFields = stepProgress.reduce(
    (total, progress) => total + progress.totalFields,
    0,
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
    updateGraphWork(patch);
    updateRenatoWork(patch);
    log(LogActionType.EDIT, {
      field: 'renato.graph',
      ...patch,
    });
  };

  const nextStep = isGraphStep
    ? null
    : (RENATO_CARD_PHASES[stepIndex + 1] || Phase.RENATO_GRAPH);
  const previousStep = isGraphStep
    ? Phase.RENATO_EXTREMA
    : (stepIndex > 0 ? RENATO_CARD_PHASES[stepIndex - 1] : null);

  const handleFinish = () => {
    if (!graphWork.graphStrokes?.length) {
      show('לפני הסיום, יש לשרטט את הפונקציה על מערכת הצירים.', '⚠️');
      return;
    }

    log(LogActionType.ANSWER_SUBMIT, {
      activityPath: 'renato',
      answerType: 'function_graph',
      strokeCount: graphWork.graphStrokes.length,
    });
    log(LogActionType.ACTIVITY_COMPLETE, {
      schemaVersion: 1,
      assessment: {
        domain: work.cards.domain.answer,
        derivative: work.cards.extrema.derivative,
        criticalPoints: work.cards.extrema.suspectedX,
        extremaPoints: work.cards.extrema.points,
        verticalAsymptotes: work.cards.asymptotes.vertical,
        horizontalAsymptote: work.cards.asymptotes.horizontal,
        yAxisIntercept: work.cards.intercepts.yAxis,
        xAxisIntercept: work.cards.intercepts.xAxis,
        signBehavior: work.table.columns,
        graph: {
          ...graphWork,
        },
      },
      work: { ...work, graph: graphWork },
    });
    goToTransferAssessment();
  };

  return (
    <div className="container-wide renato-screen" dir="rtl">
      <ProgressBar />
      <header className="renato-title">
        <span className="renato-eyebrow">מסלול רנאטו סאיג</span>
        <h1>כלי עזר לחקירת פונקציות</h1>
      </header>
      <p className="study-protocol-note">
        לרשותכם {STUDY_DURATION_MINUTES} דקות, דף טיוטה וכלי שרטוט דיגיטלי זהה לזה שבמסלול הקלאסי.
        ניתן לבקש מהמנחה הבהרה טכנית בלבד, ללא רמזים מתמטיים.
      </p>

      <section className="renato-function" aria-label="הפונקציה הנחקרת">
        <span className="renato-function-label">הפונקציה הנחקרת</span>
        <FunctionFraction
          numerator="x²"
          denominator="x² − 4x + 3"
          ariaLabel={`f(x) = ${RENATO_FUNCTION}`}
          className="renato-function-expression"
        />
      </section>

      <section className="renato-learning-progress" aria-labelledby="renato-progress-title">
        <div className="renato-learning-progress-heading">
          <div>
            <h2 id="renato-progress-title">ההתקדמות שלך בחקירה</h2>
            <p>מעקב אחר שדות שמולאו — לא בדיקת נכונות או שליטה בחומר.</p>
          </div>
          <strong>{answeredFields} מתוך {totalFields} שדות</strong>
        </div>
        <div
          className="renato-learning-progress-track"
          role="progressbar"
          aria-label="שדות תשובה שמולאו"
          aria-valuenow={answeredFields}
          aria-valuemin={0}
          aria-valuemax={totalFields}
        >
          <div
            className="renato-learning-progress-fill"
            style={{ width: `${(answeredFields / totalFields) * 100}%` }}
          />
        </div>
      </section>

      <nav className="renato-step-navigation" aria-label="שלבי חקירת הפונקציה">
        {stepProgress.map(({ definition, status }, index) => {
          const phase = RENATO_CARD_PHASES[index];
          return (
            <button
              key={definition.id}
              type="button"
              className={`renato-step-link${step === phase ? ' is-current' : ''}`}
              aria-current={step === phase ? 'step' : undefined}
              onClick={() => goTo(phase)}
            >
              <span>שלב {index + 1} · {status}</span>
              <strong>{definition.title}</strong>
            </button>
          );
        })}
        <button
          type="button"
          className={`renato-step-link${isGraphStep ? ' is-current' : ''}`}
          aria-current={isGraphStep ? 'step' : undefined}
          onClick={() => goTo(Phase.RENATO_GRAPH)}
        >
          <span>פתרון מסכם</span>
          <strong>שרטוט הפונקציה</strong>
          <span>{graphWork.graphStrokes.length ? 'השרטוט התחיל' : 'טרם התחלת'}</span>
        </button>
      </nav>

      {currentDefinition && (
        <section className="renato-single-step" aria-label={currentDefinition.title}>
          <p className="renato-cards-intro">
            אפשר לפתור לבד, לפתוח רמז לפי הצורך, ולהמשיך בכל שלב גם אם התשובה עדיין לא הושלמה.
          </p>
          <RenatoCard
            definition={currentDefinition}
            value={work.cards[currentDefinition.id]}
            onChange={updateCard}
            onHintReveal={(hintIndex) => log(LogActionType.HINT_REQUEST, {
              phase: 'function_analysis',
              stepId: currentDefinition.id,
              hintIndex,
              totalHints: currentDefinition.notes.length,
            })}
          />
        </section>
      )}

      {isGraphStep && (
        <div className="renato-results">
          <FunctionTable
            columns={columns}
            values={tableValues}
            onChange={updateTableCell}
          />
          <FunctionGraph work={graphWork} onUpdate={updateGraph} />
        </div>
      )}

      <div className="renato-step-actions">
        {previousStep ? (
          <button className="btn btn-outline" onClick={() => goTo(previousStep)}>
            ← חזרה
          </button>
        ) : <span />}
        {nextStep ? (
          <button className="btn btn-primary" onClick={() => goTo(nextStep)}>
            {nextStep === Phase.RENATO_GRAPH ? 'לשרטוט הפונקציה ←' : 'המשך/י לשלב הבא ←'}
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleFinish}>
            הגשת שרטוט וסיום
          </button>
        )}
      </div>
    </div>
  );
}

export function RenatoAsymptotesScreen() {
  return <RenatoScreen step={Phase.RENATO_ASYMPTOTES} />;
}

export function RenatoInterceptsScreen() {
  return <RenatoScreen step={Phase.RENATO_INTERCEPTS} />;
}

export function RenatoExtremaScreen() {
  return <RenatoScreen step={Phase.RENATO_EXTREMA} />;
}

export function RenatoGraphScreen() {
  return <RenatoScreen step={Phase.RENATO_GRAPH} />;
}
