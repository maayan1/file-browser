import { useState, useEffect } from 'react';
import type { ExifData, ImageDimensions } from '../lib/types';
import { extractExif, getImageDimensions } from '../lib/exif';

interface ImagePreviewProps {
  handle: FileSystemFileHandle;
}

export function ImagePreview({ handle }: ImagePreviewProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let createdUrl: string | null = null;

    async function load() {
      setIsLoading(true);
      setObjectUrl(null);
      setDimensions(null);
      setExifData(null);

      try {
        const file = await handle.getFile();
        if (cancelled) return;

        const url = URL.createObjectURL(file);
        createdUrl = url;

        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }

        setObjectUrl(url);

        const [dims, exif] = await Promise.all([
          getImageDimensions(url),
          extractExif(file),
        ]);

        if (cancelled) return;
        setDimensions(dims);
        setExifData(exif);
      } catch {
        // silently ignore load errors
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [handle]);

  if (isLoading) {
    return <div className="image-preview image-preview--loading">Loading preview…</div>;
  }

  if (!objectUrl) return null;

  return (
    <div className="image-preview">
      <img src={objectUrl} alt="Preview" className="image-preview__img" />

      {dimensions && (
        <p className="image-preview__dims">
          {dimensions.width} &times; {dimensions.height} px
        </p>
      )}

      {exifData && Object.keys(exifData).length > 0 && (
        <section className="detail-section">
          <h3 className="detail-section-title">EXIF Data</h3>
          <dl className="detail-list">
            {Object.entries(exifData)
              .filter(([, v]) => v !== null && v !== undefined)
              .slice(0, 30)
              .map(([key, value]) => (
                <div key={key} className="detail-row">
                  <dt>{formatExifKey(key)}</dt>
                  <dd>{formatExifValue(value)}</dd>
                </div>
              ))}
          </dl>
        </section>
      )}
    </div>
  );
}

function formatExifKey(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').trim();
}

function formatExifValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toLocaleString();
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
