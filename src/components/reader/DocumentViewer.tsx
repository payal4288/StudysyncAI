import React, { useState, useRef } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { DocumentToolbar } from './DocumentToolbar';
import { SnipMarqueeOverlay } from './SnipMarqueeOverlay';
import { DoubtActionToolbar } from './DoubtActionToolbar';
import { FileText, Sparkles, Lightbulb } from 'lucide-react';

export const DocumentViewer: React.FC = () => {
  const { 
    activeDocument, 
    currentPage, 
    zoomLevel, 
    activeCitation, 
    searchQuery,
    setSelectedTextSnippet
  } = useWorkspace();

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [selectionToolbarPos, setSelectionToolbarPos] = useState<{ top: number; left: number } | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [snippedImage, setSnippedImage] = useState<string | undefined>(undefined);

  const activePageData = activeDocument.pages.find(p => p.pageNumber === currentPage) || activeDocument.pages[0];

  // Handle Text Selection for floating Doubt Action Toolbar
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      return;
    }

    const text = selection.toString().trim();
    if (text.length < 3) return;

    setSelectedText(text);
    setSelectedTextSnippet(text);
    setSnippedImage(undefined);

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();

    if (containerRect) {
      setSelectionToolbarPos({
        top: rect.top - containerRect.top - 45,
        left: rect.left - containerRect.left + (rect.width / 4),
      });
    }
  };

  // Clear selection toolbar when clicking outside
  const handleDocumentClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.absolute.z-50')) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setSelectionToolbarPos(null);
      setSelectedText('');
    }
  };

  const handleSnipComplete = (rect: { top: number; left: number; width: number; height: number }, imageBase64?: string) => {
    setSnippedImage(imageBase64);
    setSelectedText('Question & Formula captured via Snip & Ask');
    setSelectionToolbarPos({
      top: rect.top + rect.height + 12,
      left: rect.left,
    });
  };

  // Helper to highlight search query inside text
  const renderHighlightedContent = (content: string) => {
    if (!searchQuery.trim()) return content;

    const parts = content.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-amber-300 dark:bg-amber-500 text-black px-1 rounded font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div 
      ref={containerRef}
      onClick={handleDocumentClick}
      className="h-full flex flex-col bg-slate-100 dark:bg-[#070A11] relative overflow-hidden select-text border-r border-slate-200 dark:border-slate-800"
    >
      {/* Top Document Bar */}
      <DocumentToolbar />

      {/* Main Document Reading Area */}
      <div 
        onMouseUp={handleMouseUp}
        className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center items-start relative"
      >
        {/* PDF/Note Sheet Simulation */}
        <div
          ref={contentRef}
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl p-8 md:p-12 text-slate-800 dark:text-slate-100 min-h-[750px] relative transition-shadow"
        >
          {/* Header metadata */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 mb-6 flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2 text-[11px] font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                <FileText className="w-3.5 h-3.5" />
                <span>{activeDocument.subject}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight mt-1 text-slate-900 dark:text-white">
                {activePageData.title}
              </h2>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 font-mono text-slate-500 dark:text-slate-400">
              Page {activePageData.pageNumber}
            </span>
          </div>

          {/* Active Citation Highlight Overlay Alert */}
          {activeCitation && activeCitation.pageNumber === currentPage && (
            <div className="mb-6 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 text-amber-900 dark:text-amber-200 text-xs flex items-start space-x-2.5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
              <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">AI Citation Linked: </span>
                <span>{activeCitation.contextNote}</span>
                <p className="text-[11px] opacity-80 mt-0.5 italic">"{activeCitation.highlightText}"</p>
              </div>
            </div>
          )}

          {/* Body Content */}
          <div className="prose dark:prose-invert max-w-none text-sm md:text-base leading-relaxed space-y-4 whitespace-pre-line font-sans">
            <div className={activeCitation && activeCitation.pageNumber === currentPage ? 'citation-highlight-active p-1 -m-1' : ''}>
              {renderHighlightedContent(activePageData.content)}
            </div>
          </div>

          {/* Render Equations if available */}
          {activePageData.equations && activePageData.equations.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Key Formulae & Algorithmic Invariants
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activePageData.equations.map((eq, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 font-mono text-xs text-indigo-700 dark:text-indigo-300 flex items-center justify-between group hover:border-indigo-400 transition-colors"
                  >
                    <span>{eq}</span>
                    <button
                      onClick={() => {
                        setSelectedText(eq);
                        setSelectedTextSnippet(eq);
                        setSelectionToolbarPos({ top: 120, left: 180 });
                      }}
                      className="opacity-0 group-hover:opacity-100 text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded transition-opacity"
                    >
                      Ask AI
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document Footer */}
          <div className="mt-12 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex justify-between text-[11px] text-slate-400">
            <span>StudySync AI Verified Reader</span>
            <span>Document ID: {activeDocument.id}</span>
          </div>
        </div>
      </div>

      {/* Floating Doubt Action Toolbar */}
      {selectionToolbarPos && (
        <DoubtActionToolbar
          position={selectionToolbarPos}
          selectedText={selectedText}
          snippedImage={snippedImage}
          onClose={() => {
            setSelectionToolbarPos(null);
            setSelectedText('');
            setSnippedImage(undefined);
          }}
        />
      )}

      {/* Google Lens Snip Mode Marquee Layer */}
      <SnipMarqueeOverlay
        containerRef={containerRef}
        onSnipComplete={handleSnipComplete}
      />
    </div>
  );
};
