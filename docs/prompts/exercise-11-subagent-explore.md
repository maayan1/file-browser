# Exercise 11 — Hand the big read to a subagent

## 1. Original prompt (verbatim)

```text
I am working on Exercise 11: "Hand the big read to a subagent."

Use a built-in Explore subagent to perform a read-only investigation of the File Browser project's folder-loading and file-display flow.

The subagent should:

1. Find where the user selects a local folder.
2. Trace how the File System Access API is used to read folder entries.
3. Follow how file and folder data moves from the initial selection to the React UI.
4. Identify where sorting, filtering, and file metadata are handled.
5. Identify the main functions, components, and files involved.
6. Note any architectural risks or potential violations of CLAUDE.md and .claude/rules/.

Return a concise report containing:
- A step-by-step description of the data flow.
- The important file paths and functions.
- Up to 3 potential issues worth investigating.

Important constraints:
- Explicitly delegate the investigation to an Explore subagent.
- Do not perform the full investigation in the main agent.
- Keep detailed file reads and search results inside the subagent's context.
- Return only a concise summary to the main agent.
- Do not modify files.
- Do not run git commit or git push.

When the subagent finishes, identify the agent that ran and present its final summary.
```

## 2. Subagent evidence

| Field | Value |
|---|---|
| Agent type | `Explore` (built-in, read-only) |
| Task description | "Trace folder-loading data flow" |
| Status | completed |
| Duration | 46,300 ms (about 46 seconds) |
| Tool uses inside the subagent | 6 |
| Tokens used inside the subagent's own context | 42,016 |
| Files modified | none |

These values come from the harness's task-completion notification. The main agent read no project files during the investigation. It only wrote the delegation prompt and relayed the returned report.

## 3. Subagent findings (not independently verified)

Everything in this section is the Explore subagent's report. The main agent did not check the file paths or line numbers itself.

### Data flow

1. **Click.** The `FolderPicker` button (`src/components/FolderPicker.tsx`) calls `handleSelectFolder` in `src/App.tsx`.
2. **Pick.** `handleSelectFolder` turns on loading, clears the error and the filter, then calls `window.showDirectoryPicker()` with no options, so access defaults to read-only.
3. **Read.** `buildFileTree` (`src/lib/fileSystem.ts`) goes through `entries()` one entry at a time:
   - It calls itself for each subfolder.
   - For each file it calls `getFile()` to record `size`, `lastModified` and `mimeType`.
   - It sorts folders first, then by name. This is the only sorting in the app.
4. **State.** `App.tsx` stores the tree with `setRootNode`, expands the root folder and clears `selectedFile`. Any error other than the user cancelling (`AbortError`) shows as an error banner.
5. **Filter.** A memoized `filterTree` (`src/lib/filterTree.ts`) matches names without regard to case and keeps the parent folders of each match. While a filter is active, every folder is forced open. `src/lib/treeExpansion.ts` tracks which folders are open.
6. **Tree.** `FileTree.tsx` renders the tree. The large-file badge comes from `isLargeFile` (`src/lib/fileSize.ts`, more than 10 MiB). Clicking a file selects it.
7. **Detail pane.** `FileDetail.tsx` shows the type, size, modified time with relative time (`src/lib/relativeTime.ts`), and path. It renders `ImagePreview` for files whose type starts with `image/`.
8. **Image preview.** `ImagePreview.tsx` creates an object URL, then runs `getImageDimensions` and `extractExif` (`src/lib/exif.ts`) at the same time. Its cleanup releases the URL.

The subagent found no network calls, browser storage, file writes or `readwrite` permission in `src`, and no React in `src/lib/`.

### Potential issues (as reported)

1. **One bad entry fails the whole folder** (`src/lib/fileSystem.ts`). Nothing catches errors per entry, so one unreadable file or subfolder discards the entire tree. Reading is also one entry at a time, with no progress shown, which is slow on large folders. No test covers this path.
2. **Leftover state after cancel or failure** (`src/App.tsx`):
   - The filter is cleared before the picker opens, so cancelling loses the filter but keeps the old tree.
   - If loading fails, the old tree and selected file stay on screen under the error banner.
3. **Missing input checks and tests in `src/lib`:**
   - `formatFileSize` and `formatDate` don't handle `NaN` or negative values.
   - `src/lib/exif.ts` has no tests.
   - `src/utils/dateFormatter.ts` sits outside `src/lib/`.

## 4. `/context` measurements

| Metric | Before | After | Difference |
|---|---|---|---|
| Context used | 64.5K | 75.4K | +10.9K |
| Messages | 28.9K | 39.8K | +10.9K |
| Free space | 902.5K | 891.6K | -10.9K |

"Before" was taken just before the Exercise 11 prompt. "After" was taken once the subagent had finished and its summary had been presented.

## 5. Interpretation

The subagent did the detailed work in its own separate context: 6 tool calls covering file reads and searches, about 42K tokens. None of those file contents or search results entered the main conversation. The main context grew by 10.9K tokens, which covers:

- the Exercise 11 prompt
- the delegation prompt sent to the subagent
- coordination messages and the task notification
- the subagent's returned report
- the main agent's summary of that report

The subagent's 42K tokens and the main context's 10.9K growth are not directly comparable. The measurements don't show how large the main context would have grown if the main agent had done the investigation itself, so **they do not prove an exact token or cost saving**. The subagent's own tokens still count toward total usage. What the numbers do show is that the main context grew by about the size of a summary, not by the size of every file read.

## 6. When a subagent would be wasteful

Delegation has a fixed overhead. The subagent starts with no context, so it needs a self-contained prompt, has to re-discover project context, and returns a report that the main agent then reads and relays. That overhead is only worth it when the investigation is broad: many files, many searches, or exploratory reading whose raw output isn't needed afterwards.

A subagent is wasteful for small, targeted reads, for example:

- reading one small function, such as `isLargeFile` in `src/lib/fileSize.ts`
- reading a single short file, such as `src/components/FolderPicker.tsx`
- a single `grep` for one symbol

In these cases a direct `Read` or `Grep` costs fewer tokens than the delegation prompt plus the returned report. It is also faster, with no subagent startup, and puts the exact source in front of the main agent rather than a secondhand summary.
