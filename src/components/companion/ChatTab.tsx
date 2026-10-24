import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  BookOpen, 
  Play, 
  Image as ImageIcon, 
  Trash2,
  ChevronRight,
  Bot,
  User,
  HelpCircle
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const ChatTab: React.FC = () => {
  const { 
    chatMessages, 
    sendDoubt, 
    isAiThinking, 
    jumpToCitation, 
    seekVideoTo, 
    clearChat,
    selectedTextSnippet,
    setSelectedTextSnippet
  } = useWorkspace();

  const [inputPrompt, setInputPrompt] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiThinking]);

  // Handle image upload from button
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle clipboard paste of screenshots (Ctrl+V)
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setAttachedImage(event.target?.result as string);
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  const handleSend = () => {
    if ((!inputPrompt.trim() && !attachedImage && !selectedTextSnippet) || isAiThinking) return;

    sendDoubt(
      inputPrompt.trim(),
      'custom_prompt',
      attachedImage || undefined,
      selectedTextSnippet || undefined
    );

    setInputPrompt('');
    setAttachedImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#090D16]">
      {/* Messages Feed */}
      <div 
        onPaste={handlePaste}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <Bot className="w-10 h-10 mb-2 text-indigo-500 opacity-60" />
            <p className="text-sm font-medium">Ask any question about your document</p>
            <p className="text-xs mt-1">Select text on the left or snip an equation to start.</p>
          </div>
        ) : (
          chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center space-x-1.5 mb-1 px-1 text-[11px] text-slate-400">
                {msg.sender === 'user' ? (
                  <>
                    <span className="font-semibold text-slate-600 dark:text-slate-300">You</span>
                    <User className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3 text-indigo-500" />
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">StudySync AI Tutor</span>
                  </>
                )}
                <span>·</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[92%] rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                }`}
              >
                {/* Extracted question snippet badge if user snipped/selected */}
                {msg.extractedQuestion && (
                  <div className="mb-2 p-2 rounded-lg bg-black/10 dark:bg-black/30 border border-white/10 text-[11px] font-mono">
                    <span className="opacity-75 block text-[10px] uppercase font-bold tracking-wider">Context Snippet:</span>
                    <span className="line-clamp-2">"{msg.extractedQuestion}"</span>
                  </div>
                )}

                {/* Attached Image / Snip Preview */}
                {msg.snippedImage && (
                  <div className="mb-2 rounded-lg overflow-hidden border border-white/20">
                    <img 
                      src={msg.snippedImage} 
                      alt="Cropped doubt" 
                      className="max-h-48 w-auto object-contain rounded"
                    />
                  </div>
                )}

                {/* Body Text with basic markdown rendering */}
                <div className="whitespace-pre-line space-y-2">
                  {msg.text}
                </div>

                {/* Citations Chips */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-amber-500" />
                      Citations:
                    </span>
                    {msg.citations.map((cit) => (
                      <button
                        key={cit.id}
                        onClick={() => jumpToCitation(cit)}
                        className="px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-700/60 text-amber-800 dark:text-amber-300 text-[11px] font-medium flex items-center space-x-1 transition-all hover:scale-105"
                        title="Click to jump document to this citation"
                      >
                        <span>Jump to Page {cit.pageNumber}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Suggested Video Solution Card */}
                {msg.suggestedVideo && (
                  <div className="mt-3 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 truncate mr-2">
                      <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white flex-shrink-0">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {msg.suggestedVideo.title}
                        </p>
                        <p className="text-[11px] text-indigo-600 dark:text-indigo-400">
                          Clip starts at {Math.floor(msg.suggestedVideo.startTime / 60)}:{(msg.suggestedVideo.startTime % 60).toString().padStart(2, '0')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => seekVideoTo(msg.suggestedVideo!.startTime)}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold whitespace-nowrap shadow-sm transition-transform active:scale-95"
                    >
                      Watch Solution
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* AI Thinking Skeleton */}
        {isAiThinking && (
          <div className="flex flex-col items-start animate-in fade-in duration-200">
            <div className="flex items-center space-x-1.5 mb-1 px-1 text-[11px] text-indigo-500">
              <Bot className="w-3 h-3 animate-spin" />
              <span>Analyzing document context and matching video...</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-none p-4 w-4/5 space-y-2">
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4 animate-pulse"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full animate-pulse"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Doubt Prompts */}
      <div className="px-3 pt-2 pb-1 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1 flex-shrink-0">
          <HelpCircle className="w-3 h-3" /> Quick:
        </span>
        <button
          onClick={() => sendDoubt("Explain the difference between '/' and '//' in Python division with examples.")}
          className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap transition-colors"
        >
          / vs // Difference
        </button>
        <button
          onClick={() => sendDoubt("Why does -7 // 2 evaluate to -4 instead of -3?")}
          className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap transition-colors"
        >
          Negative Floor Division
        </button>
        <button
          onClick={() => sendDoubt("What is the time complexity derivation of Binary Search?")}
          className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap transition-colors"
        >
          Binary Search O(log N)
        </button>
      </div>

      {/* Input Composer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19]">
        {/* Selected text indicator badge */}
        {selectedTextSnippet && (
          <div className="mb-2 p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/80 text-xs flex items-center justify-between text-indigo-700 dark:text-indigo-300">
            <span className="truncate mr-2 font-mono text-[11px]">Selected: "{selectedTextSnippet}"</span>
            <button
              onClick={() => setSelectedTextSnippet('')}
              className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          </div>
        )}

        {/* Attached image preview */}
        {attachedImage && (
          <div className="mb-2 relative inline-block">
            <img 
              src={attachedImage} 
              alt="Uploaded screenshot" 
              className="h-16 w-auto rounded border border-indigo-500 object-cover"
            />
            <button
              onClick={() => setAttachedImage(null)}
              className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 text-xs shadow"
              title="Remove image"
            >
              ×
            </button>
          </div>
        )}

        <div className="relative flex items-end bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI tutor, explain equation, or paste screenshot (Ctrl+V)..."
            rows={2}
            className="w-full bg-transparent resize-none text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />

          <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Upload question photo or screenshot"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            {chatMessages.length > 1 && (
              <button
                type="button"
                onClick={clearChat}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="Clear chat thread"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleSend}
              disabled={(!inputPrompt.trim() && !attachedImage && !selectedTextSnippet) || isAiThinking}
              className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all shadow-sm"
              title="Send Doubt (Enter)"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
