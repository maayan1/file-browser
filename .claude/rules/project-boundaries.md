# Project boundaries — browser-only

This app is a browser-only, read-only file explorer: the user picks a local folder and everything happens in memory on their machine. Users trust it because their files never leave the browser and are never changed.

- No backend: no server code, API routes, or server-side frameworks.
- No network requests: no `fetch`, XHR, WebSocket, or remote assets/CDNs at runtime. The browser loads the app, and that is the only traffic.
- No persistent storage: no `localStorage`, `sessionStorage`, IndexedDB, cookies, or Cache API. State lives in React memory and resets on reload.
- No writes to the user's files: use the File System Access handles only to read (`getFile()`, `entries()`). Never call `createWritable()`, `removeEntry()`, or request `readwrite` permission.
- Keep existing features working (folder picker, tree, filter box, large-file badge, detail pane with relative time, image preview + EXIF) unless the task explicitly asks to change one. If a change would alter one, say so instead of doing it silently.

If a task seems to need one of these, stop and ask: the boundary is a product decision, not an implementation detail.
