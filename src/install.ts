import { mkdirSync, writeFileSync } from 'node:fs';
import { claudeDir, settingsPath } from './paths';
import { readSettingsFile } from './settings';

const BIN = 'cc-statusline';
const STATUS_LINE = { type: 'command', command: BIN };
const SNIPPET = JSON.stringify({ statusLine: STATUS_LINE }, null, 2);

interface StatusLine {
  command?: string;
}

function manualHint(reason: string): void {
  console.log(`cc-statusline: ${reason}`);
  console.log(`Add this to ~/.claude/settings.json manually:\n${SNIPPET}`);
}

function configure(): void {
  // Only act on an explicit global install; skip dev/transitive installs.
  if (process.env.npm_config_global !== 'true') return;
  if (process.env.CC_STATUSLINE_NO_SETUP) return;

  const dir = claudeDir();
  const file = settingsPath();
  mkdirSync(dir, { recursive: true });

  const result = readSettingsFile(file);
  if (result.parseError) {
    manualHint('existing settings.json is not valid JSON, leaving it untouched');
    return;
  }

  const settings = result.data ?? {};
  const existing = settings.statusLine as StatusLine | undefined;

  if (existing) {
    if (typeof existing.command === 'string' && existing.command.includes(BIN)) {
      return; // already configured — idempotent
    }
    manualHint('a different statusLine is already configured, leaving it untouched');
    return;
  }

  settings.statusLine = STATUS_LINE;
  writeFileSync(file, JSON.stringify(settings, null, 2) + '\n');
  console.log(`✓ cc-statusline configured in ${file}`);
}

try {
  configure();
} catch {
  // Never fail the install.
}
