Let's complete Exercise 12 using the connected codebase-memory-mcp server.

1. Use the codebase-memory-mcp `index_repository` tool to index the current File Browser project.
2. Use `index_status` or `list_projects` to verify that indexing completed successfully.
3. Use the graph tools to find the function `formatRelativeTime` in `src/lib/relativeTime.ts`.
4. Answer this structural question: **Who calls formatRelativeTime?**
5. Show the actual graph tool name used, the returned callers, and the file paths.
6. Explain the results to me in simple Hebrew, including how the function is used in the File Browser UI.

Important:
- Use the actual MCP graph tools, not just Grep or text search.
- If the graph returns no results, investigate indexing coverage before concluding that there are no callers.
- Do not modify application source files.
- Do not commit or push anything yet.
