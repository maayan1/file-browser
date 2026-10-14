import type { ExifData, ImageDimensions } from './types';

export async function extractExif(file: File): Promise<ExifData | null> {
  try {
    const { parse } = await import('exifr');
    const data = await parse(file, { tiff: true, exif: true, gps: true });
    return (data as ExifData) ?? null;
  } catch {
    return null;
  }
}

export function getImageDimensions(objectUrl: string): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = objectUrl;
  });
}
