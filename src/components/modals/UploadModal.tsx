import React, { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  FileText, 
  FileCheck, 
  Sparkles
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const { uploadCustomFile, documents, setActiveDocument } = useWorkspace();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    try {
      await uploadCustomFile(selectedFile);
      onClose();
    } finally {
      setIsProcessing(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 border border-indigo-200 dark:border-indigo-800/80">
            <Upload className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Upload Study Material or Notes
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Import PDFs, lecture slides (PPTX), or handwritten note photos for unified reading & AI assistance.
          </p>
        </div>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
              : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-800/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center">
            {selectedFile ? (
              <>
                <FileCheck className="w-10 h-10 text-emerald-500 mb-2 animate-bounce" />
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Ready to parse
                </p>
              </>
            ) : (
              <>
                <FileText className="w-10 h-10 text-indigo-500/70 mb-2" />
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Click to browse or drag & drop files here
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Supports PDF, PPT, PPTX, and image notes
                </p>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Or switch to preloaded BTech curriculum docs:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => {
                  setActiveDocument(doc);
                  onClose();
                }}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-left text-xs bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 transition-colors truncate"
              >
                <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{doc.title}</p>
                <p className="text-[10px] text-slate-400 truncate">{doc.subject}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || isProcessing}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all flex items-center gap-1.5"
          >
            {isProcessing ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Load into Workspace</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
