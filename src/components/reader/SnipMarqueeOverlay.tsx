import React, { useState, useEffect } from 'react';
import { Crop, X } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

interface SnipMarqueeOverlayProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  onSnipComplete: (rect: { top: number; left: number; width: number; height: number }, imageBase64?: string) => void;
}

export const SnipMarqueeOverlay: React.FC<SnipMarqueeOverlayProps> = ({
  containerRef,
  onSnipComplete,
}) => {
  const { isSnipMode, setIsSnipMode } = useWorkspace();
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSnipMode) {
        setIsSnipMode(false);
        setIsDrawing(false);
        setStartPos(null);
        setCurrentPos(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSnipMode, setIsSnipMode]);

  if (!isSnipMode) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPos({ x, y });
    setCurrentPos({ x, y });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentPos({ x, y });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !startPos || !currentPos) {
      setIsDrawing(false);
      return;
    }

    const x1 = Math.min(startPos.x, currentPos.x);
    const y1 = Math.min(startPos.y, currentPos.y);
    const width = Math.abs(currentPos.x - startPos.x);
    const height = Math.abs(currentPos.y - startPos.y);

    if (width > 25 && height > 25) {
      const canvas = document.createElement('canvas');
      canvas.width = Math.min(400, Math.max(100, width));
      canvas.height = Math.min(250, Math.max(50, height));
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#a5b4fc';
        ctx.font = '14px monospace';
        ctx.fillText('OCR Question Snippet', 20, 35);
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px sans-serif';
        ctx.fillText('Target: Python Division / vs //', 20, 65);
      }
      const mockBase64 = canvas.toDataURL('image/png');

      onSnipComplete({ top: y1, left: x1, width, height }, mockBase64);
    }

    setIsDrawing(false);
    setStartPos(null);
    setCurrentPos(null);
  };

  const rectBox = startPos && currentPos ? {
    left: Math.min(startPos.x, currentPos.x),
    top: Math.min(startPos.y, currentPos.y),
    width: Math.abs(currentPos.x - startPos.x),
    height: Math.abs(currentPos.y - startPos.y),
  } : null;

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="absolute inset-0 z-40 cursor-crosshair select-none bg-indigo-950/20 backdrop-blur-[0.5px]"
    >
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white border border-indigo-500/50 px-4 py-2 rounded-full shadow-2xl flex items-center space-x-3 pointer-events-auto">
        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
        <span className="text-xs font-semibold flex items-center gap-1.5">
          <Crop className="w-3.5 h-3.5 text-indigo-400" />
          Click and drag to crop any formula, question, or diagram
        </span>
        <button
          onClick={() => setIsSnipMode(false)}
          className="ml-2 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
          title="Cancel Snip (Esc)"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {rectBox && (
        <div
          style={{
            left: `${rectBox.left}px`,
            top: `${rectBox.top}px`,
            width: `${rectBox.width}px`,
            height: `${rectBox.height}px`,
          }}
          className="marquee-box rounded-md flex items-start justify-end p-1.5"
        >
          <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
            {Math.round(rectBox.width)} × {Math.round(rectBox.height)}
          </span>
        </div>
      )}
    </div>
  );
};
