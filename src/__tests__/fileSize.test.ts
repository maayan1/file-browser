import { describe, it, expect } from 'vitest';
import { isLargeFile, LARGE_FILE_THRESHOLD_BYTES } from '../lib/fileSize';
import { filterTree } from '../lib/filterTree';
import type { FileNode } from '../lib/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MiB = 1024 * 1024;

function file(name: string, size?: number): FileNode {
  return { name, path: name, kind: 'file', size };
}

function dir(name: string, children: FileNode[]): FileNode {
  return { name, path: name, kind: 'directory', children };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('isLargeFile', () => {
  it('uses an exact threshold of 10 * 1024 * 1024 bytes', () => {
    expect(LARGE_FILE_THRESHOLD_BYTES).toBe(10_485_760);
  });

  // Example 1
  it('returns false for a 2 MiB file', () => {
    expect(isLargeFile(file('notes.txt', 2 * MiB))).toBe(false);
  });

  // Example 2
  it('returns true for a 15 MiB file', () => {
    expect(isLargeFile(file('video.mp4', 15 * MiB))).toBe(true);
  });

  // Example 3
  it('returns false for a file exactly at 10 MiB', () => {
    expect(isLargeFile(file('archive.zip', 10 * MiB))).toBe(false);
  });

  // Example 4
  it('returns true for a file at 10 MiB + 1 byte', () => {
    expect(isLargeFile(file('report.pdf', 10 * MiB + 1))).toBe(true);
  });

  it('returns false for a file at 10 MiB - 1 byte', () => {
    expect(isLargeFile(file('almost.bin', 10 * MiB - 1))).toBe(false);
  });

  it('returns false for an empty file', () => {
    expect(isLargeFile(file('empty.txt', 0))).toBe(false);
  });

  it('returns false when the size is unknown or not finite', () => {
    expect(isLargeFile(file('unknown.dat'))).toBe(false);
    expect(isLargeFile(file('nan.dat', NaN))).toBe(false);
    expect(isLargeFile(file('inf.dat', Infinity))).toBe(false);
  });

  it('ignores file type — any large file qualifies', () => {
    for (const name of ['a.mp4', 'b.zip', 'c.pdf', 'd', 'e.unknownext']) {
      expect(isLargeFile(file(name, 11 * MiB))).toBe(true);
    }
  });

  // Example 5
  it('never treats a directory as large, even if it holds a large file', () => {
    const folder = dir('Videos', [file('movie.mp4', 20 * MiB)]);
    expect(isLargeFile(folder)).toBe(false);
    expect(isLargeFile(folder.children![0])).toBe(true);
  });

  it('never treats a directory as large even if it carries a size value', () => {
    const weird: FileNode = { name: 'x', path: 'x', kind: 'directory', size: 50 * MiB };
    expect(isLargeFile(weird)).toBe(false);
  });

  it('classifies deeply nested files correctly', () => {
    const tree = dir('root', [
      dir('a', [dir('b', [dir('c', [file('big.iso', 700 * MiB), file('small.txt', 1)])])]),
    ]);
    const c = tree.children![0].children![0].children![0];
    expect(isLargeFile(c)).toBe(false);
    expect(c.children!.map(isLargeFile)).toEqual([true, false]);
  });

  it('still classifies a large nested file after filtering', () => {
    const tree = dir('root', [dir('media', [file('clip.mp4', 12 * MiB), file('notes.txt', 1)])]);
    const filtered = filterTree(tree, 'clip');
    const clip = filtered!.children![0].children![0];
    expect(clip.name).toBe('clip.mp4');
    expect(isLargeFile(clip)).toBe(true);
  });
});
