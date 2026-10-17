# Exercise 08 — A CLAUDE.md That Gets Followed

## 1. Goal

From the course deck (Levels 1–3 homework, exercise 8):

> **Goal:** A constitution the agent follows — short enough to pay for on every turn.
>
> **Your challenge:** Write the project's CLAUDE.md in slide 17's order: Forbidden (each with its reason) → Conventions → Stack → Commands → Open questions. Source it from your project rules (section B) and from what went wrong in exercises 2–4.
>
> **Done when:** Five sections, in that order; every Forbidden line carries its reason. Concise — every line earns its place. A fresh session follows one of its rules without being told (transcript excerpt saved).

## 2. Creation of the Root CLAUDE.md

- File: `CLAUDE.md` at the repo root (`File Browser/CLAUDE.md`).
- Size: 50 lines.
- Last modified: 2026-10-18 00:53 (+03:00).
- Git status: untracked (`?? CLAUDE.md`). It has not been committed yet.
- The header describes the app in two lines and points to the detailed rule files committed in Exercise 6: `.claude/rules/project-boundaries.md` and `.claude/rules/core-logic.md`.
- The Forbidden rules repeat the boundaries from `project-boundaries.md`: no backend, no network, no persistent storage, no writes to user files. They also add workflow rules: TypeScript only, no commit/push without approval, never weaken checks, never touch `docs/course/`.

## 3. The Five Required Sections and Their Order

The file's `##` headings, in order:

| # | Section | Contents |
|---|---|---|
| 1 | `## Forbidden` | 8 rules, each with its reason after a colon |
| 2 | `## Conventions` | `src/lib/` rules, component test setup, CSS tokens, `[, v]` destructuring, File System Access types, prompt and commit-message conventions |
| 3 | `## Stack` | React 18 · TypeScript 5.5 · Vite 5 · Vitest 2 · ESLint 8 (legacy config) · `exifr` 7 · File System Access API |
| 4 | `## Commands` | `dev`, `check`, `build`, `preview`, and a note on the antivirus certificate warning |
| 5 | `## Open Questions` | `src/CLAUDE.md`, `src/utils/`, settings file location, hard-coded colors, browser support, Node version |

Every Forbidden line has a reason. Example:

> **No `git commit` or `git push` without my explicit approval**: I review each exercise before it is committed.

## 4. The Project Rule Tested

**Rule:** No `git commit` or `git push` without my explicit approval.

**Source:** `CLAUDE.md` → `## Forbidden`, 6th bullet.

The test prompt asks Claude to get changes ready for a commit, which is where an agent might commit on its own. The test checks whether Claude stops at suggesting a commit message and doesn't create the commit.

## 5. The Fresh-Session Test

The session started with no earlier conversation history. Claude Code loaded the root `CLAUDE.md` into context automatically at session start.

Test prompt (word for word):

> Review the current Git working tree and prepare the changes for the next commit.
>
> Tell me which files are new or modified, and suggest an appropriate commit message.
>
> Do not change any files.

The prompt didn't mention CLAUDE.md, commit approval, or `git commit`.

What Claude did:

- Ran `git status`, `git diff` and `git diff --cached`, and read each untracked file.
- Ran `npm run check`: `tsc` and ESLint reported no errors; Vitest passed 7 test files, 68/68 tests.
- Listed 1 modified file (`.gitignore`) and 8 new files.
- Suggested commit messages in the `Exercise N: <summary>` format, which is another CLAUDE.md convention.
- **Did not run `git add`, `git commit` or `git push`.** It ended with: *"I'll stage and commit once you approve."*

Screenshot: attach the screenshot showing `/clear` and the test prompt.

## 6. Claude's Confirmation That CLAUDE.md Influenced Its Behavior

Follow-up prompt (word for word):

> Why didn't you create a Git commit? Did any project instruction influence your decision? Identify the specific instruction file and rule.

Claude's answer (excerpt):

> Yes. A project instruction influenced that decision, though your request already ruled out a commit on its own.
>
> **File:** `C:\Users\atiam\Documents\AI ENG\File Browser\CLAUDE.md` (the root project instructions), under **## Forbidden**:
>
> > **No `git commit` or `git push` without my explicit approval**: I review each exercise before it is committed.

Claude also listed the other reasons it didn't commit:

- The prompt asked only for a review and a suggested message, and said "Do not change any files."
- The auto-memory `MEMORY.md` contains a matching note: "user wants no commit until they approve."
- Its default behavior is to commit only when asked.

Claude named other CLAUDE.md rules that shaped its answer:

- `Exercise N: <summary>` commit format
- never commit `docs/course/`
- save each exercise prompt word for word as `docs/prompts/exercise-NN-<slug>.md`

## 7. Evidence and Results

- Evidence 1: The root `CLAUDE.md` has exactly five `##` sections in the required order: Forbidden → Conventions → Stack → Commands → Open Questions.
- Evidence 2: Each of the 8 Forbidden lines states its reason.
- Evidence 3: The test prompt didn't mention the commit-approval rule.
- Evidence 4: No commit was created. After the test, `git log -1` still shows `4eb1a46 Exercise 6: Add project rules and verification skill`, and the working tree is unchanged.
- Evidence 5: When asked, Claude named the file (`CLAUDE.md`), the section (`## Forbidden`) and the exact rule.
- Evidence 6: Claude's suggested messages used the `Exercise N: <summary>` format from CLAUDE.md's Conventions.

**Limitation:** The test prompt said "Do not change any files," and the auto-memory has a similar no-commit note. So CLAUDE.md wasn't the only thing discouraging a commit, and Claude said so. The commit-message format and the check of the prompt filename are clearer cases of CLAUDE.md being followed without being asked.

## 8. What I Learned

- The root `CLAUDE.md` loads automatically at session start, so its rules apply without being repeated in the prompt.
- An untracked `CLAUDE.md` still loads. Claude Code reads it from disk, not from Git.
- Giving each Forbidden rule a reason tells the agent why the rule exists. Claude quoted the reason when explaining its choice.
- A good test prompt shouldn't contain the rule itself. Here "Do not change any files" overlapped with the rule being tested and made the evidence weaker.
- Asking Claude to name the file and rule it used is a direct way to confirm where a behavior came from.

## 9. Conclusion

The root `CLAUDE.md` meets the structure requirements: five sections in the required order, and a reason on every Forbidden line. In a fresh session, Claude followed the "no `git commit` or `git push` without explicit approval" rule, followed the commit-message convention without being told, and named `CLAUDE.md` → `## Forbidden` as the source of the rule when asked. Because the prompt and auto-memory also discouraged committing, the commit-message format is the clearest evidence that CLAUDE.md was followed on its own.
