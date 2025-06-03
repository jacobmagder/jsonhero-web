import React, { useCallback } from 'react';
// import clsx from 'clsx'; // Replaced with template literals

interface JsonValueProps {
  value: string | number | boolean | null;
  path: string;
  onNodeSelect: (path: string, value: any) => void;
  selectedPath: string | null; // Added
}

const JsonValue: React.FC<JsonValueProps> = ({ value, path, onNodeSelect, selectedPath }) => {
  const type = typeof value;
  const handleClick = useCallback((e: React.MouseEvent) => { e.stopPropagation(); onNodeSelect(path, value); }, [path, value, onNodeSelect]);

  const isSelected = path === selectedPath;

  const baseStyling = "cursor-pointer rounded px-0.5 py-0.5"; // Common styling for clickability and padding
  const selectedStyling = "bg-indigo-100 dark:bg-indigo-800/60 ring-1 ring-indigo-500"; // Consistent selection highlight

  // Base classes for all values, including hover and focus states for accessibility
  // For hover, we can rely on the parent JsonNode's hover or add specific hover to these spans if needed.
  // For now, focus is on the selection highlight.

  if (value === null) {
    return <span className={`text-fuchsia-500 dark:text-fuchsia-400 ${baseStyling} ${isSelected ? selectedStyling : ""}`} onClick={handleClick}>null</span>;
  }

  switch (type) {
    case 'string':
      return <span className={`text-emerald-700 dark:text-emerald-400 ${baseStyling} ${isSelected ? selectedStyling : ""}`} onClick={handleClick}>"{value}"</span>;
    case 'number':
      return <span className={`text-blue-600 dark:text-blue-400 ${baseStyling} ${isSelected ? selectedStyling : ""}`} onClick={handleClick}>{String(value)}</span>;
    case 'boolean':
      return <span className={`text-amber-600 dark:text-amber-400 ${baseStyling} ${isSelected ? selectedStyling : ""}`} onClick={handleClick}>{String(value)}</span>;
    default:
      return <span className={`text-red-500 ${baseStyling} ${isSelected ? selectedStyling : ""}`} onClick={handleClick}>Unknown</span>;
  }
};

export default JsonValue;
