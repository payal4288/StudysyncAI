import React from 'react';
import { 
  Play, 
  Clock, 
  ListChecks, 
  FileText, 
  Video, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { MOCK_VIDEOS } from '../../services/mockData';

export const VideoTab: React.FC = () => {
  const { activeVideo, videoSeekTime, seekVideoTo } = useWorkspace();

  if (!activeVideo) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
        <Video className="w-12 h-12 mb-3 text-indigo-500 opacity-50" />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Video Selected Yet</h3>
        <p className="text-xs max-w-xs mt-1 text-slate-500 dark:text-slate-400">
          Ask a doubt or select a topic on the left to automatically find and seek to the exact explanation clip!
        </p>
      </div>
    );
  }

  const formatTimestamp = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-5 bg-white dark:bg-[#090D16]">
      {/* Video Player Container */}
      <div className="rounded-2xl overflow-hidden bg-black shadow-xl border border-slate-200 dark:border-slate-800 aspect-video relative group">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId}?start=${videoSeekTime}&autoplay=1&enablejsapi=1&rel=0`}
          title={activeVideo.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>

      {/* Synchronized Timestamp Control Pill */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80">
        <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-300">
          <Clock className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-semibold">Synchronized to exact doubt segment:</span>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-600 text-white shadow-sm">
            {formatTimestamp(videoSeekTime)}
          </span>
        </div>
        <button
          onClick={() => seekVideoTo(activeVideo.startTime)}
          className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" /> Replay Segment
        </button>
      </div>

      {/* Video Metadata Header */}
      <div>
        <div className="flex items-center space-x-2 mb-1.5">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            Educational Clip
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {activeVideo.channel}
          </span>
        </div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
          {activeVideo.title}
        </h2>
      </div>

      {/* Key Concept Takeaways */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <ListChecks className="w-3.5 h-3.5 text-emerald-500" />
          Key Concept Takeaways
        </h3>
        <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
          {activeVideo.keyPoints.map((point, i) => (
            <li key={i} className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Exact Transcript Match */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-amber-500" />
          Transcript Segment Match
        </h3>
        <p className="text-xs italic text-slate-600 dark:text-slate-300 leading-relaxed font-sans bg-white dark:bg-slate-950/60 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800">
          {activeVideo.transcriptSnippet}
        </p>
      </div>

      {/* Alternative Related Video Explanations */}
      <div className="pt-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          Other Related Doubt Clips
        </h4>
        <div className="space-y-2">
          {Object.entries(MOCK_VIDEOS).map(([key, vid]) => (
            <div
              key={key}
              onClick={() => seekVideoTo(vid.startTime)}
              className={`p-2.5 rounded-xl border flex items-center space-x-3 cursor-pointer transition-all ${
                activeVideo.title === vid.title
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-white text-white" />
                </div>
              </div>
              <div className="truncate flex-1">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{vid.title}</p>
                <p className="text-[10px] text-slate-400">{vid.channel} · Starts at {formatTimestamp(vid.startTime)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
