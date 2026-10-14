import { describe, it, expect } from 'vitest';
import { formatFileSize, formatDate, isImageFile, getFileTypeLabel } from '../lib/fileUtils';

describe('formatFileSize', () => {
  it('returns "0 B" for zero bytes', () => {
    expect(formatFileSize(0)).toBe('0 B');
  });

  it('formats bytes', () => {
    expect(formatFileSize(512)).toBe('512.00 B');
  });

  it('formats kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1.00 KB');
    expect(formatFileSize(2048)).toBe('2.00 KB');
  });

  it('formats megabytes', () => {
    expect(formatFileSize(1048576)).toBe('1.00 MB');
  });

  it('formats gigabytes', () => {
    expect(formatFileSize(1073741824)).toBe('1.00 GB');
  });

  it('formats fractional units', () => {
    expect(formatFileSize(1536)).toBe('1.50 KB');
  });
});

describe('formatDate', () => {
  it('returns a non-empty string for a valid timestamp', () => {
    const result = formatDate(0);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('produces a different string for different timestamps', () => {
    const d1 = formatDate(0);
    const d2 = formatDate(Date.now());
    expect(d1).not.toBe(d2);
  });
});

describe('isImageFile', () => {
  it('returns true for image/* MIME types', () => {
    expect(isImageFile('image/jpeg')).toBe(true);
    expect(isImageFile('image/png')).toBe(true);
    expect(isImageFile('image/gif')).toBe(true);
    expect(isImageFile('image/webp')).toBe(true);
    expect(isImageFile('image/svg+xml')).toBe(true);
  });

  it('returns false for non-image MIME types', () => {
    expect(isImageFile('text/plain')).toBe(false);
    expect(isImageFile('application/pdf')).toBe(false);
    expect(isImageFile('video/mp4')).toBe(false);
    expect(isImageFile('audio/mpeg')).toBe(false);
    expect(isImageFile('')).toBe(false);
  });
});

describe('getFileTypeLabel', () => {
  it('returns "Folder" for directories regardless of MIME type', () => {
    expect(getFileTypeLabel('', 'directory')).toBe('Folder');
    expect(getFileTypeLabel('image/jpeg', 'directory')).toBe('Folder');
  });

  it('returns "Unknown" for an empty MIME type on a file', () => {
    expect(getFileTypeLabel('', 'file')).toBe('Unknown');
  });

  it('returns a human-readable label for known MIME types', () => {
    expect(getFileTypeLabel('image/jpeg', 'file')).toBe('JPEG Image');
    expect(getFileTypeLabel('image/png', 'file')).toBe('PNG Image');
    expect(getFileTypeLabel('application/pdf', 'file')).toBe('PDF Document');
    expect(getFileTypeLabel('text/plain', 'file')).toBe('Plain Text');
    expect(getFileTypeLabel('application/json', 'file')).toBe('JSON File');
  });

  it('falls back to the raw MIME type for unknown types', () => {
    expect(getFileTypeLabel('application/octet-stream', 'file')).toBe('application/octet-stream');
    expect(getFileTypeLabel('application/x-custom', 'file')).toBe('application/x-custom');
  });
});
