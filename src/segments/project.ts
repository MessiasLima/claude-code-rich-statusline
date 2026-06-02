import { basename } from 'node:path';
import { YELLOW, paint } from '../colors';
import type { StatusLineInput } from '../types';

/** `⌂ my-project` — current working directory's folder name. Empty when unknown. */
export function renderProject(input: StatusLineInput): string {
  const dir = input.workspace?.current_dir;
  if (!dir) return '';
  return paint(YELLOW, `⌂ ${basename(dir)}`);
}
