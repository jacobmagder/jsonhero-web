import React, { useState, useCallback } from 'react';

interface JsonInputProps {
  onSubmitJson: (jsonString: string) => void;
  initialJsonString?: string; // Optional prop for default JSON
}

const JsonInput: React.FC<JsonInputProps> = ({ onSubmitJson, initialJsonString = '' }) => {
  const [jsonString, setJsonString] = useState<string>(initialJsonString);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonString(event.target.value);
    if (error) {
      setError(null); // Clear error on new input
    }
  };

  const handleSubmit = useCallback(() => {
    if (!jsonString.trim()) {
      setError("JSON input cannot be empty.");
      return;
    }
    try {
      // Try to parse to see if it's valid before submitting upstream
      // The actual parsing for rendering will happen in the parent or a dedicated service
      JSON.parse(jsonString);
      setError(null);
      onSubmitJson(jsonString);
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`);
    }
  }, [jsonString, onSubmitJson]);

  return (
    <div className="p-1"> {/* Reduced padding to fit better in potential parent padding */}
      <textarea
        value={jsonString}
        onChange={handleChange}
        placeholder="Paste your JSON here..."
        className="w-full h-40 p-3.5 font-mono text-sm border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 custom-scrollbar resize-y"
        spellCheck="false"
      />
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      <div className="mt-3 flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50"
          disabled={!jsonString.trim()}
        >
          View JSON
        </button>
      </div>
    </div>
  );
};

export default JsonInput;
