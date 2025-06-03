import React, { useState, useCallback, useEffect } from 'react';
import { ThemeProvider, useTheme } from './ThemeProvider';
import JsonInput from './components/JsonInput';
import JsonTreeView from './components/tree/JsonTreeView';
import SideBar from './components/SideBar'; // Add this import

// MainContent Component
const MainContent: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [rawJson, setRawJson] = useState<string>('');
  const [parsedJson, setParsedJson] = useState<any | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<any | null>(null);
  const [copyNotification, setCopyNotification] = useState<string | null>(null);

  const handleJsonSubmit = useCallback((jsonString: string) => {
    setRawJson(jsonString);
    try {
      const parsed = JSON.parse(jsonString);
      setParsedJson(parsed);
      setParseError(null);
      setSelectedPath(null); // Reset selection on new JSON
      setSelectedValue(null);
    } catch (e: any) {
      setParsedJson(null);
      setParseError(`Error parsing JSON: ${e.message}`);
      setSelectedPath(null);
      setSelectedValue(null);
    }
  }, []);

  const handleNodeSelect = useCallback((path: string, value: any) => {
    setSelectedPath(path);
    setSelectedValue(value);
  }, []);

  const copyToClipboard = useCallback(async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyNotification(`${type} copied to clipboard!`);
      setTimeout(() => setCopyNotification(null), 2000); // Clear notification after 2s
    } catch (err) {
      setCopyNotification(`Failed to copy ${type}.`);
      setTimeout(() => setCopyNotification(null), 2000);
      console.error('Failed to copy: ', err);
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">
          JSON Viewer
        </h1>
        <button
          onClick={toggleTheme}
          className="px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          Toggle Theme (Current: {theme})
        </button>
      </div>

      <div className="mb-6 flex-shrink-0">
        <JsonInput onSubmitJson={handleJsonSubmit} />
      </div>

      {selectedPath && (
        <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-mono flex-shrink-0 shadow">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-200">Path: </span>
              <span className="text-indigo-600 dark:text-indigo-400 break-all">{selectedPath}</span>
            </div>
            <button
              onClick={() => copyToClipboard(selectedPath, 'Path')}
              className="ml-3 px-2.5 py-1 text-xs font-medium bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 dark:focus:ring-offset-slate-700"
            >
              Copy Path
            </button>
          </div>
          <div className="mt-1 flex justify-between items-start">
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-200">Value: </span>
              <span className="text-slate-600 dark:text-slate-300 break-all">
                {typeof selectedValue === 'object' ? JSON.stringify(selectedValue) : String(selectedValue)}
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(typeof selectedValue === 'object' ? JSON.stringify(selectedValue, null, 2) : String(selectedValue), 'Value')}
              className="ml-3 px-2.5 py-1 text-xs font-medium bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 dark:focus:ring-offset-slate-700"
            >
              Copy Value
            </button>
          </div>
        </div>
      )}
      {copyNotification && (
          <div className="absolute top-5 right-5 p-2 bg-green-500 text-white text-xs rounded shadow-md transition-opacity duration-300 z-50">
              {copyNotification}
          </div>
      )}

      {parseError && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 rounded-md flex-shrink-0">
          <p className="text-sm text-red-700 dark:text-red-200">{parseError}</p>
        </div>
      )}

      <div className="flex-grow overflow-auto custom-scrollbar border border-slate-200 dark:border-slate-700 rounded-md">
        {parsedJson !== null && !parseError && (
          <JsonTreeView
            jsonData={parsedJson}
            onNodeSelect={handleNodeSelect}
            selectedPath={selectedPath}
          />
        )}
        {parsedJson === null && !parseError && (
          <div className="bg-slate-50 dark:bg-slate-800 p-4 h-full flex items-center justify-center rounded-lg shadow text-center">
              <p className="text-slate-500 dark:text-slate-400">Enter JSON above and click "View JSON" to see it here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans">
      <SideBar /> {/* Use the new SideBar component */}
      <MainContent />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};
export default App;
