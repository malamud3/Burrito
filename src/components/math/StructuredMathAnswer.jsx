import React, { useEffect, useRef, useState } from 'react';

const NUMBER_PATTERN = /-?(?:\d+(?:\.\d*)?|\.\d+)/g;
const COORDINATE_PATTERN = /\(\s*(-?(?:\d+(?:\.\d*)?|\.\d+))\s*,\s*(-?(?:\d+(?:\.\d*)?|\.\d+))\s*\)/g;
const EXTREMA_PATTERN = /(Min|Max)?\s*\(\s*(-?(?:\d+(?:\.\d*)?|\.\d+))\s*,\s*(-?(?:\d+(?:\.\d*)?|\.\d+))\s*\)/g;

const formatNumber = (value) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? String(numericValue) : '';
};

function parseAnswer(value, format) {
  if (format === 'coordinates') {
    return Array.from(value.matchAll(COORDINATE_PATTERN), ([, x, y]) => ({ x, y }));
  }
  if (format === 'extrema') {
    return Array.from(value.matchAll(EXTREMA_PATTERN), ([, kind = '', x, y]) => ({
      kind,
      x,
      y,
    }));
  }
  if (format === 'x-values') {
    return Array.from(value.matchAll(NUMBER_PATTERN), ([number]) => number);
  }
  if (format === 'y-value') {
    const [number] = value.match(NUMBER_PATTERN) || [];
    return number ? [number] : [];
  }
  return [];
}

function serializeAnswer(rows, format, prefix = '') {
  if (format === 'coordinates') {
    return rows
      .filter(({ x, y }) => x !== '' && y !== '')
      .map(({ x, y }) => `(${formatNumber(x)}, ${formatNumber(y)})`)
      .join(', ');
  }
  if (format === 'extrema') {
    return rows
      .filter(({ x, y }) => x !== '' && y !== '')
      .map(({ kind, x, y }) => `${kind ? `${kind} ` : ''}(${formatNumber(x)}, ${formatNumber(y)})`)
      .join(', ');
  }
  return rows
    .filter((number) => number !== '')
    .map((number) => `${prefix} ${formatNumber(number)}`)
    .join(', ');
}

function NumberInput({ label, value, onChange }) {
  return (
    <input
      type="number"
      inputMode="decimal"
      step="any"
      aria-label={label}
      value={value}
      placeholder="מספר"
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export default function StructuredMathAnswer({
  value,
  format,
  label,
  prefix,
  onChange,
}) {
  const [rows, setRows] = useState(() => parseAnswer(value, format));
  const lastEmittedValue = useRef(null);

  useEffect(() => {
    if (value === lastEmittedValue.current) {
      lastEmittedValue.current = null;
      return;
    }
    setRows(parseAnswer(value, format));
  }, [value, format]);

  const updateRows = (nextRows) => {
    setRows(nextRows);
    const nextValue = serializeAnswer(nextRows, format, prefix);
    lastEmittedValue.current = nextValue;
    onChange(nextValue);
  };

  const addRow = () => {
    if (format === 'coordinates') updateRows([...rows, { x: '', y: '' }]);
    else if (format === 'extrema') updateRows([...rows, { kind: '', x: '', y: '' }]);
    else updateRows([...rows, '']);
  };

  const removeRow = (index) => updateRows(rows.filter((_, rowIndex) => rowIndex !== index));
  const rowCount = Math.max(rows.length, 1);
  const renderedRows = rows.length > 0
    ? rows
    : (format === 'coordinates'
      ? [{ x: '', y: '' }]
      : format === 'extrema'
        ? [{ kind: '', x: '', y: '' }]
        : ['']);
  const supportsMultiple = format !== 'y-value';
  const formattedValue = serializeAnswer(rows, format, prefix);

  return (
    <div className={`structured-math-answer is-${format}`}>
      {renderedRows.map((row, index) => {
        const rowLabel = `${label} — ${rowCount > 1 ? `שורה ${index + 1}` : 'ערך'}`;
        return (
          <div
            className={`structured-math-row${rowCount > 1 ? ' has-multiple-rows' : ''}`}
            key={`${label}-${index}`}
            role="group"
            aria-label={rowLabel}
          >
            {format === 'coordinates' || format === 'extrema' ? (
              <>
                {format === 'extrema' && (
                  <label className="structured-math-kind">
                    <span>סיווג</span>
                    <select
                      aria-label={`${rowLabel} — סיווג`}
                      value={row.kind}
                      onChange={(event) => updateRows(
                        renderedRows.map((item, rowIndex) => (
                          rowIndex === index ? { ...item, kind: event.target.value } : item
                        )),
                      )}
                    >
                      <option value="">נקודה</option>
                      <option value="Min">מינימום</option>
                      <option value="Max">מקסימום</option>
                    </select>
                  </label>
                )}
                <label className="structured-math-coordinate">
                  <span>x</span>
                  <NumberInput
                    label={`${rowLabel} — x`}
                    value={row.x}
                    onChange={(x) => updateRows(
                      renderedRows.map((item, rowIndex) => (
                        rowIndex === index ? { ...item, x } : item
                      )),
                    )}
                  />
                </label>
                <span className="structured-math-comma" aria-hidden="true">,</span>
                <label className="structured-math-coordinate">
                  <span>y</span>
                  <NumberInput
                    label={`${rowLabel} — y`}
                    value={row.y}
                    onChange={(y) => updateRows(
                      renderedRows.map((item, rowIndex) => (
                        rowIndex === index ? { ...item, y } : item
                      )),
                    )}
                  />
                </label>
              </>
            ) : (
              <>
                {prefix && <span className="structured-math-prefix" dir="ltr">{prefix}</span>}
                <NumberInput
                  label={`${rowLabel}${prefix ? ` — ${prefix}` : ''}`}
                  value={row}
                  onChange={(nextValue) => updateRows(
                    renderedRows.map((item, rowIndex) => (
                      rowIndex === index ? nextValue : item
                    )),
                  )}
                />
              </>
            )}
            {supportsMultiple && (
              <button
                className="structured-math-remove"
                type="button"
                aria-label={`הסרת ערך ${index + 1} — ${label}`}
                disabled={renderedRows.length === 1}
                onClick={() => removeRow(index)}
              >
                <span aria-hidden="true">×</span>
                <span className="structured-math-remove-label">הסרה</span>
              </button>
            )}
          </div>
        );
      })}
      <div className="structured-math-actions">
        {supportsMultiple && (
          <button className="structured-math-add" type="button" onClick={addRow}>
            <span className="structured-math-add-icon" aria-hidden="true">+</span>
            <span>{format === 'coordinates' || format === 'extrema' ? 'הוספת נקודה' : 'הוספת ערך'}</span>
          </button>
        )}
        {formattedValue && (
          <div className="structured-math-preview">
            <span className="structured-math-preview-label">התשובה שלך</span>
            <output dir="ltr">{formattedValue}</output>
          </div>
        )}
      </div>
    </div>
  );
}
