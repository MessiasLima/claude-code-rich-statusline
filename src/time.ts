/** Format a rate-limit reset timestamp (Unix epoch seconds). */

/** Local 24-hour clock time, e.g. `14:30`. */
export function resetTime(epochSeconds: number): string {
  return new Date(epochSeconds * 1000).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/** Short local weekday, e.g. `Fri`. */
export function resetDay(epochSeconds: number): string {
  return new Date(epochSeconds * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
  });
}
