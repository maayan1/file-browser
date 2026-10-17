# File Browser

A React app that runs only in the browser and never changes files. The user picks a local folder and browses it in memory.
Detailed rules: `.claude/rules/project-boundaries.md` (applies everywhere) and `.claude/rules/core-logic.md` (applies to `src/lib/**`).

## Forbidden

- **No backend or server code**: the app is browser-only, and the browser loading the app is its only traffic.
- **No network requests at runtime** (`fetch`, XHR, WebSocket, CDN assets): users trust the app because their files never leave the browser.
- **No persistent storage** (`localStorage`, `sessionStorage`, IndexedDB, cookies, Cache API): state resets on reload, so nothing about the user's files is kept.
- **No writes to user files** (`createWritable()`, `removeEntry()`, `readwrite` permission): the app is read-only, so a bug can never damage a user's folder.
- **No new `.js`/`.jsx` source files**: `npm run check` type-checks TypeScript only. Existing configs such as `.eslintrc.cjs` keep their format.
- **No `git commit` or `git push` without my explicit approval**: I review each exercise before it is committed.
- **Never weaken tests or checks** (`--no-verify`, skipped tests, disabled lint rules): a green `npm run check` is what "done" means.
- **Never modify or commit `docs/course/`**: it is the course's reference deck, and it is gitignored on purpose.

The boundaries file (no silent changes to existing features) and the core-logic file (no React in `src/lib/`) add more rules.

## Conventions

- For `src/lib/` (pure functions, shared types, tests), follow `.claude/rules/core-logic.md`.
- Component tests (`src/__tests__/*.test.tsx`) use `react-dom/client` with `act` from `react` and set `globalThis.IS_REACT_ACT_ENVIRONMENT = true`. Testing Library is not installed.
- Styling uses the CSS variables in `src/styles/tokens.css`.
- To skip an unused item when destructuring, use a hole (`[, v]`), not `[_k, v]`, to avoid `no-unused-vars`.
- The File System Access types (`showDirectoryPicker`, `entries()`) are declared by hand in `src/vite-env.d.ts`. Add new ones there.
- Do only what the task asks. Report unrelated bugs, don't fix them.
- Save each exercise prompt word for word as `docs/prompts/exercise-NN-<slug>.md`. Commit messages follow `Exercise N: <summary>`.

## Stack

React 18 · TypeScript 5.5 (strict) · Vite 5 · Vitest 2 (jsdom) · ESLint 8 with legacy `.eslintrc.cjs` (not flat config) · `exifr` 7 for EXIF · browser File System Access API.

## Commands

Run from the repo root:

- `npm run dev`: start the dev server.
- `npm run check`: runs `tsc --noEmit`, then `eslint`, then `vitest run`. It stops at the first failure, so later steps count as **not run**, not as passed. It must pass before a change is done.
- `npm run build`: `tsc --noEmit` plus `vite build`.
- `npm run preview`: serve the production build.
- Ignore the warning `Ignoring extra certs from C:\certs\eset-ca.pem`. It comes from the local antivirus setup.

## Open Questions

- **`src/CLAUDE.md`:** it is empty and untracked. Keep it or remove it?
- **`src/utils/`:** `dateFormatter.ts` (from Exercise 7) sits outside `src/lib/` and has no tests. Keep it, move it into `src/lib/`, or delete it?
- **Settings files:** `settings.json` and `settings.local.json` are at the repo root, but Claude Code reads project settings from `.claude/`. Is that intended? Should `settings.local.json` be gitignored?
- **Hard-coded colors:** `App.css` has a few, such as `#6b1f1f` and `#fff`. Must every color use a token?
- **Browsers:** `showDirectoryPicker` only exists in Chromium-based browsers. Is Firefox or Safari support a goal?
- **Node version:** not pinned (no `engines` field, no `.nvmrc`).
