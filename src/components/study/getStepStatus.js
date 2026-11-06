export function getStepStatus(values) {
  const answeredFields = values.filter(Boolean).length;
  return answeredFields === 0
    ? 'טרם התחלת'
    : answeredFields === values.length
      ? 'השדות מולאו'
      : 'בתהליך';
}
