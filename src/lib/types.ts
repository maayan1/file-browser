export interface FileNode {
  name: string;
  path: string;
  kind: 'file' | 'directory';
  size?: number;
  lastModified?: number;
  mimeType?: string;
  children?: FileNode[];
  handle?: FileSystemFileHandle | FileSystemDirectoryHandle;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export type ExifData = Record<string, unknown>;
