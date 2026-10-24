import React from 'react';
import { Bot, Video, BrainCircuit } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { ChatTab } from './ChatTab';
import { VideoTab } from './VideoTab';
import { FlashcardsTab } from './FlashcardsTab';

export const CompanionPanel: React.FC = () => {
  const { activeTab, setActiveTab, activeVideo, activeDocument } = useWorkspace();

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#090D16] overflow-hidden select-text">
      {/* Tab Switcher Header */}
      <div className="h-11 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-2 flex items-center justify-between select-none">
        <div className="flex items-center space-x-1">
          {/* AI Tutor Tab */}
          <button
            onClick={() => setActiveTab('tutor')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tutor'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-indigo-500" />
            <span>AI Tutor</span>
          </button>

          {/* Video Solution Tab */}
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
              activeTab === 'video'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-rose-500" />
            <span>Video Solution</span>
            {activeVideo && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          {/* Smart Flashcards Tab */}
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'flashcards'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-emerald-500" />
            <span>Flashcards</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              {activeDocument.flashcards?.length || 0}
            </span>
          </button>
        </div>

        <div className="hidden sm:block text-[11px] text-slate-400 dark:text-slate-500 font-mono pr-2">
          StudySync Companion
        </div>
      </div>

      {/* Tab Body View */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'tutor' && <ChatTab />}
        {activeTab === 'video' && <VideoTab />}
        {activeTab === 'flashcards' && <FlashcardsTab />}
      </div>
    </div>
  );
};
