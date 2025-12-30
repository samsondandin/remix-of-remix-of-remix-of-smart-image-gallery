import { useCallback } from 'react';

interface SortMenuProps {
  value: 'date' | 'confidence' | 'faceCount';
  dir: 'asc' | 'desc';
  onChange: (value: 'date' | 'confidence' | 'faceCount') => void;
  onToggleDir: () => void;
}

export function SortMenu({ value, dir, onChange, onToggleDir }: SortMenuProps) {
  const handleSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as SortMenuProps['value']);
  }, [onChange]);

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-muted-foreground">Sort:</label>
      <select
        value={value}
        onChange={handleSelect}
        className="rounded-md px-2 py-1 bg-card border border-border text-sm"
      >
        <option value="date">Date (newest)</option>
        <option value="confidence">Confidence</option>
        <option value="faceCount">Face count</option>
      </select>

      <button
        onClick={onToggleDir}
        className="px-2 py-1 rounded-md bg-muted text-sm"
        aria-label="Toggle sort direction"
      >
        {dir === 'desc' ? '↓' : '↑'}
      </button>
    </div>
  );
}

export default SortMenu;
