import { bar, thresholdColor } from '../bar';
import { RESET } from '../colors';
import type { StatuslineConfig } from '../config';
import { resetDay, resetTime } from '../time';
import type { RateLimitWindow, StatusLineInput } from '../types';

type ResetFormatter = (epochSeconds: number) => string;

/** Build one window's segment, e.g. `⏱ ▰▰▱▱▱▱▱▱▱▱ 23% (resets 14:30)`. */
function renderWindow(
  icon: string,
  window: RateLimitWindow | undefined,
  formatReset: ResetFormatter,
  config: StatuslineConfig,
): string {
  const pct = window?.used_percentage;
  if (pct === undefined || pct === null) return '';
  const color = thresholdColor(Math.trunc(pct));
  const { filled, empty, width } = config.progressBar;
  let segment = `${color}${icon}${RESET} ${bar(pct, filled, empty, width)}`;
  const resetsAt = window?.resets_at;
  if (resetsAt !== undefined && resetsAt !== null) {
    segment += ` (resets ${formatReset(resetsAt)})`;
  }
  return segment;
}

/**
 * Line 2: Claude plan rate-limit usage bars. `icons.fiveHour` = 5-hour window,
 * `icons.week` = 7-day window. Returns `''` when no rate-limit data is present
 * (non-Pro/Max sessions).
 */
export function renderUsage(input: StatusLineInput, config: StatuslineConfig): string {
  const limits = input.rate_limits;
  if (!limits) return '';
  return [
    renderWindow(config.icons.fiveHour, limits.five_hour, resetTime, config),
    renderWindow(config.icons.week, limits.seven_day, resetDay, config),
  ]
    .filter(Boolean)
    .join(config.separator);
}
