import React, { useState, useCallback } from 'react';
import JsonProperty from './JsonProperty';
import JsonValue from './JsonValue';
// import clsx from 'clsx'; // Utility for conditional classes - Replaced with template literals

interface JsonNodeProps {
  data: any;
  nodeKey: string;
  currentPath: string;
  isRootNode?: boolean;
  onNodeSelect: (path: string, value: any) => void;
  selectedPath: string | null; // Added
}

const JsonNode: React.FC<JsonNodeProps> = ({ data, nodeKey, currentPath, isRootNode = false, onNodeSelect, selectedPath }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(isRootNode);

  const nodeType = typeof data;
  const isObject = nodeType === 'object' && data !== null && !Array.isArray(data);
  const isArray = Array.isArray(data);

  const toggleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const handleNodeClick = useCallback((e: React.MouseEvent) => {
    // Refined logic from previous step to ensure correct target
     if (e.target === e.currentTarget || (e.target as HTMLElement).parentElement === e.currentTarget) {
         onNodeSelect(currentPath, data);
    }
  }, [currentPath, data, onNodeSelect]);

  const isCurrentlySelected = currentPath === selectedPath;

  const renderToggle = () => ( <span onClick={toggleExpand} className="toggle-icon cursor-pointer select-none mr-1.5 text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300" aria-label={isExpanded ? 'Collapse' : 'Expand'}>{isExpanded ? '▼' : '▶'}</span>);

  if (isObject) {
    const keys = Object.keys(data);
    const objectBaseClass = "flex items-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 rounded-sm py-0.5 px-1";
    const selectedClass = "bg-indigo-100 dark:bg-indigo-800/60 ring-1 ring-indigo-500";

    return (
      <div className="ml-4">
        <div
          className={`${objectBaseClass} ${isCurrentlySelected ? selectedClass : ""}`}
          onClick={handleNodeClick}
        >
          {renderToggle()}
          <span className="text-slate-500 dark:text-slate-400 select-none">{'{'}</span>
          {!isExpanded && <span className="ml-1 text-slate-500 dark:text-slate-400 select-none">...{keys.length} {keys.length === 1 ? 'item' : 'items'}...</span>}
          {!isExpanded && <span className="ml-1 text-slate-500 dark:text-slate-400 select-none">{'}'}</span>}
        </div>
        {isExpanded && (
          <>
            {keys.map((key) => (
              <JsonProperty
                key={key}
                propertyKey={key}
                value={data[key]}
                currentPath={`${currentPath}.${key}`}
                onNodeSelect={onNodeSelect}
                selectedPath={selectedPath} // Pass down
              />
            ))}
            <div
              className={`text-slate-500 dark:text-slate-400 select-none pl-1 py-0.5 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 rounded-sm ${isCurrentlySelected ? selectedClass : ""}`}
              onClick={handleNodeClick}
            >{'}'}</div>
          </>
        )}
      </div>
    );
  }

  if (isArray) {
    const arrayBaseClass = "flex items-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 rounded-sm py-0.5 px-1";
    const selectedClass = "bg-indigo-100 dark:bg-indigo-800/60 ring-1 ring-indigo-500";
    return (
      <div className="ml-4">
        <div
          className={`${arrayBaseClass} ${isCurrentlySelected ? selectedClass : ""}`}
          onClick={handleNodeClick}
        >
          {renderToggle()}
          <span className="text-slate-500 dark:text-slate-400 select-none">{'['}</span>
          {!isExpanded && <span className="ml-1 text-slate-500 dark:text-slate-400 select-none">...{data.length} {data.length === 1 ? 'item' : 'items'}...</span>}
          {!isExpanded && <span className="ml-1 text-slate-500 dark:text-slate-400 select-none">{']'}</span>}
        </div>
        {isExpanded && (
          <>
            {data.map((item: any, index: number) => (
              <div key={index} className="flex items-start my-1">
                 <span className="text-slate-400 dark:text-slate-500 mr-1 select-none">{index}:</span>
                 <JsonNode
                    data={item}
                    nodeKey={String(index)}
                    currentPath={`${currentPath}[${index}]`}
                    onNodeSelect={onNodeSelect}
                    selectedPath={selectedPath} // Pass down
                  />
              </div>
            ))}
             <div
              className={`text-slate-500 dark:text-slate-400 select-none pl-1 py-0.5 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 rounded-sm ${isCurrentlySelected ? selectedClass : ""}`}
              onClick={handleNodeClick}
            >{']'}</div>
          </>
        )}
      </div>
    );
  }

  return <JsonValue value={data} path={currentPath} onNodeSelect={onNodeSelect} selectedPath={selectedPath} />;
};

export default JsonNode;
