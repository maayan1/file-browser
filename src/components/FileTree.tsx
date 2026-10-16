import { useState } from 'react';
import type { FileNode } from '../lib/types';

interface FileTreeProps {
  node: FileNode;
  selectedPath: string | null;
  onSelect: (node: FileNode) => void;
  defaultExpanded?: boolean;
  depth?: number;
  /** When true, all directories are shown as expanded (used during filtering). */
  forceExpand?: boolean;
}

export function FileTree({
  node,
  selectedPath,
  onSelect,
  defaultExpanded = false,
  depth = 0,
  forceExpand = false,
}: FileTreeProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const effectiveExpanded = forceExpand || isExpanded;
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
      </div>
    );
  }

  return (
    <div className="tree-directory" role="treeitem" aria-expanded={effectiveExpanded}>
      <div
        className="tree-item tree-dir-row"
        style={{ paddingLeft: `${indent + 6}px` }}
        onClick={() => setIsExpanded((prev) => !prev)}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsExpanded((prev) => !prev)}
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
              depth={depth + 1}
              forceExpand={forceExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}
