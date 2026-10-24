import React, { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { GripVertical } from 'lucide-react';

interface SplitPaneProps {
  left: ReactNode;
  right: ReactNode;
}

export const SplitPane: React.FC<SplitPaneProps> = ({ left, right }) => {
  const { splitRatio, setSplitRatio } = useWorkspace();
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newRatio = ((e.clientX - rect.left) / rect.width) * 100;
      if (newRatio >= 32 && newRatio <= 72) {
        setSplitRatio(newRatio);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, setSplitRatio]);

  return (
    <div ref={containerRef} className="flex-1 flex flex-col md:flex-row h-[calc(100vh-3.5rem)] overflow-hidden relative">
      {/* Left Panel: Document Reader */}
      <div
        style={{ width: `${splitRatio}%` }}
        className="h-full hidden md:block overflow-hidden transition-all duration-75"
      >
        {left}
      </div>

      {/* Drag Splitter Divider (Desktop) */}
      <div
        onMouseDown={() => setIsDragging(true)}
        onDoubleClick={() => setSplitRatio(50)}
        className="hidden md:flex w-2 hover:w-2.5 bg-slate-200 dark:bg-slate-800/80 hover:bg-indigo-500/70 transition-all cursor-col-resize items-center justify-center relative z-20 group"
        title="Drag to resize panels · Double-click to center 50/50"
      >
        <div className="w-1 h-8 rounded-full bg-slate-400 group-hover:bg-white transition-colors flex items-center justify-center">
          <GripVertical className="w-2.5 h-2.5 text-slate-700 opacity-0 group-hover:opacity-100" />
        </div>
      </div>

      {/* Right Panel: AI Companion */}
      <div
        style={{ width: `${100 - splitRatio}%` }}
        className="h-full hidden md:block overflow-hidden transition-all duration-75"
      >
        {right}
      </div>

      {/* Mobile Stacked View (For phones / small displays) */}
      <div className="flex-1 flex flex-col md:hidden overflow-hidden">
        <div className="h-1/2 overflow-hidden border-b border-slate-200 dark:border-slate-800">
          {left}
        </div>
        <div className="h-1/2 overflow-hidden">
          {right}
        </div>
      </div>
    </div>
  );
};
