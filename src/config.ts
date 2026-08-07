import { localSettingsPath, settingsPath } from './paths';
import { readSettingsFile } from './settings';

export interface StatuslineIcons {
  context: string;
  model: string;
  directory: string;
  branch: string;
  update: string;
  fiveHour: string;
  week: string;
}

export interface ProgressBarConfig {
  filled: string;
  empty: string;
  width: number;
}

export interface StatuslineConfig {
  icons: StatuslineIcons;
  progressBar: ProgressBarConfig;
  separator: string;
}

export const DEFAULT_CONFIG: StatuslineConfig = {
  icons: {
    context: '◈',
    model: '◆',
    directory: '⌂',
    branch: '⎇',
    update: '⬆',
    fiveHour: '⏱',
    week: '▦',
  },
  progressBar: {
    filled: '█',
    empty: '░',
    width: 10,
  },
  separator: ' · ',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** The `ccStatusline` object from one settings file, or `undefined`. */
function readSection(path: string): Record<string, unknown> | undefined {
  const section = readSettingsFile(path).data?.ccStatusline;
  return isRecord(section) ? section : undefined;
}

/** Per-key merge of a nested group, local wins over shared. */
function mergedGroup(
  local: Record<string, unknown> | undefined,
  shared: Record<string, unknown> | undefined,
  group: string,
): Record<string, unknown> {
  const localGroup = isRecord(local?.[group]) ? (local[group] as Record<string, unknown>) : {};
  const sharedGroup = isRecord(shared?.[group]) ? (shared[group] as Record<string, unknown>) : {};
  return { ...sharedGroup, ...localGroup };
}

/**
 * Resolve the display theme from `~/.claude/settings.local.json` (preferred)
 * then `~/.claude/settings.json`, falling back to defaults for missing or
 * invalid fields. Keys not present keep their defaults.
 */
export function readConfig(): StatuslineConfig {
  const local = readSection(localSettingsPath());
  const shared = readSection(settingsPath());
  const icons = mergedGroup(local, shared, 'icons');
  const progressBar = mergedGroup(local, shared, 'progressBar');

  const icon = (key: keyof StatuslineIcons): string =>
    typeof icons[key] === 'string' ? (icons[key] as string) : DEFAULT_CONFIG.icons[key];

  const barChar = (key: 'filled' | 'empty'): string =>
    typeof progressBar[key] === 'string'
      ? (progressBar[key] as string)
      : DEFAULT_CONFIG.progressBar[key];

  const width =
    typeof progressBar.width === 'number' && progressBar.width > 0
      ? Math.trunc(progressBar.width)
      : DEFAULT_CONFIG.progressBar.width;

  const separator = local?.separator ?? shared?.separator;

  return {
    icons: {
      context: icon('context'),
      model: icon('model'),
      directory: icon('directory'),
      branch: icon('branch'),
      update: icon('update'),
      fiveHour: icon('fiveHour'),
      week: icon('week'),
    },
    progressBar: {
      filled: barChar('filled'),
      empty: barChar('empty'),
      width,
    },
    separator: typeof separator === 'string' ? separator : DEFAULT_CONFIG.separator,
  };
}
