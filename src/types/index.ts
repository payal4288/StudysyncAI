export interface Citation {
  id: string;
  pageNumber: number;
  highlightText: string;
  boundingRect?: {
    top: number; // percentage
    left: number; // percentage
    width: number; // percentage
    height: number; // percentage
  };
  contextNote: string;
}

export interface VideoExplanation {
  videoId: string; // YouTube video ID (e.g. "dQw4w9WgXcQ" or specific educational IDs)
  title: string;
  channel: string;
  startTime: number; // in seconds
  endTime?: number;
  thumbnailUrl: string;
  keyPoints: string[];
  transcriptSnippet: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  citations?: Citation[];
  suggestedVideo?: VideoExplanation;
  extractedQuestion?: string;
  snippedImage?: string; // base64 or URL
  isStreaming?: boolean;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  pageReference: number;
}

export interface DocumentPage {
  pageNumber: number;
  title: string;
  content: string; // Structured text content for searchable & selectable reading
  equations?: string[];
  diagramDescription?: string;
  diagramUrl?: string;
}

export interface StudyDocument {
  id: string;
  title: string;
  subject: string;
  totalPages: number;
  fileType: 'pdf' | 'ppt' | 'notes';
  pages: DocumentPage[];
  flashcards: Flashcard[];
}

export type DoubtIntent = 'explain_simple' | 'step_by_step_math' | 'find_video' | 'custom_prompt';
