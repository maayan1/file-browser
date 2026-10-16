import type { FileNode } from './types';

/**
 * Returns a pruned copy of the tree that contains only nodes whose name
 * includes `query` (case-insensitive), keeping all ancestor directories of
 * any match visible.
 *
 * Rules:
 *  - A file is included when its name matches.
 *  - A directory is included when its own name matches (all children kept),
 *    OR when at least one descendant matches (only matching subtree kept).
 *  - Returns null when nothing in the subtree matches.
 *
 * The original tree is never mutated.
 */
export function filterTree(node: FileNode, query: string): FileNode | null {
  const q = query.toLowerCase();
  const nameMatches = node.name.toLowerCase().includes(q);

  if (node.kind === 'file') {
    return nameMatches ? node : null;
  }

  // Directory: if its own name matches, keep it with all children intact.
  if (nameMatches) {
    return node;
  }

  // Otherwise recurse into children and keep those that have matches.
  const filteredChildren = (node.children ?? [])
    .map((child) => filterTree(child, query))
    .filter((child): child is FileNode => child !== null);

  if (filteredChildren.length === 0) {
    return null;
  }

  return { ...node, children: filteredChildren };
}
