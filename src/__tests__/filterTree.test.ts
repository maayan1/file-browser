import { describe, it, expect } from 'vitest';
import { filterTree } from '../lib/filterTree';
import type { FileNode } from '../lib/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function file(name: string): FileNode {
  return { name, path: name, kind: 'file' };
}

function dir(name: string, children: FileNode[]): FileNode {
  return { name, path: name, kind: 'directory', children };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('filterTree', () => {
  // Example 1 – filter by filename
  it('returns only matching files, keeping the parent directory', () => {
    const tree = dir('Documents', [file('report.pdf'), file('notes.txt')]);
    const result = filterTree(tree, 'report');

    expect(result).not.toBeNull();
    expect(result?.name).toBe('Documents');
    expect(result?.children).toHaveLength(1);
    expect(result?.children![0].name).toBe('report.pdf');
  });

  // Example 2 – case-insensitive
  it('matches case-insensitively', () => {
    const tree = dir('Images', [file('photo.jpg'), file('logo.png')]);
    const result = filterTree(tree, 'PHOTO');

    expect(result?.children).toHaveLength(1);
    expect(result?.children![0].name).toBe('photo.jpg');
  });

  // Example 3 – nested match, parents preserved
  it('preserves all ancestor directories when a deeply nested file matches', () => {
    const tree = dir('Projects', [
      dir('2026', [file('final-report.pdf'), file('draft.txt')]),
    ]);
    const result = filterTree(tree, 'final');

    expect(result?.name).toBe('Projects');
    const year = result?.children![0];
    expect(year?.name).toBe('2026');
    expect(year?.children).toHaveLength(1);
    expect(year?.children![0].name).toBe('final-report.pdf');
  });

  // Example 4 – no results
  it('returns null when nothing matches', () => {
    const tree = dir('root', [file('hello.txt'), file('world.md')]);
    expect(filterTree(tree, 'xyz123')).toBeNull();
  });

  // A directory whose own name matches is returned with all children
  it('keeps all children when the directory name itself matches', () => {
    const tree = dir('root', [
      dir('Documents', [file('a.txt'), file('b.pdf')]),
    ]);
    const result = filterTree(tree, 'documents');

    const docs = result?.children![0];
    expect(docs?.name).toBe('Documents');
    expect(docs?.children).toHaveLength(2); // both children kept
  });

  // Non-matching siblings are excluded
  it('excludes sibling files that do not match', () => {
    const tree = dir('root', [
      file('report.pdf'),
      file('notes.txt'),
      file('summary.pdf'),
    ]);
    const result = filterTree(tree, 'report');
    const names = result?.children!.map((c) => c.name);

    expect(names).toContain('report.pdf');
    expect(names).not.toContain('notes.txt');
    expect(names).not.toContain('summary.pdf');
  });

  // Empty directory with no descendants
  it('returns null for a directory tree with no matching nodes', () => {
    const tree = dir('root', [dir('empty', [])]);
    expect(filterTree(tree, 'xyz')).toBeNull();
  });

  // Original tree must not be mutated
  it('does not mutate the original tree', () => {
    const original = dir('root', [file('keep.txt'), file('remove.md')]);
    filterTree(original, 'keep');
    expect(original.children).toHaveLength(2); // unchanged
  });

  // Partial name match
  it('matches on a partial name substring', () => {
    const tree = dir('root', [file('typescript-config.json'), file('readme.md')]);
    const result = filterTree(tree, 'script');

    expect(result?.children).toHaveLength(1);
    expect(result?.children![0].name).toBe('typescript-config.json');
  });

  // Multi-level with mixed matches
  it('handles multiple levels where only some branches match', () => {
    const tree = dir('root', [
      dir('src', [file('index.ts'), file('utils.ts')]),
      dir('docs', [file('readme.md')]),
    ]);
    const result = filterTree(tree, 'index');

    expect(result?.children).toHaveLength(1);
    expect(result?.children![0].name).toBe('src');
    expect(result?.children![0].children).toHaveLength(1);
    expect(result?.children![0].children![0].name).toBe('index.ts');
  });
});
