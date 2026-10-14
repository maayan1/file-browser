import { describe, it, expect, vi } from 'vitest';
import { buildFileTree } from '../lib/fileSystem';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeMockFile(name: string, size: number, type: string): File {
  return new File(['x'.repeat(size)], name, { type });
}

function mockFileHandle(name: string, file: File): FileSystemFileHandle {
  return {
    kind: 'file' as const,
    name,
    getFile: vi.fn().mockResolvedValue(file),
    isSameEntry: vi.fn(),
    queryPermission: vi.fn(),
    requestPermission: vi.fn(),
  } as unknown as FileSystemFileHandle;
}

function mockDirHandle(
  name: string,
  children: [string, FileSystemHandle][],
): FileSystemDirectoryHandle {
  return {
    kind: 'directory' as const,
    name,
    entries: vi.fn().mockImplementation(() =>
      (async function* () {
        for (const entry of children) yield entry;
      })(),
    ),
    isSameEntry: vi.fn(),
    queryPermission: vi.fn(),
    requestPermission: vi.fn(),
  } as unknown as FileSystemDirectoryHandle;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('buildFileTree', () => {
  it('creates a directory node at the root', async () => {
    const dir = mockDirHandle('Projects', []);
    const tree = await buildFileTree(dir);

    expect(tree.name).toBe('Projects');
    expect(tree.kind).toBe('directory');
    expect(tree.path).toBe('Projects');
    expect(tree.children).toHaveLength(0);
  });

  it('builds file children with correct metadata', async () => {
    const file = makeMockFile('photo.jpg', 2048, 'image/jpeg');
    const fh = mockFileHandle('photo.jpg', file);
    const dir = mockDirHandle('root', [['photo.jpg', fh]]);

    const tree = await buildFileTree(dir);
    const child = tree.children![0];

    expect(child.name).toBe('photo.jpg');
    expect(child.kind).toBe('file');
    expect(child.size).toBe(2048);
    expect(child.mimeType).toBe('image/jpeg');
    expect(child.path).toBe('root/photo.jpg');
  });

  it('sorts directories before files', async () => {
    const file = makeMockFile('readme.txt', 100, 'text/plain');
    const fh = mockFileHandle('readme.txt', file);
    const subDir = mockDirHandle('assets', []);

    // deliberately insert file before directory
    const dir = mockDirHandle('root', [
      ['readme.txt', fh],
      ['assets', subDir],
    ]);

    const tree = await buildFileTree(dir);

    expect(tree.children![0].kind).toBe('directory');
    expect(tree.children![0].name).toBe('assets');
    expect(tree.children![1].kind).toBe('file');
    expect(tree.children![1].name).toBe('readme.txt');
  });

  it('sorts siblings alphabetically within the same kind', async () => {
    const makeFile = (n: string) => mockFileHandle(n, makeMockFile(n, 1, 'text/plain'));
    const dir = mockDirHandle('root', [
      ['zebra.txt', makeFile('zebra.txt')],
      ['apple.txt', makeFile('apple.txt')],
      ['mango.txt', makeFile('mango.txt')],
    ]);

    const tree = await buildFileTree(dir);
    const names = tree.children!.map((c) => c.name);

    expect(names).toEqual(['apple.txt', 'mango.txt', 'zebra.txt']);
  });

  it('recursively builds nested directories', async () => {
    const file = makeMockFile('index.ts', 512, 'text/plain');
    const fh = mockFileHandle('index.ts', file);
    const inner = mockDirHandle('src', [['index.ts', fh]]);
    const outer = mockDirHandle('project', [['src', inner]]);

    const tree = await buildFileTree(outer);

    expect(tree.name).toBe('project');
    expect(tree.children![0].name).toBe('src');
    expect(tree.children![0].kind).toBe('directory');
    expect(tree.children![0].path).toBe('project/src');
    expect(tree.children![0].children![0].name).toBe('index.ts');
    expect(tree.children![0].children![0].path).toBe('project/src/index.ts');
  });

  it('constructs correct paths when a parentPath is provided', async () => {
    const file = makeMockFile('doc.pdf', 1024, 'application/pdf');
    const fh = mockFileHandle('doc.pdf', file);
    const dir = mockDirHandle('docs', [['doc.pdf', fh]]);

    const tree = await buildFileTree(dir, 'workspace');

    expect(tree.path).toBe('workspace/docs');
    expect(tree.children![0].path).toBe('workspace/docs/doc.pdf');
  });
});
