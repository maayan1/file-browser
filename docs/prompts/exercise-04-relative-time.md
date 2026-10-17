I'm building a browser-only React + TypeScript File Browser for an Agentic Engineering course. Users need to understand how recently a local file was modified without mentally comparing timestamps.

**Goal**

Add a Relative Time feature that displays a human-readable relative time next to the existing last-modified date in the selected file's details, such as "3 days ago".

**Done when**

The existing absolute modification date remains visible, with an accurate relative-time label beside it. The label handles recent timestamps, hour and day boundaries, older dates, and missing or invalid metadata gracefully.

The feature works for local files without network requests, backend services, or persistent storage. Existing Filter Box and Large File Badge behavior remains unchanged.

Use a pure TypeScript formatting utility in `src/lib` when calculating relative time, because keeping date logic separate from React makes boundary cases easier to test. Use the project's existing design tokens for any styling changes, because the interface should remain consistent.

The scope is limited to relative-time formatting, its display in the existing file-details UI, and focused tests. Note any unrelated bugs you notice in your final report, but do not fix them.

Run `npm run check` and report the TypeScript, lint, and test results. Also explain what should be verified manually in the running browser app.

Save this exact development prompt in `docs/prompts/exercise-04-relative-time.md` as the Exercise 4 prompt.

In your final report, summarize the changed files, the behavior implemented, the verification results, and any unrelated bugs noticed (or explicitly state that none were found).

Do not create a Git commit until I approve.
