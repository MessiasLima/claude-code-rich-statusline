import { homedir } from 'node:os';
import { join } from 'node:path';

/** `~/.claude` — Claude Code's config directory. */
export function claudeDir(): string {
  return join(homedir(), '.claude');
}

export function settingsPath(): string {
  return join(claudeDir(), 'settings.json');
}

export function localSettingsPath(): string {
  return join(claudeDir(), 'settings.local.json');
}

/** Directory holding this tool's own state (update check, logs). */
export function stateDir(): string {
  return join(claudeDir(), '.cc-statusline');
}

export function updateStateFile(): string {
  return join(stateDir(), 'update.json');
}

export function updateLogFile(): string {
  return join(stateDir(), 'update.log');
}
