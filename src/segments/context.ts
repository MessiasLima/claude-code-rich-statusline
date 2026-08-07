import { CYAN, paint } from '../colors';
import type { StatuslineIcons } from '../config';
import type { StatusLineInput } from '../types';

/** `◈ 42%` — context-window usage. Empty when unavailable. */
export function renderContext(input: StatusLineInput, icons: StatuslineIcons): string {
  const pct = input.context_window?.used_percentage;
  if (pct === undefined || pct === null) return '';
  return paint(CYAN, `${icons.context} ${Math.trunc(pct)}%`);
}
