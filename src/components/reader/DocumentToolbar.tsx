import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Bookmark, 
  BookmarkCheck
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const DocumentToolbar: React.FC = () => {
  const { 
    activeDocument, 
    currentPage, 
    setCurrentPage, 
    zoomLevel, 
    setZoomLevel, 
    bookmarkedPages, 
    toggleBookmark 
  } = useWorkspace();

  const isBookmarked = bookmarkedPages.includes(currentPage);

  return (
    <div className="h-11 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-4 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 select-none">
      {/* Page Navigation */}
      <div className="flex items-center space-x-1.5">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-1 text-slate-700 dark:text-slate-300 font-medium">
          <span>Page</span>
          <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white">
            {currentPage}
          </span>
          <span>of {activeDocument.totalPages}</span>
        </div>

        <button
          onClick={() => setCurrentPage(Math.min(activeDocument.totalPages, currentPage + 1))}
          disabled={currentPage >= activeDocument.totalPages}
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Center tip */}
      <div className="hidden sm:flex items-center text-[11px] text-slate-500 dark:text-slate-400">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
        Select text or click "Snip & Ask" to solve doubts
      </div>

      {/* Zoom & Bookmark Controls */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-0.5 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 px-1 py-0.5">
          <button
            onClick={() => setZoomLevel(Math.max(75, zoomLevel - 15))}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-medium px-1.5 w-11 text-center">
            {zoomLevel}%
          </span>
          <button
            onClick={() => setZoomLevel(Math.min(175, zoomLevel + 15))}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(100)}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-0.5"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Bookmark */}
        <button
          onClick={() => toggleBookmark(currentPage)}
          className={`p-1.5 rounded-lg border transition-colors ${
            isBookmarked 
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700' 
              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}
          title={isBookmarked ? "Remove Bookmark" : "Bookmark this Page"}
        >
          {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5 fill-amber-500/20" /> : <Bookmark className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
