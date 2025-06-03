import React, { useCallback } from 'react';
import JsonNode from './JsonNode';
// import clsx from 'clsx'; // Replaced with template literals

interface JsonPropertyProps {
  propertyKey: string;
  value: any;
  currentPath: string;
  onNodeSelect: (path: string, value: any) => void;
  selectedPath: string | null; // Added
}

const JsonProperty: React.FC<JsonPropertyProps> = ({ propertyKey, value, currentPath, onNodeSelect, selectedPath }) => {
  const handleKeyClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onNodeSelect(currentPath, value);
  }, [currentPath, value, onNodeSelect]);

  const isKeySelected = currentPath === selectedPath;
  const keyBaseClasses = "text-sky-600 dark:text-sky-400 select-none mr-1 cursor-pointer hover:underline py-0.5 px-1 rounded-sm";
  const selectedClasses = "bg-indigo-100 dark:bg-indigo-800/60 ring-1 ring-indigo-500";

  return (
    <div className="flex items-start my-1">
      <span
        className={`${keyBaseClasses} ${isKeySelected ? selectedClasses : ""}`}
        onClick={handleKeyClick}
        title={`Path: ${currentPath}`}
      >
        "{propertyKey}":
      </span>
      <JsonNode
        data={value}
        nodeKey={propertyKey}
        currentPath={currentPath}
        onNodeSelect={onNodeSelect}
        selectedPath={selectedPath} // Pass down
      />
    </div>
  );
};

export default JsonProperty;
