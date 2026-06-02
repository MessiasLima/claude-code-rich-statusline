import { GREEN, paint } from '../colors';
import { currentBranch } from '../git';
import type { StatusLineInput } from '../types';

/** `⎇ main` — git branch of the working directory. Empty when not a repo. */
export function renderBranch(input: StatusLineInput): string {
  const dir = input.workspace?.current_dir;
  if (!dir) return '';
  const branch = currentBranch(dir);
  if (!branch) return '';
  return paint(GREEN, `⎇ ${branch}`);
}
