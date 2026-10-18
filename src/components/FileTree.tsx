import type { FileNode } from '../lib/types';
import { isLargeFile } from '../lib/fileSize';

interface FileTreeProps {
  node: FileNode;
  selectedPath: string | null;
  onSelect: (node: FileNode) => void;
  /** Paths of the directories that are open. Owned by the parent. */
  expandedPaths: ReadonlySet<string>;
  /** Called with a directory's path when its row is clicked or Enter is pressed. */
  onToggle: (path: string) => void;
  depth?: number;
  /** When true, all directories are shown as expanded (used during filtering). */
  forceExpand?: boolean;
}

export function FileTree({
  node,
  selectedPath,
  onSelect,
  expandedPaths,
  onToggle,
  depth = 0,
  forceExpand = false,
}: FileTreeProps) {
  const effectiveExpanded = forceExpand || expandedPaths.has(node.path);
  const indent = depth * 14;

  if (node.kind === 'file') {
    const isSelected = selectedPath === node.path;
    return (
      <div
        className={`tree-item tree-file${isSelected ? ' tree-item--selected' : ''}`}
        style={{ paddingLeft: `${indent + 28}px` }}
        onClick={() => onSelect(node)}
        role="treeitem"
        aria-selected={isSelected}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onSelect(node)}
      >
        <span className="tree-icon tree-icon--file" aria-hidden="true" />
        <span className="tree-name">{node.name}</span>
        {isLargeFile(node) && (
          <span className="tree-badge tree-badge--large" title="Larger than 10 MiB">
            Large file
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="tree-directory" role="treeitem" aria-expanded={effectiveExpanded}>
      <div
        className="tree-item tree-dir-row"
        style={{ paddingLeft: `${indent + 6}px` }}
        onClick={() => onToggle(node.path)}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggle(node.path)}
      >
        <span className={`tree-chevron${effectiveExpanded ? ' tree-chevron--open' : ''}`} aria-hidden="true" />
        <span className="tree-icon tree-icon--folder" aria-hidden="true" />
        <span className="tree-name">{node.name}</span>
      </div>
      {effectiveExpanded && node.children && (
        <div role="group">
          {node.children.map((child) => (
            <FileTree
              key={child.path}
              node={child}
              selectedPath={selectedPath}
              onSelect={onSelect}
              expandedPaths={expandedPaths}
              onToggle={onToggle}
              depth={depth + 1}
              forceExpand={forceExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}
