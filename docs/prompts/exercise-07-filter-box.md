# Exercise 07 — Something Claude Remembers

## Goal
Teach Claude Code a project-specific preference using auto-memory and verify that the preference is followed in a new session.

## 1. Saved Project Memory

I instructed Claude Code to remember the following preference:

> For this project, remember that I prefer TypeScript over JavaScript for all new source files. Save this as a project-specific auto-memory so you can follow this preference in future sessions.

I used `/memory` and verified that the preference was saved in the project's `MEMORY.md` file.

## 2. Started a Fresh Session

I executed:

`/clear`

This cleared the previous conversation context.

## 3. Tested the Memory

In the fresh session, I asked Claude Code:

> Create a new source file named utils/dateFormatter that exports a function to format a date as YYYY-MM-DD.
>
> Choose the file extension according to this project's conventions. Do not modify any existing files.

I intentionally did not mention TypeScript or the `.ts` extension.

## 4. Observed Result

Claude Code created:

`utils/dateFormatter.ts`

The file contains a TypeScript function that formats a date as `YYYY-MM-DD`.

This matches the preference saved in the project's auto-memory.

## 5. Evidence

- Evidence 1: Confirmed the preference was saved in `MEMORY.md`.
- Evidence 2: Executed `/clear` before the test.
- Evidence 3: The new-session prompt did not explicitly request TypeScript.
- Evidence 4: Claude Code created `utils/dateFormatter.ts`.

Screenshot: Attach the screenshot showing `/clear`, the test prompt, and the newly created `.ts` file.

## 6. What I Learned

- Claude Code can store project-specific facts in auto-memory.
- Auto-memory can remain available across sessions.
- `/clear` removes the conversation history without deleting project memory.
- Only the first 200 lines or 25 KB of `MEMORY.md`, whichever limit is reached first, are loaded at session start.
- Keeping memory concise helps preserve important information.

## Conclusion

I successfully saved a project-specific preference and observed Claude Code follow it in a fresh session.

The result is consistent with the saved memory, although the project's existing TypeScript conventions could also have influenced the file-extension choice. Direct confirmation of the memory source would make the evidence stronger.

## 7. Final Verification — Confirming the Memory Source

After Claude Code created `utils/dateFormatter.ts`, I asked:

> Why did you choose the .ts extension for the new file? Did you use any saved project memory or instructions? Please identify the source of that preference.

Claude Code confirmed:

> Yes, it came from your saved project memory. The project's TypeScript setup backed it up.

Claude explained that:

- `MEMORY.md` was automatically loaded at the beginning of the new session.
- The memory contained my preference to use TypeScript for new source files.
- Claude used that saved preference when creating `utils/dateFormatter.ts`.
- The project’s existing TypeScript configuration supported the decision.
- Claude only opened the detailed `prefer-typescript.md` memory file later, when I asked it to explain its decision.

### Final Result

**Exercise 07: Completed successfully.**

I demonstrated that:

1. A project-specific preference was saved in Claude Code's auto-memory.
2. The preference remained available after `/clear`.
3. Claude created a TypeScript file without being explicitly reminded to use TypeScript.
4. Claude confirmed that the saved auto-memory influenced its decision.

### Conclusion

Claude Code's auto-memory allows important project preferences to persist across sessions. Unlike temporary conversation context, saved memory can influence Claude's behavior even after the conversation is cleared.

This exercise demonstrated the difference between temporary context and persistent project memory.