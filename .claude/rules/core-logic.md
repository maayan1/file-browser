---
paths:
  - "src/lib/**"
---

# Core logic — `src/lib/` stays framework-independent

`src/lib/` is the app's core: tree building, filtering, size and date formatting, EXIF. It is kept free of React so its edge cases can be unit-tested directly in Vitest without rendering anything, and so the UI layer can change without touching it.

- Never import `react`, `react-dom`, or any component from `src/components/` in `src/lib/`. Dependencies point one way: components import lib, never the reverse.
- No JSX and no `.tsx` files here. Write plain `.ts` modules.
- Prefer pure functions: inputs in, value out, no hidden state. Pass changing inputs, like the current time, in as parameters with a sensible default (see `formatRelativeTime(timestamp, now = Date.now())`) so tests can pin them.
- Handle missing or invalid input explicitly (`undefined`, `NaN`, non-finite numbers) and return a clear fallback such as `null` instead of throwing or rendering "NaN".
- Shared types belong in `src/lib/types.ts`.
- Every new or changed function gets focused tests in `src/__tests__/<module>.test.ts`, covering its boundaries.
- Browser platform APIs needed for the data itself (File System Access handles, `File`, `Image` for dimensions) are fine. UI concerns are not: DOM rendering, styling, and event handling belong in components.
