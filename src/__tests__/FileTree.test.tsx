import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { FileTree } from '../components/FileTree';
import type { FileNode } from '../lib/types';

declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MiB = 1024 * 1024;

function file(path: string, size: number): FileNode {
  return { name: path.split('/').pop()!, path, kind: 'file', size };
}

function dir(path: string, children: FileNode[]): FileNode {
  return { name: path.split('/').pop()!, path, kind: 'directory', children };
}

let container: HTMLDivElement;
let root: Root;

function render(node: FileNode, onSelect: (n: FileNode) => void = () => {}) {
  act(() => {
    root.render(
      <FileTree node={node} selectedPath={null} onSelect={onSelect} defaultExpanded forceExpand />,
    );
  });
}

/** Returns the row element for the node with the given visible name. */
function rowFor(name: string): HTMLElement {
  const nameEl = Array.from(container.querySelectorAll('.tree-name')).find(
    (el) => el.textContent === name,
  );
  if (!nameEl) throw new Error(`No row named ${name}`);
  return nameEl.parentElement!;
}

function hasBadge(name: string): boolean {
  return rowFor(name).querySelector('.tree-badge--large') !== null;
}

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('FileTree large file badge', () => {
  it('shows the badge only on files strictly larger than 10 MiB', () => {
    render(
      dir('root', [
        file('root/notes.txt', 2 * MiB),
        file('root/video.mp4', 15 * MiB),
        file('root/archive.zip', 10 * MiB),
        file('root/report.pdf', 10 * MiB + 1),
      ]),
    );

    expect(hasBadge('notes.txt')).toBe(false);
    expect(hasBadge('video.mp4')).toBe(true);
    expect(hasBadge('archive.zip')).toBe(false);
    expect(hasBadge('report.pdf')).toBe(true);
    expect(rowFor('video.mp4').querySelector('.tree-badge')?.textContent).toBe('Large file');
  });

  it('shows the badge on a nested file but never on its folders', () => {
    render(dir('root', [dir('root/Videos', [dir('root/Videos/2026', [file('root/Videos/2026/big.mov', 20 * MiB)])])]));

    expect(hasBadge('big.mov')).toBe(true);
    expect(hasBadge('root')).toBe(false);
    expect(hasBadge('Videos')).toBe(false);
    expect(hasBadge('2026')).toBe(false);
    expect(container.querySelectorAll('.tree-badge')).toHaveLength(1);
  });

  it('keeps file selection working on a row with a badge', () => {
    const selected: string[] = [];
    render(dir('root', [file('root/video.mp4', 15 * MiB)]), (n) => selected.push(n.path));

    act(() => {
      rowFor('video.mp4').querySelector<HTMLElement>('.tree-badge')!.click();
    });

    expect(selected).toEqual(['root/video.mp4']);
  });
});
