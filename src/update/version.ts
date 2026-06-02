/** Minimal semver comparison — sufficient for `x.y.z` release versions. */

function parse(version: string): number[] {
  return version
    .trim()
    .replace(/^v/, '')
    .split('-')[0] // ignore prerelease suffix
    .split('.')
    .map((part) => Number.parseInt(part, 10) || 0);
}

/** True when `candidate` is a strictly greater version than `current`. */
export function isNewer(candidate: string, current: string): boolean {
  const a = parse(candidate);
  const b = parse(current);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const diff = (a[i] ?? 0) - (b[i] ?? 0);
    if (diff !== 0) return diff > 0;
  }
  return false;
}
