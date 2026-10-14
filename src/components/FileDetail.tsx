import type { FileNode } from '../lib/types';
import { formatFileSize, formatDate, getFileTypeLabel, isImageFile } from '../lib/fileUtils';
import { ImagePreview } from './ImagePreview';

interface FileDetailProps {
  node: FileNode;
}

export function FileDetail({ node }: FileDetailProps) {
  const showPreview = node.mimeType != null && isImageFile(node.mimeType) && node.handle != null;

  return (
    <div className="file-detail">
      <h2 className="detail-filename">{node.name}</h2>

      {showPreview && (
        <ImagePreview handle={node.handle as FileSystemFileHandle} />
      )}

      <section className="detail-section">
        <h3 className="detail-section-title">Metadata</h3>
        <dl className="detail-list">
          <div className="detail-row">
            <dt>Name</dt>
            <dd>{node.name}</dd>
          </div>
          <div className="detail-row">
            <dt>Type</dt>
            <dd>{getFileTypeLabel(node.mimeType ?? '', 'file')}</dd>
          </div>
          {node.size !== undefined && (
            <div className="detail-row">
              <dt>Size</dt>
              <dd>{formatFileSize(node.size)}</dd>
            </div>
          )}
          {node.lastModified !== undefined && (
            <div className="detail-row">
              <dt>Last Modified</dt>
              <dd>{formatDate(node.lastModified)}</dd>
            </div>
          )}
          <div className="detail-row">
            <dt>Path</dt>
            <dd className="detail-path">{node.path}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
