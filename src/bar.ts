import { GREEN, YELLOW, ORANGE, RED, RESET } from './colors';

const WIDTH = 10;
const FILLED = '█';
const EMPTY = '░';

/** Color a usage percentage: green ≤60, yellow ≤80, orange ≤95, red otherwise. */
export function thresholdColor(pct: number): string {
  if (pct > 95) return RED;
  if (pct > 80) return ORANGE;
  if (pct > 60) return YELLOW;
  return GREEN;
}

/**
 * Render a 10-cell progress bar followed by the percentage, e.g. `██░░░░░░░░ 23%`.
 * Matches the original bash integer rounding: filled = floor((pct*10 + 50) / 100).
 */
export function bar(percentage: number): string {
  const pct = Math.trunc(percentage);
  const filled = Math.min(WIDTH, Math.max(0, Math.floor((pct * 10 + 50) / 100)));
  const cells = FILLED.repeat(filled) + EMPTY.repeat(WIDTH - filled);
  return `${thresholdColor(pct)}${cells} ${pct}%${RESET}`;
}
