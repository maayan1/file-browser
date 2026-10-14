interface FolderPickerProps {
  onSelect: () => void;
  isLoading: boolean;
}

export function FolderPicker({ onSelect, isLoading }: FolderPickerProps) {
  return (
    <button
      className="folder-picker-btn"
      onClick={onSelect}
      disabled={isLoading}
    >
      {isLoading ? 'Reading folder…' : 'Select Folder to Explore'}
    </button>
  );
}
