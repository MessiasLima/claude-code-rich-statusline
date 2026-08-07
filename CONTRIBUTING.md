# Contributing to cc-statusline

Thanks for considering a contribution. This project is a small, dependency-free TypeScript CLI, so
the workflow is intentionally lightweight.

## Setup

```bash
git clone https://github.com/MessiasLima/cc-statusline.git
cd cc-statusline
npm install        # installs dev deps and wires the Husky pre-push hook
```

## Commands

```bash
npm run build          # bundle src/cli.ts + src/update.ts → dist/ (esbuild, minified, CJS)
npm run typecheck      # tsc --noEmit (strict mode)
npm run lint           # ESLint
npm run lint:fix       # ESLint with auto-fix
npm run format         # Prettier (write)
npm run format:check   # Prettier (check only)
```

There is no test suite. `prepublishOnly` runs `typecheck && lint && build`, and a Husky **pre-push**
hook enforces `typecheck + lint + format:check` before every push — make sure those pass locally
before opening a PR.

## Pull requests

- Keep changes focused; one feature or fix per PR.
- Run `npm run typecheck && npm run lint && npm run format:check` before pushing.
- Update `README.md` if the change affects user-facing behavior or configuration.
