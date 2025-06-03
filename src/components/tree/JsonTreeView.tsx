import React from 'react';
import JsonNode from './JsonNode';

interface JsonTreeViewProps {
  jsonData: any;
  onNodeSelect: (path: string, value: any) => void;
  selectedPath: string | null; // Added
}

const JsonTreeView: React.FC<JsonTreeViewProps> = ({ jsonData, onNodeSelect, selectedPath }) => {
  if (jsonData === null || jsonData === undefined) {
    return <div className="p-2 text-slate-500 dark:text-slate-400">JSON data is empty or not valid.</div>;
  }

  return (
    <div className="font-mono text-sm p-2 rounded-md bg-slate-50 dark:bg-slate-800">
      <JsonNode
        data={jsonData}
        nodeKey="root"
        currentPath="$"
        isRootNode={true}
        onNodeSelect={onNodeSelect}
        selectedPath={selectedPath} // Pass down
      />
    </div>
  );
};

export default JsonTreeView;
