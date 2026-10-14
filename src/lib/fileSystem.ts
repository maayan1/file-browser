import type { FileNode } from './types';

export async function buildFileTree(
  dirHandle: FileSystemDirectoryHandle,
  parentPath = '',
): Promise<FileNode> {
  const nodePath = parentPath ? `${parentPath}/${dirHandle.name}` : dirHandle.name;

  const node: FileNode = {
    name: dirHandle.name,
    path: nodePath,
    kind: 'directory',
    children: [],
    handle: dirHandle,
  };

  const entries: FileNode[] = [];

  for await (const [name, handle] of dirHandle.entries()) {
    if (handle.kind === 'directory') {
      const child = await buildFileTree(
        handle as FileSystemDirectoryHandle,
        nodePath,
      );
      entries.push(child);
    } else {
      const fileHandle = handle as FileSystemFileHandle;
      const file = await fileHandle.getFile();
      entries.push({
        name,
        path: `${nodePath}/${name}`,
        kind: 'file',
        size: file.size,
        lastModified: file.lastModified,
        mimeType: file.type,
        handle: fileHandle,
      });
    }
  }

  entries.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'directory' ? -1 : 1;
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
  });

  node.children = entries;
  return node;
}
