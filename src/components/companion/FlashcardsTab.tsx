import React, { useState } from 'react';
import { 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Lightbulb, 
  Check, 
  BrainCircuit 
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const FlashcardsTab: React.FC = () => {
  const { activeDocument, setCurrentPage } = useWorkspace();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  const flashcards = activeDocument.flashcards || [];

  if (flashcards.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
        <BrainCircuit className="w-12 h-12 mb-3 text-indigo-500 opacity-50" />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Flashcards Generated</h3>
        <p className="text-xs max-w-xs mt-1 text-slate-500 dark:text-slate-400">
          Upload notes or select a chapter to extract smart formula cards and revision questions.
        </p>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const isMastered = masteredIds.includes(currentCard.id);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const toggleMastered = (id: string) => {
    setMasteredIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="h-full overflow-y-auto p-4 flex flex-col justify-between bg-white dark:bg-[#090D16]">
      {/* Top Meta info */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
            {currentCard.category}
          </span>
          <button
            onClick={() => setCurrentPage(currentCard.pageReference)}
            className="text-[11px] text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
            title="Jump to source page in PDF reader"
          >
            <BookOpen className="w-3 h-3 text-indigo-500" />
            <span>From Page {currentCard.pageReference}</span>
          </button>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Card {currentIndex + 1} / {flashcards.length}
        </span>
      </div>

      {/* Flip Flashcard */}
      <div className="my-auto py-6 flex flex-col items-center">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`w-full max-w-sm min-h-[260px] rounded-2xl p-6 cursor-pointer select-none transition-all duration-300 transform border shadow-lg flex flex-col justify-between ${
            isFlipped
              ? 'bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white border-indigo-500/50 shadow-indigo-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-indigo-400/60'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span className="flex items-center gap-1">
              <Lightbulb className={`w-3.5 h-3.5 ${isFlipped ? 'text-amber-400' : 'text-indigo-500'}`} />
              {isFlipped ? 'Answer & Explanation' : 'Question / Concept'}
            </span>
            <span className="flex items-center gap-1 opacity-70">
              <RotateCw className="w-3 h-3" /> Click to flip
            </span>
          </div>

          <div className="my-auto text-center py-4">
            <p className="text-sm md:text-base font-semibold leading-relaxed">
              {isFlipped ? currentCard.back : currentCard.front}
            </p>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-white/10">
            <span>StudySync AI Flashcards</span>
            <span>{isFlipped ? 'Answer' : 'Question'}</span>
          </div>
        </div>

        {/* Mastered Button */}
        <button
          onClick={() => toggleMastered(currentCard.id)}
          className={`mt-4 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all ${
            isMastered
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Check className="w-3.5 h-3.5" />
          <span>{isMastered ? 'Concept Mastered!' : 'Mark as Mastered'}</span>
        </button>
      </div>

      {/* Bottom Nav Controls */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex space-x-1">
          {flashcards.map((fc, i) => (
            <div
              key={fc.id}
              onClick={() => {
                setIsFlipped(false);
                setCurrentIndex(i);
              }}
              className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                i === currentIndex
                  ? 'bg-indigo-600 w-4'
                  : masteredIds.includes(fc.id)
                  ? 'bg-emerald-500'
                  : 'bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
