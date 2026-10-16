# Exercise 3 – All Seven Prompting Techniques
## Feature: Large File Badge

<!-- Technique 7: DATA FIRST -->
<project_data>
Project: File Browser
Stack: React, TypeScript, Vite

Existing functionality:
- Local folder selection
- Hierarchical file tree
- File metadata
- Image preview and EXIF
- File Tree Filter Box (Exercise 2)

Relevant files to inspect:
- src/App.tsx
- src/components/FileTree.tsx
- src/lib/fileSystem.ts
- src/lib/fileUtils.ts
- src/lib/types.ts
- src/styles/tokens.css
- src/__tests__/

Existing validation command:
npm run check

Project constraints:
- Browser-only application
- No backend or network requests
- No localStorage or IndexedDB
- No writing to users' files
- Framework-independent logic in src/lib/
- CSS variables for styling
</project_data>

<!-- Technique 3: GIVE A ROLE -->
<role>
You are a senior React and TypeScript developer specializing in file management interfaces, accessible UI components, and automated testing.

Extend the existing application while preserving its functionality.
</role>

<!-- Technique 1: BE SPECIFIC -->
<task>
Implement one feature: a "Large file" badge in the file tree.

Requirements:
1. Display a visible badge labeled "Large file" next to files larger than 10 MiB.
2. Use the exact threshold of 10 * 1024 * 1024 bytes.
3. Files exactly at the threshold must not receive a badge.
4. Do not display badges on folders.
5. Display the badge for supported files regardless of their file type.
6. Ensure the badge works for files inside nested folders.
7. Preserve the existing file selection and filtering behavior.
8. Use existing design tokens and maintain readable, accessible styling.
9. Keep file-size classification logic independent of React inside src/lib/.
10. Add automated tests for threshold boundaries and nested files.
</task>

<!-- Technique 2: MULTISHOT -->
<examples>
  <example id="1">
    Input: notes.txt, 2 MiB
    Expected: No badge
  </example>

  <example id="2">
    Input: video.mp4, 15 MiB
    Expected: Display "Large file"
  </example>

  <example id="3">
    Input: archive.zip, exactly 10 MiB
    Expected: No badge
  </example>

  <example id="4">
    Input: report.pdf, 10 MiB + 1 byte
    Expected: Display "Large file"
  </example>

  <example id="5">
    Input: Folder containing a 20 MiB file
    Expected: Badge only on the file, not on the folder
  </example>
</examples>

<!-- Technique 4: XML STRUCTURE -->
<scope>
In scope:
- File-size classification
- Large file badge in the existing file tree
- Minimal styling changes
- Automated tests

Out of scope:
- No new file-size filtering
- No file compression
- No file uploads
- No changes to image preview or EXIF
- No unrelated redesign
</scope>

<acceptance_criteria>
The feature is complete when:
- Large files display the badge correctly.
- Files at or below the threshold do not display it.
- Folders never display the badge.
- Nested files are supported.
- The Filter Box from Exercise 2 still works.
- npm run check passes successfully.
</acceptance_criteria>

<!-- Technique 6: BRIEF ONCE -->
<execution>
This is the complete development brief.

Inspect the current implementation, implement the feature, add automated tests, and run npm run check.

Fix any failures caused by your changes.

Do not implement unrelated features.

Save this exact prompt in:
docs/prompts/exercise-03-large-file-badge.md

Do not create a Git commit yet. Wait for my approval.
</execution>

<!-- Technique 5: DIAL EFFORT, NOT WORDS -->
<effort_configuration>
The reasoning effort level is configured separately in Claude Code.

Do not change the effort setting from within this prompt.
</effort_configuration>

<output_format>
After implementation, report in English:

1. Implementation Summary
2. Files Changed
3. Automated Test Results
4. Manual Verification Steps
5. Known Limitations
</output_format>
