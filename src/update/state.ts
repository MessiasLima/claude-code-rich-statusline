import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { stateDir, updateStateFile } from '../paths';

export type UpdateStatus = 'idle' | 'available' | 'installing' | 'done' | 'blocked';

export interface UpdateState {
  /** Epoch ms of the last registry check. */
  lastCheck?: number;
  current?: string;
  latest?: string;
  status?: UpdateStatus;
  message?: string;
}

/** Read the persisted update state. Returns `{}` when missing or unreadable. */
export function readUpdateState(): UpdateState {
  const file = updateStateFile();
  if (!existsSync(file)) return {};
  try {
    return JSON.parse(readFileSync(file, 'utf8')) as UpdateState;
  } catch {
    return {};
  }
}

/** Persist the update state, creating the state directory if needed. */
export function writeUpdateState(state: UpdateState): void {
  mkdirSync(stateDir(), { recursive: true });
  writeFileSync(updateStateFile(), JSON.stringify(state, null, 2) + '\n');
}
