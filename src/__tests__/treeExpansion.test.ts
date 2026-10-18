import { describe, it, expect } from 'vitest';
import { collectDirectoryPaths, togglePath } from '../lib/treeExpansion';
import type { FileNode } from '../lib/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function file(path: string): FileNode {
  return { name: path.split('/').pop()!, path, kind: 'file', size: 1 };
}

function dir(path: string, children?: FileNode[]): FileNode {
  return { name: path.split('/').pop()!, path, kind: 'directory', children };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('collectDirectoryPaths', () => {
  it('returns an empty set for a null tree', () => {
    expect(collectDirectoryPaths(null).size).toBe(0);
  });

  it('returns an empty set when the node is a file', () => {
    expect(collectDirectoryPaths(file('notes.txt')).size).toBe(0);
  });

  it('returns only the root for an empty folder, with or without a children array', () => {
    expect([...collectDirectoryPaths(dir('root', []))]).toEqual(['root']);
    expect([...collectDirectoryPaths(dir('root'))]).toEqual(['root']);
  });

  it('collects every nested folder and skips files', () => {
    const tree = dir('root', [
      dir('root/a', [dir('root/a/b', [file('root/a/b/deep.txt')]), file('root/a/x.txt')]),
      dir('root/empty', []),
      file('root/top.txt'),
    ]);

    expect([...collectDirectoryPaths(tree)].sort()).toEqual(['root', 'root/a', 'root/a/b', 'root/empty']);
  });

  it('handles a very deep chain of folders without overflowing the stack', () => {
    let node = dir('d', []);
    for (let i = 0; i < 20000; i++) node = dir(`d${i}`, [node]);

    expect(collectDirectoryPaths(node).size).toBe(20001);
  });
});

describe('togglePath', () => {
  it('adds a path that is missing', () => {
    expect([...togglePath(new Set(['a']), 'b')]).toEqual(['a', 'b']);
  });

  it('removes a path that is present', () => {
    expect([...togglePath(new Set(['a', 'b']), 'a')]).toEqual(['b']);
  });

  it('returns a new set and never mutates the input', () => {
    const before = new Set(['a']);
    const after = togglePath(before, 'a');

    expect(after).not.toBe(before);
    expect([...before]).toEqual(['a']);
  });
});
