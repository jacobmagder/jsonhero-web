import React from 'react';
import { ColumnViewIcon, JsonViewIcon, TreeViewIcon, DownloadIcon } from './icons'; // Import icons
// import { useJsonDoc } from "~/hooks/useJsonDoc"; // Placeholder if we had this
// import { useTheme } from '../ThemeProvider'; // If needed for theme-specific query params

interface SidebarLinkProps {
  to?: string; // For now, links won't navigate, just placeholders
  title: string;
  hotKey?: string; // Placeholder for future hotkey display
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarButton: React.FC<SidebarLinkProps> = ({ title, children, isActive, onClick }) => {
  // Base classes for all buttons
  const baseClasses = "relative w-10 h-10 mb-1 rounded-sm cursor-pointer transition flex items-center justify-center";
  // Classes for active state
  const activeClasses = "text-white bg-indigo-600 dark:bg-indigo-700";
  // Classes for inactive state
  const inactiveClasses = "text-slate-600 hover:bg-slate-300 dark:text-slate-300 dark:hover:bg-slate-700";

  return (
    // For now, using a button element. Could be <Link> from Remix later.
    <button
      onClick={onClick}
      title={title}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      aria-label={title}
    >
      {children}
      {/* Tooltip can be added later here if complex, for now using native title */}
    </button>
  );
};


const SideBar: React.FC = () => {
  // const { doc } = useJsonDoc(); // Placeholder
  // const [theme] = useTheme(); // Placeholder

  // Placeholder for active view state
  const [activeView, setActiveView] = React.useState<string>('tree'); // Default to 'tree'

  // In a real app, 'doc.id' would come from context or props
  const docIdPlaceholder = 'currentDocument';

  return (
    <div className="side-bar flex flex-col justify-between h-full p-2 bg-slate-100 dark:bg-slate-800 flex-shrink-0 shadow-lg">
      <ol className="space-y-2">
        <li>
          <SidebarButton
            title="Column View (Alt+1)"
            isActive={activeView === 'column'}
            onClick={() => setActiveView('column')}
          >
            <ColumnViewIcon className="w-6 h-6" />
          </SidebarButton>
        </li>
        <li>
          <SidebarButton
            title="JSON View (Alt+2)"
            isActive={activeView === 'json'}
            onClick={() => setActiveView('json')}
          >
            <JsonViewIcon className="w-6 h-6" />
          </SidebarButton>
        </li>
        <li>
          <SidebarButton
            title="Tree View (Alt+3)"
            isActive={activeView === 'tree'}
            onClick={() => setActiveView('tree')}
          >
            <TreeViewIcon className="w-6 h-6" />
          </SidebarButton>
        </li>
      </ol>
      <ol className="space-y-2">
        <li>
          {/* This would be an actual link in JSON Hero */}
          <SidebarButton
            title="Download JSON"
            onClick={() => alert(`Download for ${docIdPlaceholder}.json (not implemented)`)}
          >
            <DownloadIcon className="w-6 h-6" />
          </SidebarButton>
        </li>
      </ol>
    </div>
  );
};

export default SideBar;
