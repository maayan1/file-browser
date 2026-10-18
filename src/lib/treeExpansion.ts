import type { FileNode } from './types';

/**
 * Returns the paths of every directory in the tree, including `node` itself
 * when it is a directory. Files are skipped. Returns an empty set for `null`.
 *
 * Walks the tree with an explicit stack instead of recursion, so very deep
 * folder structures cannot overflow the call stack.
 */
export function collectDirectoryPaths(node: FileNode | null): Set<string> {
  const paths = new Set<string>();
  if (!node) return paths;

  const stack: FileNode[] = [node];
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current.kind !== 'directory') continue;

    paths.add(current.path);
    for (const child of current.children ?? []) {
      stack.push(child);
    }
  }

  return paths;
}

/**
 * Returns a new set with `path` removed if it was present, or added if it was
 * not. The input set is never mutated, so it is safe to use with React state.
 */
export function togglePath(paths: ReadonlySet<string>, path: string): Set<string> {
  const next = new Set(paths);
  if (next.has(path)) {
    next.delete(path);
  } else {
    next.add(path);
  }
  return next;
}
