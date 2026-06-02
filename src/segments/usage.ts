import { bar, thresholdColor } from '../bar';
import { RESET } from '../colors';
import { resetDay, resetTime } from '../time';
import type { RateLimitWindow, StatusLineInput } from '../types';

const SEPARATOR = ' · ';

type ResetFormatter = (epochSeconds: number) => string;

/** Build one window's segment, e.g. `⏱ ■■□□□□□□□□ 23% (resets 14:30)`. */
function renderWindow(
  icon: string,
  window: RateLimitWindow | undefined,
  formatReset: ResetFormatter,
): string {
  const pct = window?.used_percentage;
  if (pct === undefined || pct === null) return '';
  const color = thresholdColor(Math.trunc(pct));
  let segment = `${color}${icon}${RESET} ${bar(pct)}`;
  const resetsAt = window?.resets_at;
  if (resetsAt !== undefined && resetsAt !== null) {
    segment += ` (resets ${formatReset(resetsAt)})`;
  }
  return segment;
}

/**
 * Line 2: Claude plan rate-limit usage bars. `⏱` = 5-hour window, `▦` = 7-day window.
 * Returns `''` when no rate-limit data is present (non-Pro/Max sessions).
 */
export function renderUsage(input: StatusLineInput): string {
  const limits = input.rate_limits;
  if (!limits) return '';
  return [
    renderWindow('⏱', limits.five_hour, resetTime),
    renderWindow('▦', limits.seven_day, resetDay),
  ]
    .filter(Boolean)
    .join(SEPARATOR);
}
