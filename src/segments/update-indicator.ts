import { DIM, paint } from '../colors';
import { readUpdateState } from '../update/state';

/**
 * `⬆ v1.2.3` — shown (dimmed) when a newer version is available but not yet active,
 * or when an auto-update was blocked (e.g. unwritable global prefix). Empty otherwise.
 */
export function renderUpdateIndicator(): string {
  const { status, latest } = readUpdateState();
  if (status !== 'available' && status !== 'blocked') return '';
  if (!latest) return '';
  return paint(DIM, `⬆ v${latest}`);
}
