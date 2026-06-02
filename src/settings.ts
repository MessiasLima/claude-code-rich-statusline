import { existsSync, readFileSync } from 'node:fs';
import { localSettingsPath, settingsPath } from './paths';

type Settings = Record<string, unknown>;

interface ReadResult {
  exists: boolean;
  /** Parsed object, or `undefined` when the file is missing or unparseable. */
  data?: Settings;
  /** True when the file exists but could not be parsed as JSON. */
  parseError: boolean;
}

/** Read a settings file, distinguishing "missing" from "exists but invalid JSON". */
export function readSettingsFile(path: string): ReadResult {
  if (!existsSync(path)) return { exists: false, parseError: false };
  try {
    const data = JSON.parse(readFileSync(path, 'utf8')) as Settings;
    return { exists: true, data, parseError: false };
  } catch {
    return { exists: true, parseError: true };
  }
}

/**
 * Resolve the reasoning-effort level from settings as a fallback when it is
 * absent from the status line JSON. Prefers `settings.local.json`.
 */
export function readEffort(): string {
  for (const path of [localSettingsPath(), settingsPath()]) {
    const level = readSettingsFile(path).data?.effortLevel;
    if (typeof level === 'string' && level) return level;
  }
  return '';
}
