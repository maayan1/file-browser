import { useState } from 'react';
import type { FileNode } from '../lib/types';

interface FileTreeProps {
  node: FileNode;
  selectedPath: string | null;
  onSelect: (node: FileNode) => void;
  defaultExpanded?: boolean;
  depth?: number;
}

export function FileTree({
  node,
  selectedPath,
  onSelect,
  defaultExpanded = false,
  depth = 0,
}: FileTreeProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
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
    <div className="tree-directory" role="treeitem" aria-expanded={isExpanded}>
      <div
        className="tree-item tree-dir-row"
        style={{ paddingLeft: `${indent + 6}px` }}
        onClick={() => setIsExpanded((prev) => !prev)}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsExpanded((prev) => !prev)}
      >
        <span className={`tree-chevron${isExpanded ? ' tree-chevron--open' : ''}`} aria-hidden="true" />
        <span className="tree-icon tree-icon--folder" aria-hidden="true" />
        <span className="tree-name">{node.name}</span>
      </div>
      {isExpanded && node.children && (
        <div role="group">
          {node.children.map((child) => (
            <FileTree
              key={child.path}
              node={child}
              selectedPath={selectedPath}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
