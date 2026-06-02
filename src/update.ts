import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fetchLatestVersion } from './update/registry';
import { installLatest } from './update/run';
import { writeUpdateState, type UpdateState } from './update/state';
import { isNewer } from './update/version';

/** This package's installed version, read from the sibling package.json at runtime. */
function ownVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8')) as {
      version?: string;
    };
    return pkg.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}

async function run(): Promise<void> {
  const current = ownVersion();
  // Stamp the check time first so failures still throttle the next run.
  const state: UpdateState = { lastCheck: Date.now(), current, status: 'idle' };
  writeUpdateState(state);

  const latest = await fetchLatestVersion();
  if (!latest || !isNewer(latest, current)) {
    writeUpdateState({ ...state, latest: latest ?? undefined });
    return;
  }

  state.latest = latest;

  if (process.env.CC_STATUSLINE_UPDATE_DRY_RUN) {
    writeUpdateState({ ...state, status: 'available' });
    return;
  }

  writeUpdateState({ ...state, status: 'installing' });
  const result = installLatest(latest);
  writeUpdateState({
    ...state,
    status: result.outcome === 'done' ? 'done' : result.outcome === 'blocked' ? 'blocked' : 'idle',
    message: result.message,
  });
}

void run().catch(() => {
  // Detached background process — never surface errors.
});
