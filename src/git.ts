import { execFileSync } from 'node:child_process';

/** Current git branch for `dir`, or `''` when unavailable (not a repo, detached HEAD, no git). */
export function currentBranch(dir: string): string {
  if (!dir) return '';
  try {
    return execFileSync('git', ['-C', dir, 'branch', '--show-current'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}
