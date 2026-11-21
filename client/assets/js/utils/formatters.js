// Example output (English locale): "Saturday, 21 November 2026"
export function formatLongDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}