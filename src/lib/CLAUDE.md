# src/lib — working conventions

Complements `.claude/rules/core-logic.md` (no React, pure `.ts`, `null` fallbacks, tests per function). This file covers how the existing modules behave and what their callers rely on.

## Where things live

| Module | Owns | Called from |
|---|---|---|
| `fileSystem.ts` | `buildFileTree` (recursive read of a directory handle) | `App.tsx` |
| `filterTree.ts` | `filterTree` (name filter for the tree) | `App.tsx` |
| `fileUtils.ts` | `formatFileSize`, `formatDate`, `isImageFile`, `getFileTypeLabel` | `FileDetail.tsx` |
| `fileSize.ts` | `isLargeFile`, `LARGE_FILE_THRESHOLD_BYTES` | `FileTree.tsx` |
| `relativeTime.ts` | `formatRelativeTime` | `FileDetail.tsx` |
| `exif.ts` | `extractExif`, `getImageDimensions` | `ImagePreview.tsx` |

Add a helper to the module that owns its concern. Make a new module only for a new concern, and keep it in `src/lib/`, never a parallel `src/utils/`.

## Invalid metadata

- `FileNode.size`, `lastModified` and `mimeType` are optional. A file can be missing any of them, and a directory never has them.
- The older helpers in `fileUtils.ts` don't guard their input: `formatFileSize(NaN)` and `formatDate(NaN)` produce garbage. `FileDetail.tsx` checks for `undefined` before calling them and passes `mimeType ?? ''`. Keep those call-site guards, and don't remove them because a helper looks safe.
- New metadata helpers should guard like `isLargeFile` and `formatRelativeTime`: check `typeof x === 'number' && Number.isFinite(x)` first, then return `false` for predicates or `null` for formatters.
- `extractExif` swallows every error and returns `null`; `getImageDimensions` rejects. `ImagePreview.tsx` awaits both together inside one `try/catch`, so a missing or broken EXIF block must keep resolving to `null`. If it threw, the dimensions would be lost too.

## Predictable formatting

These outputs are pinned by tests or visible in the UI. Change them only when the task asks for it.

- `formatFileSize`: binary steps (1024) labelled `B/KB/MB/GB/TB`, always two decimals (`"512.00 B"`, `"1.50 KB"`), and `0` is exactly `"0 B"`.
- `isLargeFile`: strictly greater than 10 MiB. Exactly 10 MiB is not large. Folders are never large.
- `formatRelativeTime`: floors each unit, months are capped at 11, and anything under a minute is `"just now"`.
- `formatDate` uses `toLocaleString()`, so its output depends on locale and time zone. Tests must not assert an exact string from it.
- Tree order from `buildFileTree`: directories first, then names via `localeCompare(…, { sensitivity: 'base' })`. `filterTree` keeps this order, and the UI doesn't sort again.
- `filterTree` never mutates its input. It returns the original node when the whole subtree is kept and a shallow copy when children were pruned. Matching is a case-insensitive substring on `name`.

## Compatibility with callers

- Don't change the signature or return type of an existing export in place. Turning `string` into `string | null`, for example, breaks callers in `src/components/`. Add a new export, or update every caller in the same change and say so.
- Keep named exports and current file names. Components import by path (`../lib/fileUtils`), with no barrel file.
- `extractExif` loads `exifr` with `await import('exifr')` so it stays out of the main bundle. Don't turn it into a static import.
