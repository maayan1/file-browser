---
name: verify-feature
description: Verify that a feature or change in this File Browser is ready for review. Inspects the changed files, runs `npm run check` (TypeScript, ESLint, Vitest), summarizes the results, and gives a ready / not-ready verdict, without fixing, committing, or pushing. Use when the user asks to "verify this feature", "check whether this change is ready", "is this ready for review", "run the project checks", "run the checks", or "make sure everything passes", or after finishing a feature before asking to commit.
---

# Verify a feature

Report on the current change as a reviewer would. This is a read-and-report procedure: do not edit files, do not commit, do not push.

## 1. See what changed

Run from the repo root (the folder with `package.json`):

- `git status --short` lists modified, staged, and untracked files.
- `git diff` and `git diff --staged` show the edits. Read any untracked source and test files in full.

Note which features the change touches and whether it adds or updates tests under `src/__tests__/`. Flag anything in the diff that breaks `.claude/rules/` (network calls, storage, file writes, React imports in `src/lib/`), and flag `settings.local.json` or other local or secret files if they would be staged.

## 2. Run the checks

Run `npm run check` once, from the repo root. It runs, in order, and stops at the first failure:

1. `tsc --noEmit` (TypeScript)
2. `eslint src --ext .ts,.tsx` (lint)
3. `vitest run` (tests)

Because it stops at the first failure, a TypeScript error means lint and tests did **not** run. Report them as "not run", never as passing. Ignore `Ignoring extra certs from C:\certs\eset-ca.pem` warnings: they come from the local Node/antivirus setup, not the project.

## 3. Report

Use this shape:

**Changes reviewed:** files and a one-line description of what the change does.

| Check | Result |
|---|---|
| TypeScript | ✅ 0 errors / ❌ N errors / ⏭ not run |
| Lint | ✅ / ❌ N errors, M warnings / ⏭ not run |
| Tests | ✅ X/Y passed in Z files / ❌ N failed / ⏭ not run |

**Failures:** for each, the file:line, the message, and the likely cause. Quote the real output.

**Rule or scope concerns:** anything from step 1, or "none".

**Verdict:** **Ready for review** only if every check passed and there are no rule concerns. Otherwise **Not ready**, plus the shortest list of what blocks it.

## Boundaries

- Do not fix failures, even small ones, unless the user asks after seeing the report. Suggest the fix instead.
- Unrelated problems you notice go under a "Noticed, not fixed" line. Never fix them silently.
- Never `git add`, `git commit`, or `git push`, and never rerun the checks with flags that skip or weaken them (`--no-verify`, skipping tests, disabling lint rules).
