import { useState } from 'react';
import { FolderPicker } from './components/FolderPicker';
import { FileTree } from './components/FileTree';
import { FileDetail } from './components/FileDetail';
import { buildFileTree } from './lib/fileSystem';
import type { FileNode } from './lib/types';
import './App.css';

export default function App() {
  const [rootNode, setRootNode] = useState<FileNode | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSelectFolder() {
    try {
      setIsLoading(true);
      setError(null);
      const dirHandle = await window.showDirectoryPicker();
      const tree = await buildFileTree(dirHandle);
      setRootNode(tree);
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
          <aside className="app-tree" role="tree" aria-label="File tree">
            <FileTree
              node={rootNode}
              selectedPath={selectedFile?.path ?? null}
              onSelect={setSelectedFile}
              defaultExpanded
            />
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
