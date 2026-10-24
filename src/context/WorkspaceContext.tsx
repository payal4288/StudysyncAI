import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { StudyDocument, Citation, VideoExplanation, ChatMessage, DoubtIntent } from '../types';
import { SAMPLE_DOCUMENTS, MOCK_VIDEOS } from '../services/mockData';
import { apiService } from '../services/apiService';
import confetti from 'canvas-confetti';

interface WorkspaceContextType {
  documents: StudyDocument[];
  activeDocument: StudyDocument;
  currentPage: number;
  zoomLevel: number;
  searchQuery: string;
  bookmarkedPages: number[];
  activeCitation: Citation | null;
  activeTab: 'tutor' | 'video' | 'flashcards';
  activeVideo: VideoExplanation | null;
  videoSeekTime: number;
  chatMessages: ChatMessage[];
  isAiThinking: boolean;
  isSnipMode: boolean;
  splitRatio: number;
  theme: 'dark' | 'light';
  selectedTextSnippet: string;
  
  // Actions
  setActiveDocument: (doc: StudyDocument) => void;
  setCurrentPage: (page: number) => void;
  setZoomLevel: (zoom: number) => void;
  setSearchQuery: (query: string) => void;
  toggleBookmark: (page: number) => void;
  jumpToCitation: (citation: Citation) => void;
  setActiveTab: (tab: 'tutor' | 'video' | 'flashcards') => void;
  seekVideoTo: (seconds: number) => void;
  sendDoubt: (text: string, intent?: DoubtIntent, snippedImage?: string, selectedSnippet?: string) => Promise<void>;
  setIsSnipMode: (active: boolean) => void;
  setSplitRatio: (ratio: number) => void;
  toggleTheme: () => void;
  setSelectedTextSnippet: (text: string) => void;
  uploadCustomFile: (file: File) => Promise<void>;
  clearChat: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<StudyDocument[]>(SAMPLE_DOCUMENTS);
  const [activeDocument, setActiveDocument] = useState<StudyDocument>(SAMPLE_DOCUMENTS[0]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookmarkedPages, setBookmarkedPages] = useState<number[]>([]);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [activeTab, setActiveTab] = useState<'tutor' | 'video' | 'flashcards'>('tutor');
  const [activeVideo, setActiveVideo] = useState<VideoExplanation | null>(MOCK_VIDEOS['py-division']);
  const [videoSeekTime, setVideoSeekTime] = useState<number>(45);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [isSnipMode, setIsSnipMode] = useState<boolean>(false);
  const [splitRatio, setSplitRatio] = useState<number>(55);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedTextSnippet, setSelectedTextSnippet] = useState<string>('');

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `👋 **Welcome to StudySync AI!**\n\nI am your synchronized AI tutor. Your study material is open on the left.\n\n✨ **Try these interactive actions**:\n- **Select any text** in the document to ask questions.\n- Click **"Snip & Ask"** (camera icon) to crop any formula, diagram, or question just like Google Lens!\n- Click any **Citation Badge** to automatically jump the document to that page.\n- Open the **Video Tab** to see video explanations that seek to the exact second.`,
      timestamp: 'Just now',
    }
  ]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleBookmark = (page: number) => {
    setBookmarkedPages(prev =>
      prev.includes(page) ? prev.filter(p => p !== page) : [...prev, page]
    );
  };

  const jumpToCitation = (citation: Citation) => {
    setCurrentPage(citation.pageNumber);
    setActiveCitation(citation);
    setTimeout(() => {
      setActiveCitation(null);
    }, 5000);
  };

  const seekVideoTo = (seconds: number) => {
    setVideoSeekTime(seconds);
    setActiveTab('video');
  };

  const sendDoubt = async (
    text: string,
    intent: DoubtIntent = 'custom_prompt',
    snippedImage?: string,
    selectedSnippet?: string
  ) => {
    const userMsgId = `msg-user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: text || (intent === 'explain_simple' ? 'Explain this simply' : 'Help me with this question'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      snippedImage,
      extractedQuestion: selectedSnippet,
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsAiThinking(true);

    try {
      const response = await apiService.askDoubt({
        documentId: activeDocument.id,
        query: text,
        selectedText: selectedSnippet,
        currentPage,
        snippedImage,
        intent,
      });

      const aiMsgId = `msg-ai-${Date.now()}`;
      const aiMessage: ChatMessage = {
        id: aiMsgId,
        sender: 'ai',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: response.citations,
        suggestedVideo: response.suggestedVideo,
      };

      setChatMessages(prev => [...prev, aiMessage]);

      if (response.suggestedVideo) {
        setActiveVideo(response.suggestedVideo);
        setVideoSeekTime(response.suggestedVideo.startTime);
      }

      if (intent === 'find_video') {
        setActiveTab('video');
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
      }
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'system',
          text: 'Unable to connect to AI server. Please check your network or try again.',
          timestamp: new Date().toLocaleTimeString(),
        }
      ]);
    } finally {
      setIsAiThinking(false);
      setIsSnipMode(false);
      setSelectedTextSnippet('');
    }
  };

  const uploadCustomFile = async (file: File) => {
    const newDoc = await apiService.uploadDocument(file);
    setDocuments(prev => [newDoc, ...prev]);
    setActiveDocument(newDoc);
    setCurrentPage(1);
    confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
  };

  const clearChat = () => {
    setChatMessages([]);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        documents,
        activeDocument,
        currentPage,
        zoomLevel,
        searchQuery,
        bookmarkedPages,
        activeCitation,
        activeTab,
        activeVideo,
        videoSeekTime,
        chatMessages,
        isAiThinking,
        isSnipMode,
        splitRatio,
        theme,
        selectedTextSnippet,
        setActiveDocument,
        setCurrentPage,
        setZoomLevel,
        setSearchQuery,
        toggleBookmark,
        jumpToCitation,
        setActiveTab,
        seekVideoTo,
        sendDoubt,
        setIsSnipMode,
        setSplitRatio,
        toggleTheme,
        setSelectedTextSnippet,
        uploadCustomFile,
        clearChat,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
