import React, { useState } from 'react';
import { 
  BookOpen, 
  Crop, 
  Upload, 
  Sun, 
  Moon, 
  ChevronDown, 
  FileText,
  Search,
  Check
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

interface TopNavProps {
  onOpenUpload: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenUpload }) => {
  const { 
    documents, 
    activeDocument, 
    setActiveDocument, 
    isSnipMode, 
    setIsSnipMode, 
    theme, 
    toggleTheme,
    searchQuery,
    setSearchQuery 
  } = useWorkspace();

  const [isDocDropdownOpen, setIsDocDropdownOpen] = useState(false);

  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-md px-4 flex items-center justify-between select-none z-30">
      {/* Brand & Project Info */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                StudySync <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">AI</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                BTech Workspace
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block">
              Click. Learn. Understand. All in One Place.
            </p>
          </div>
        </div>

        {/* Document Switcher Dropdown */}
        <div className="relative ml-4">
          <button
            onClick={() => setIsDocDropdownOpen(!isDocDropdownOpen)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition-all text-xs font-medium text-slate-700 dark:text-slate-200"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            <span className="max-w-[150px] truncate">{activeDocument.title}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isDocDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Active Study Documents
              </div>
              {documents.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => {
                    setActiveDocument(doc);
                    setIsDocDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors ${
                    activeDocument.id === doc.id ? 'bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="truncate mr-2">
                    <p className="truncate font-medium">{doc.title}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">{doc.subject} · {doc.totalPages} pages</p>
                  </div>
                  {activeDocument.id === doc.id && <Check className="w-4 h-4 flex-shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center Search / In-Doc Query */}
      <div className="hidden lg:flex items-center relative max-w-sm w-full mx-4">
        <Search className="w-4 h-4 absolute left-3 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search document keywords, formulas, or operators..."
          className="w-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Right Controls & Actions */}
      <div className="flex items-center space-x-2">
        {/* Google Lens / Snip Mode Toggle */}
        <button
          onClick={() => setIsSnipMode(!isSnipMode)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isSnipMode 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 ring-2 ring-indigo-400' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
          title="Crop any question, diagram, or handwritten note directly from the reader"
        >
          <Crop className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Snip & Ask</span>
          {isSnipMode && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
          )}
        </button>

        {/* Upload Button */}
        <button
          onClick={onOpenUpload}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/80 text-xs font-semibold transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
