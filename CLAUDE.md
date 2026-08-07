# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build          # bundle src/cli.ts + src/update.ts → dist/ (esbuild, minified, CJS)
npm run typecheck      # tsc --noEmit (no emit, strict mode)
npm run lint           # ESLint
npm run lint:fix       # ESLint with auto-fix
npm run format         # Prettier (write)
npm run format:check   # Prettier (check only)
```

There is no test suite. `prepublishOnly` runs `typecheck && lint && build`.

A husky pre-push hook enforces `typecheck + lint + format:check` before every push.

## Architecture

### Data flow

Claude Code pipes a JSON payload to `cc-statusline` via stdin on every prompt render. The flow is:

```
stdin JSON → input.ts (parse) → config.ts (read theme) → statusline.ts (build lines) → stdout
                                                 ↓ (fire-and-forget)
                                       update/trigger.ts → spawns dist/update.js detached
```

`src/cli.ts` is the entry point that ties these together — read it first.

### Line composition

`statusline.ts` exports two functions:

- `buildLine1(input, config)` — joins up to 5 segment strings with `config.separator`, skipping empty strings
- `buildLine2(input, config)` — returns the rate-limit bar string (empty when no rate-limit data)

Each segment lives in `src/segments/` and returns a formatted string or `""`. Segments are pure
functions of the parsed input plus a `StatuslineConfig` (icons + progress-bar chars) — no side
effects, no I/O.

### Adding a segment

1. Create `src/segments/my-segment.ts` exporting a function that accepts `StatusLineInput` (+ a `StatuslineIcons` when it renders a glyph) and returns a colored string or `""`.
2. Import and call it in `statusline.ts` inside `buildLine1()` (or `buildLine2()` for bar-style output).
3. Use `paint(COLOR, text)` from `colors.ts` for ANSI coloring.

### Display config

`config.ts` resolves the display theme (`icons`, `progressBar`, `separator`) from the `ccStatusline`
key in `~/.claude/settings.local.json` then `~/.claude/settings.json`, merged over defaults in
`DEFAULT_CONFIG`. `cli.ts` calls `readConfig()` once per render and passes the result down — segments
never read config files themselves.

`ccStatusline` is a custom key unknown to Claude Code's own settings schema, so writes to
`settings.json` (including edits made by Claude Code itself) can be rejected or stripped. Recommend
`settings.local.json` — unvalidated against that schema — as the place users set this key; docs and
examples should point there first.

### Update mechanism

`update/trigger.ts` spawns `dist/update.js` as a detached child process (non-blocking, fire-and-forget). The worker (`src/update.ts`) checks the npm registry, compares semver via `update/version.ts`, and persists state to `~/.claude/.cc-statusline/update.json`. `src/segments/update-indicator.ts` reads that persisted state to show the `⬆` indicator — no network I/O at render time.

Update checks are skipped when running via `npx` and throttled to once every 24 hours by default.

### Key types

`src/types.ts` defines `StatusLineInput` (the stdin JSON schema from Claude Code) and `RateLimitWindow`. All segments receive a `StatusLineInput` and must handle missing/undefined fields gracefully.

### Settings fallback

`src/settings.ts` reads `~/.claude/settings.local.json` then `~/.claude/settings.json` to resolve `reasoningEffort` as a fallback when the JSON input omits it. This is the only file that does disk I/O at render time (besides `update-indicator.ts` which reads a small state file).

### Build output

esbuild produces two self-contained binaries:

- `dist/cli.js` — the main statusline renderer (bin entry)
- `dist/update.js` — the background update worker (spawned by trigger.ts)

Both are minified CommonJS with a `#!/usr/bin/env node` shebang. There are no runtime npm dependencies.
