export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), units.length - 1);
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

export function getFileTypeLabel(mimeType: string, kind: 'file' | 'directory'): string {
  if (kind === 'directory') return 'Folder';
  if (!mimeType) return 'Unknown';
  const labels: Record<string, string> = {
    'image/jpeg': 'JPEG Image',
    'image/png': 'PNG Image',
    'image/gif': 'GIF Image',
    'image/webp': 'WebP Image',
    'image/svg+xml': 'SVG Image',
    'image/avif': 'AVIF Image',
    'application/pdf': 'PDF Document',
    'text/plain': 'Plain Text',
    'text/html': 'HTML File',
    'text/css': 'CSS File',
    'text/javascript': 'JavaScript File',
    'application/json': 'JSON File',
    'application/zip': 'ZIP Archive',
    'video/mp4': 'MP4 Video',
    'audio/mpeg': 'MP3 Audio',
  };
  return labels[mimeType] ?? mimeType;
}
