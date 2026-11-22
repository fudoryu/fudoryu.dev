const month = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const day = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatDate = (d: Date) => day.format(d);
export const formatMonth = (d: Date) => month.format(d);

export function formatSpan(start: Date, end?: Date) {
  const a = start.getUTCFullYear();
  if (!end) return `${a} – now`;
  const b = end.getUTCFullYear();
  return a === b ? `${a}` : `${a} – ${b}`;
}

export function readingMinutes(text = '') {
  return Math.max(1, Math.round(text.split(/\s+/).length / 230));
}
