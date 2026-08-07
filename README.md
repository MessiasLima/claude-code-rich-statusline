# cc-statusline

![Screenshot](docs/screenshot2.png)

A rich, multi-line status line for [Claude Code](https://claude.ai/code) — context window usage,
model name + reasoning effort, current project, git branch, and your Claude plan rate-limit usage
as progress bars. Written in TypeScript, shipped as a single dependency-free Node binary.

> **Note:** Only tested on macOS.

## Preview

```
◈ 42% · ◆ Opus (high) · ⌂ my-project · ⎇ main
⏱ ██░░░░░░░░ 23% (resets 14:30) · ▦ ████░░░░░░ 41% (resets Fri)
```

> Line 2 (rate-limit bars) only appears for Claude.ai Pro/Max subscribers, after the first API
> response in a session.

## Requirements

- [Claude Code](https://claude.ai/code) CLI
- [Node.js](https://nodejs.org) ≥ 18 (only `git` is used at runtime; no other external tools)
- A terminal with ANSI color support

## Setup

### Recommended: global install

```bash
npm install -g @appoutlet/cc-statusline
```

Then add this to `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "cc-statusline"
  }
}
```

A global install is recommended because the status line runs on **every render** — the binary is
invoked directly with no per-render resolution overhead.

### Alternative: no install (npx)

```json
{
  "statusLine": {
    "type": "command",
    "command": "npx -y @appoutlet/cc-statusline"
  }
}
```

`npx` re-resolves the package on every render, so it is noticeably slower for a status line, and it
does not run the auto-update. Use `-y` because stdin carries the JSON payload and cannot answer
npx's first-run install prompt.

## Auto-update

When installed globally, `cc-statusline` keeps itself current with npm. At most once every 24 hours
it checks the registry in a **detached background process** — it never delays a render — and, when a
newer version is published, updates the global install in place. A dim `⬆ vX.Y.Z` indicator appears
on line 1 while an update is pending or if it could not be applied.

If the npm global prefix isn't writable by your user, the auto-update can't run; the `⬆` indicator
then reminds you to update manually:

```bash
npm i -g @appoutlet/cc-statusline@latest
```

Environment variables:

| Variable                        | Effect                                   |
| ------------------------------- | ---------------------------------------- |
| `CC_STATUSLINE_NO_UPDATE`       | Disable update checks entirely           |
| `CC_STATUSLINE_UPDATE_DRY_RUN`  | Check and notify (`⬆`) but never install |
| `CC_STATUSLINE_UPDATE_INTERVAL` | Hours between checks (default `24`)      |

## What it displays

| Symbol | Field                     | Source                                 |
| ------ | ------------------------- | -------------------------------------- |
| `◈`    | Context window usage (%)  | `context_window.used_percentage`       |
| `◆`    | Model name + effort level | `model.display_name` + `effort.level`  |
| `⌂`    | Project folder name       | `workspace.current_dir`                |
| `⎇`    | Git branch                | `git branch --show-current`            |
| `⏱`    | 5-hour rate-limit bar     | `rate_limits.five_hour` (Pro/Max only) |
| `▦`    | 7-day rate-limit bar      | `rate_limits.seven_day` (Pro/Max only) |
| `⬆`    | Update available          | background update check                |

All symbols above are defaults — see [Customization](#customization) to change them.

### Progress bar colors

The icon, bar, and percentage are all colored by usage level:

| Range  | Color  |
| ------ | ------ |
| 0–60%  | Green  |
| 61–80% | Yellow |
| 81–95% | Orange |
| > 95%  | Red    |

## Customization

Every icon, the progress-bar characters, the bar width, and the segment separator are configurable
via the `ccStatusline` key in `~/.claude/settings.local.json` (falling back to
`~/.claude/settings.json`). The local file wins per-key. Settings missing from both files keep their
defaults; an unparseable or invalid value also falls back to its default. Set an icon to `""` to hide
its glyph.

> **Recommended: put `ccStatusline` in `settings.local.json`, not `settings.json`.** `ccStatusline` is
> a custom key that Claude Code's own settings schema doesn't recognize, so tools (including Claude
> Code itself, when asked to edit your settings) may reject the write or drop the key from
> `settings.json`. `settings.local.json` isn't validated against that schema, so it's the safe place
> for this block — and it's also gitignored by default, which suits a personal display preference
> better than a shared, version-controlled file anyway.

```jsonc
// ~/.claude/settings.local.json
{
  "ccStatusline": {
    "icons": {
      "context": "◈", // context-window usage
      "model": "◆", // model + reasoning effort
      "directory": "⌂", // current folder name
      "branch": "⎇", // git branch
      "update": "⬆", // pending update
      "fiveHour": "⏱", // 5-hour rate-limit window
      "week": "▦", // 7-day rate-limit window
    },
    "progressBar": {
      "filled": "█", // used cells
      "empty": "░", // remaining cells
      "width": 10, // total cells
    },
    "separator": " · ", // joins segments and windows
  },
}
```

## How it works

Claude Code pipes a JSON payload to the configured command on stdin. `cc-statusline` parses it with
native `JSON.parse` (no `jq` needed), composes the two lines, and prints them — then, only when due,
fires a throttled background update check that exits without blocking output.

## Contributing

Want to work on `cc-statusline` itself? See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, commands,
and architecture notes.

## License

[Apache 2.0](./LICENSE)
