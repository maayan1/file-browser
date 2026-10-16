# Exercise 2 – Six-Layer Development Prompt
## Feature: File Tree Filter Box

### Layer 1 – Role

You are an experienced React and TypeScript frontend developer specializing in clean architecture, maintainable code, and user-friendly interfaces.

Extend my existing application without breaking its current functionality.

### Layer 2 – Context + Reason

I am building a browser-based File Browser application as part of a Claude Code engineering course.

The application uses React, TypeScript, and Vite.

Current functionality includes:
- Selecting local folders.
- Displaying files and subfolders in a hierarchical tree.
- Viewing file metadata.
- Previewing images and displaying EXIF data when available.

Relevant project files include:
- `src/App.tsx`
- `src/components/FileTree.tsx`
- `src/lib/fileSystem.ts`
- `src/lib/fileUtils.ts`
- `src/styles/tokens.css`

**Why this feature matters:**

When users browse folders containing many files, finding a specific file becomes difficult.

A Filter Box will allow users to quickly locate files and folders by name without manually searching through the entire tree.

### Layer 3 – Task

Implement one new feature: a **Filter Box above the File Tree**.

Users should be able to type a filename or folder name and immediately see matching results.

### Layer 4 – Scope & Done

**In scope:**
- Add a search input above the file tree.
- Filter files and folders by name as the user types.
- Make filtering case-insensitive.
- Keep parent folders visible when nested files match.
- Automatically reveal nested matching results.
- Restore the full tree when the filter is cleared.
- Display "No matching files or folders" when no results exist.
- Add automated tests for the filtering logic.

**Out of scope:**
- No backend server.
- No network requests.
- No file content searching.
- No changes to local files.
- No persistent storage.
- No unrelated features.

**Done when:**
- Filtering works in the running application.
- Nested matches are visible.
- Clearing the filter restores the complete tree.
- Existing features continue working.
- `npm run check` passes successfully.

### Layer 5 – Format

Implement the feature directly in the existing project.

Keep the filtering logic independent of React inside `src/lib/`.

Use the existing CSS variables and design tokens.

After implementation, provide a report in English with these sections:

1. Implementation Summary
2. Files Changed
3. Test Results
4. Manual Verification Steps
5. Known Limitations

Save this exact development prompt in:

`docs/prompts/exercise-02-filter-box.md`

### Layer 6 – Examples

**Example 1: Filename filtering**

Original tree:

Documents/
- report.pdf
- notes.txt

Images/
- photo.jpg
- logo.png

User types: `report`

Expected result:

Documents/
- report.pdf

**Example 2: Case-insensitive matching**

User types: `PHOTO`

Expected result:
- photo.jpg

**Example 3: Nested folders**

Original tree:

Projects/
- 2026/
  - final-report.pdf

User types: `final`

Expected result:

Projects/
- 2026/
  - final-report.pdf

Parent folders should remain visible and expanded.

**Example 4: No results**

User types: `xyz123`

Expected message:

"No matching files or folders"

**Example 5: Clearing the filter**

When the input is cleared, the full original tree should reappear.

Preserve the previous folder expansion state where practical.

---

Implement only this feature. Run `npm run check`, fix any failures, and report the results in English.

Do not create a Git commit yet. Wait for my approval.