import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import App from '../App';

declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mockFileHandle(name: string): FileSystemFileHandle {
  return {
    kind: 'file' as const,
    name,
    getFile: vi.fn().mockResolvedValue(new File(['x'], name, { type: 'text/plain' })),
  } as unknown as FileSystemFileHandle;
}

function mockDirHandle(name: string, children: FileSystemHandle[]): FileSystemDirectoryHandle {
  return {
    kind: 'directory' as const,
    name,
    entries: vi.fn().mockImplementation(() =>
      (async function* () {
        for (const child of children) yield [child.name, child];
      })(),
    ),
  } as unknown as FileSystemDirectoryHandle;
}

let container: HTMLDivElement;
let root: Root;

/** Renders the app and opens `handle` through the folder picker. */
async function openFolder(handle: FileSystemDirectoryHandle) {
  window.showDirectoryPicker = vi.fn().mockResolvedValue(handle);
  act(() => {
    root.render(<App />);
  });
  await act(async () => {
    container.querySelector<HTMLButtonElement>('.folder-picker-btn')!.click();
    // Let the picker promise and the async tree walk settle.
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

function button(label: string): HTMLButtonElement {
  const found = Array.from(container.querySelectorAll<HTMLButtonElement>('.tree-actions__button')).find(
    (b) => b.textContent === label,
  );
  if (!found) throw new Error(`No button labelled ${label}`);
  return found;
}

function click(el: HTMLElement) {
  act(() => {
    el.click();
  });
}

function visibleNames(): string[] {
  return Array.from(container.querySelectorAll('.app-tree .tree-name')).map((el) => el.textContent ?? '');
}

function rowFor(name: string): HTMLElement {
  const nameEl = Array.from(container.querySelectorAll('.app-tree .tree-name')).find(
    (el) => el.textContent === name,
  );
  if (!nameEl) throw new Error(`No row named ${name}`);
  return nameEl.parentElement!;
}

function typeFilter(value: string) {
  const input = container.querySelector<HTMLInputElement>('.tree-filter__input')!;
  const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
  act(() => {
    setValue.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

const nestedFolder = () =>
  mockDirHandle('Projects', [
    mockDirHandle('src', [mockDirHandle('lib', [mockFileHandle('deep.ts')]), mockFileHandle('main.ts')]),
    mockDirHandle('docs', [mockFileHandle('guide.md')]),
    mockFileHandle('readme.txt'),
  ]);

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  delete (window as { showDirectoryPicker?: unknown }).showDirectoryPicker;
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('App expand all / collapse all', () => {
  it('opens a new folder with only its root expanded, as before', async () => {
    await openFolder(nestedFolder());

    expect(visibleNames()).toEqual(['Projects', 'docs', 'src', 'readme.txt']);
  });

  it('Expand All opens every folder, including nested ones', async () => {
    await openFolder(nestedFolder());

    click(button('Expand All'));

    expect(visibleNames()).toEqual([
      'Projects', 'docs', 'guide.md', 'src', 'lib', 'deep.ts', 'main.ts', 'readme.txt',
    ]);
    expect(container.querySelectorAll('[aria-expanded="false"]')).toHaveLength(0);
  });

  it('Collapse All closes every folder, leaving only the root row', async () => {
    await openFolder(nestedFolder());
    click(button('Expand All'));

    click(button('Collapse All'));

    expect(visibleNames()).toEqual(['Projects']);
    expect(container.querySelectorAll('[aria-expanded="true"]')).toHaveLength(0);
  });

  it('keeps single-folder toggling working after Expand All and Collapse All', async () => {
    await openFolder(nestedFolder());
    click(button('Expand All'));

    click(rowFor('src'));
    expect(visibleNames()).toEqual(['Projects', 'docs', 'guide.md', 'src', 'readme.txt']);

    click(button('Collapse All'));
    click(rowFor('Projects'));
    expect(visibleNames()).toEqual(['Projects', 'docs', 'src', 'readme.txt']);
  });

  it('keeps file selection working on a file revealed by Expand All', async () => {
    await openFolder(nestedFolder());
    click(button('Expand All'));

    click(rowFor('deep.ts'));

    expect(rowFor('deep.ts').getAttribute('aria-selected')).toBe('true');
    expect(container.querySelector('.detail-filename')?.textContent).toBe('deep.ts');
  });

  it('disables both buttons while filtering and keeps the expansion when the filter is cleared', async () => {
    await openFolder(nestedFolder());
    click(button('Collapse All'));

    typeFilter('deep');
    expect(button('Expand All').disabled).toBe(true);
    expect(button('Collapse All').disabled).toBe(true);
    expect(visibleNames()).toEqual(['Projects', 'src', 'lib', 'deep.ts']);

    typeFilter('');
    expect(button('Expand All').disabled).toBe(false);
    expect(visibleNames()).toEqual(['Projects']);
  });

  it('handles an empty folder safely', async () => {
    await openFolder(mockDirHandle('Empty', []));

    click(button('Expand All'));
    expect(visibleNames()).toEqual(['Empty']);
    expect(rowFor('Empty').parentElement!.getAttribute('aria-expanded')).toBe('true');

    click(button('Collapse All'));
    expect(rowFor('Empty').parentElement!.getAttribute('aria-expanded')).toBe('false');
  });
});
