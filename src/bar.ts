import { GREEN, YELLOW, ORANGE, RED, RESET } from './colors';

/** Color a usage percentage: green ≤60, yellow ≤80, orange ≤95, red otherwise. */
export function thresholdColor(pct: number): string {
  if (pct > 95) return RED;
  if (pct > 80) return ORANGE;
  if (pct > 60) return YELLOW;
  return GREEN;
}

/**
 * Render a progress bar of `width` cells followed by the percentage,
 * e.g. `██░░░░░░░░ 23%`. Matches the original bash integer rounding:
 * filled = floor((pct*width + 50) / 100).
 */
export function bar(percentage: number, filled: string, empty: string, width: number): string {
  const pct = Math.trunc(percentage);
  const cells = Math.min(width, Math.max(0, Math.floor((pct * 10 + 50) / 100)));
  const barCells = filled.repeat(cells) + empty.repeat(width - cells);
  return `${thresholdColor(pct)}${barCells} ${pct}%${RESET}`;
}
