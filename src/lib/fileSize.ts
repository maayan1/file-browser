import type { FileNode } from './types';

/** Files strictly larger than this many bytes (10 MiB) are considered large. */
export const LARGE_FILE_THRESHOLD_BYTES = 10 * 1024 * 1024;

/** True only for file nodes whose size is strictly greater than 10 MiB. Folders are never large. */
export function isLargeFile(node: FileNode): boolean {
  if (node.kind !== 'file') return false;
  if (typeof node.size !== 'number' || !Number.isFinite(node.size)) return false;
  return node.size > LARGE_FILE_THRESHOLD_BYTES;
}
