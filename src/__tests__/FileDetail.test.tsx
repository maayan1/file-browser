import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { FileDetail } from '../components/FileDetail';
import { formatDate } from '../lib/fileUtils';
import type { FileNode } from '../lib/types';

declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 9, 17, 12, 0, 0);

function file(lastModified?: number): FileNode {
  return { name: 'notes.txt', path: 'docs/notes.txt', kind: 'file', size: 42, mimeType: 'text/plain', lastModified };
}

let container: HTMLDivElement;
let root: Root;

function render(node: FileNode) {
  act(() => {
    root.render(<FileDetail node={node} />);
  });
}

function lastModifiedRow(): HTMLElement | null {
  const row = Array.from(container.querySelectorAll('.detail-row')).find(
    (r) => r.querySelector('dt')?.textContent === 'Last Modified',
  );
  return (row?.querySelector('dd') as HTMLElement | null) ?? null;
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.useRealTimers();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('FileDetail — relative time', () => {
  it('shows the absolute date with the relative label beside it', () => {
    const modified = NOW - 3 * DAY;
    render(file(modified));

    const dd = lastModifiedRow()!;
    expect(dd.textContent).toContain(formatDate(modified));
    expect(dd.querySelector('.detail-relative-time')?.textContent).toBe('3 days ago');
  });

  it('hides the Last Modified row when the timestamp is missing', () => {
    render(file(undefined));
    expect(lastModifiedRow()).toBeNull();
    expect(container.querySelector('.detail-relative-time')).toBeNull();
  });

  it('keeps the row but omits the label when the timestamp is invalid', () => {
    render(file(NaN));
    expect(lastModifiedRow()).not.toBeNull();
    expect(container.querySelector('.detail-relative-time')).toBeNull();
  });
});
