import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { readUpdateState } from './state';

const DEFAULT_INTERVAL_HOURS = 24;
const HOUR_MS = 60 * 60 * 1000;

function intervalMs(): number {
  const hours = Number.parseFloat(process.env.CC_STATUSLINE_UPDATE_INTERVAL ?? '');
  return (Number.isFinite(hours) && hours > 0 ? hours : DEFAULT_INTERVAL_HOURS) * HOUR_MS;
}

function isDue(): boolean {
  const { lastCheck } = readUpdateState();
  if (!lastCheck) return true;
  return Date.now() - lastCheck >= intervalMs();
}

/**
 * Cheap, non-blocking update check. When due, spawns the detached background
 * updater and returns immediately. Skipped entirely when disabled or running via npx.
 */
export function maybeTriggerUpdate(): void {
  if (process.env.CC_STATUSLINE_NO_UPDATE) return;
  if (__dirname.includes('/_npx/')) return; // running through npx — nothing to self-update
  if (!isDue()) return;

  try {
    const child = spawn(process.execPath, [join(__dirname, 'update.js')], {
      detached: true,
      stdio: 'ignore',
    });
    child.unref();
  } catch {
    // best-effort; never affects rendering
  }
}
