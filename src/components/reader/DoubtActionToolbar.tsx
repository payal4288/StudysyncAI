import React from 'react';
import { Sparkles, Calculator, Video, MessageSquare, X } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import type { DoubtIntent } from '../../types';

interface DoubtActionToolbarProps {
  position: { top: number; left: number };
  selectedText?: string;
  snippedImage?: string;
  onClose: () => void;
}

export const DoubtActionToolbar: React.FC<DoubtActionToolbarProps> = ({
  position,
  selectedText,
  snippedImage,
  onClose,
}) => {
  const { sendDoubt, setActiveTab } = useWorkspace();

  const handleAction = (intent: DoubtIntent, customQuery?: string) => {
    let query = customQuery || '';
    if (!query) {
      if (intent === 'explain_simple') query = `Explain this concept in simple terms with examples: "${selectedText || 'snipped region'}"`;
      if (intent === 'step_by_step_math') query = `Provide a step-by-step mathematical/algorithmic derivation for: "${selectedText || 'snipped region'}"`;
      if (intent === 'find_video') query = `Find the most relevant educational video explanation for: "${selectedText || 'snipped region'}"`;
    }

    sendDoubt(query, intent, snippedImage, selectedText);
    setActiveTab(intent === 'find_video' ? 'video' : 'tutor');
    onClose();
  };

  return (
    <div
      style={{
        top: `${Math.max(10, position.top)}px`,
        left: `${Math.max(10, Math.min(position.left, window.innerWidth - 380))}px`,
      }}
      className="absolute z-50 flex items-center bg-slate-900/95 dark:bg-slate-950/95 text-white rounded-xl shadow-2xl border border-indigo-500/30 p-1.5 space-x-1 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="flex items-center space-x-1">
        <button
          onClick={() => handleAction('explain_simple')}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all hover:scale-[1.02] shadow-sm"
          title="Explain in plain student-friendly terms"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Explain Simply</span>
        </button>

        <button
          onClick={() => handleAction('step_by_step_math')}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-800 text-slate-200 hover:text-white transition-colors"
          title="Step-by-step breakdown"
        >
          <Calculator className="w-3.5 h-3.5 text-cyan-400" />
          <span>Step-by-Step</span>
        </button>

        <button
          onClick={() => handleAction('find_video')}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-800 text-slate-200 hover:text-white transition-colors"
          title="Jump to relevant short video clip"
        >
          <Video className="w-3.5 h-3.5 text-rose-400" />
          <span>Find Video</span>
        </button>

        <button
          onClick={() => handleAction('custom_prompt', `I have a doubt regarding this section: "${selectedText || 'snipped note'}". Could you please explain what it means and how it applies in exams?`)}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Ask in AI Tutor Chat"
        >
          <MessageSquare className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-4 w-px bg-slate-800 mx-1" />

      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        title="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
