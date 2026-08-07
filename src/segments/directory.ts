import { basename } from 'node:path';
import { YELLOW, paint } from '../colors';
import type { StatuslineIcons } from '../config';
import type { StatusLineInput } from '../types';

/** `⌂ my-project` — current working directory's folder name. Empty when unknown. */
export function renderDirectory(input: StatusLineInput, icons: StatuslineIcons): string {
  const dir = input.workspace?.current_dir;
  if (!dir) return '';
  return paint(YELLOW, `${icons.directory} ${basename(dir)}`);
}
