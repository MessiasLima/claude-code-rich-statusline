export const PACKAGE_NAME = '@appoutlet/cc-statusline';

// Scoped names must be URL-encoded (`/` → `%2F`) in registry paths.
const LATEST_URL = `https://registry.npmjs.org/${PACKAGE_NAME.replace('/', '%2F')}/latest`;

const TIMEOUT_MS = 5000;

/** Fetch the latest published version from npm, or `null` on any failure/timeout. */
export async function fetchLatestVersion(): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(LATEST_URL, { signal: controller.signal });
    if (!res.ok) return null;
    const body = (await res.json()) as { version?: string };
    return body.version ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
