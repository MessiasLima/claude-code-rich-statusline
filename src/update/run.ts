import { execFileSync } from 'node:child_process';
import { appendFileSync, mkdirSync } from 'node:fs';
import { stateDir, updateLogFile } from '../paths';
import { PACKAGE_NAME } from './registry';

export type InstallOutcome = 'done' | 'blocked' | 'failed';

export interface InstallResult {
  outcome: InstallOutcome;
  message?: string;
}

function log(text: string): void {
  try {
    mkdirSync(stateDir(), { recursive: true });
    appendFileSync(updateLogFile(), text + '\n');
  } catch {
    // logging is best-effort
  }
}

/** Globally install the given version via npm. Distinguishes permission failures. */
export function installLatest(version: string): InstallResult {
  try {
    const out = execFileSync('npm', ['install', '-g', `${PACKAGE_NAME}@${version}`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    log(out);
    return { outcome: 'done' };
  } catch (err) {
    const e = err as { stderr?: Buffer | string; message?: string };
    const detail = (e.stderr?.toString() || e.message || '').trim();
    log(detail);
    if (/EACCES|EPERM|permission denied/i.test(detail)) {
      return {
        outcome: 'blocked',
        message: `Run manually: npm i -g ${PACKAGE_NAME}@latest`,
      };
    }
    return { outcome: 'failed', message: detail.slice(0, 200) };
  }
}
