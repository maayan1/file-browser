import { useState, useMemo } from 'react';
import { FolderPicker } from './components/FolderPicker';
import { FileTree } from './components/FileTree';
import { FileDetail } from './components/FileDetail';
import { buildFileTree } from './lib/fileSystem';
import { filterTree } from './lib/filterTree';
import { collectDirectoryPaths, togglePath } from './lib/treeExpansion';
import type { FileNode } from './lib/types';
import './App.css';

export default function App() {
  const [rootNode, setRootNode] = useState<FileNode | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [expandedPaths, setExpandedPaths] = useState<ReadonlySet<string>>(() => new Set());

  const isFiltering = filterQuery.trim().length > 0;

  function handleToggle(path: string) {
    setExpandedPaths((prev) => togglePath(prev, path));
  }

  function handleExpandAll() {
    setExpandedPaths(collectDirectoryPaths(rootNode));
  }

  function handleCollapseAll() {
    setExpandedPaths(new Set());
  }

  const displayedTree = useMemo(() => {
    const q = filterQuery.trim();
    if (!rootNode || !q) return rootNode;
    return filterTree(rootNode, q);
  }, [rootNode, filterQuery]);

  async function handleSelectFolder() {
    try {
      setIsLoading(true);
      setError(null);
      setFilterQuery('');
      const dirHandle = await window.showDirectoryPicker();
      const tree = await buildFileTree(dirHandle);
      setRootNode(tree);
      setExpandedPaths(new Set([tree.path]));
      setSelectedFile(null);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(`Failed to open folder: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">File Browser</h1>
        <FolderPicker onSelect={handleSelectFolder} isLoading={isLoading} />
      </header>

      {error && <div className="app-error">{error}</div>}

      {!rootNode && !isLoading && (
        <div className="app-empty">
          <p>Select a folder to view all its files and subfolders in the app</p>
          <span className="app-empty-hint">
            In the system dialog, navigate to the folder you want and confirm —
            files are not shown there, but everything inside will appear here
          </span>
          <span className="app-empty-hint">
            Your files stay on your computer. Nothing is uploaded.
          </span>
        </div>
      )}

      {isLoading && (
        <div className="app-empty">
          <p>Reading folder…</p>
        </div>
      )}

      {rootNode && !isLoading && (
        <div className="app-browser">
          <aside className="app-sidebar">
            <div className="tree-filter">
              <div className="tree-filter__wrapper">
                <input
                  className="tree-filter__input"
                  type="text"
                  placeholder="Filter files and folders..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  aria-label="Filter files and folders"
                />
                {filterQuery && (
                  <button
                    className="tree-filter__clear"
                    onClick={() => setFilterQuery('')}
                    aria-label="Clear filter"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="tree-actions">
                <button
                  type="button"
                  className="tree-actions__button"
                  onClick={handleExpandAll}
                  disabled={isFiltering}
                  title={isFiltering ? 'Clear the filter to expand or collapse folders' : undefined}
                >
                  Expand All
                </button>
                <button
                  type="button"
                  className="tree-actions__button"
                  onClick={handleCollapseAll}
                  disabled={isFiltering}
                  title={isFiltering ? 'Clear the filter to expand or collapse folders' : undefined}
                >
                  Collapse All
                </button>
              </div>
            </div>
            <div className="app-tree" role="tree" aria-label="File tree">
              {displayedTree ? (
                <FileTree
                  node={displayedTree}
                  selectedPath={selectedFile?.path ?? null}
                  onSelect={setSelectedFile}
                  expandedPaths={expandedPaths}
                  onToggle={handleToggle}
                  forceExpand={isFiltering}
                />
              ) : (
                <p className="tree-no-match">No matching files or folders</p>
              )}
            </div>
          </aside>
          <main className="app-detail">
            {selectedFile ? (
              <FileDetail node={selectedFile} />
            ) : (
              <div className="detail-empty">Select a file to view its details</div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
