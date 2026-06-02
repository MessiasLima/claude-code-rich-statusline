import { readFileSync } from 'node:fs';
import type { StatusLineInput } from './types';

/** Read and parse the status line JSON from stdin (fd 0). Returns `{}` on any failure. */
export function readInput(): StatusLineInput {
  try {
    const raw = readFileSync(0, 'utf8').trim();
    if (!raw) return {};
    return JSON.parse(raw) as StatusLineInput;
  } catch {
    return {};
  }
}
