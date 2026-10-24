import type { StudyDocument, VideoExplanation } from '../types';
import { MOCK_VIDEOS } from './mockData';

export interface AskDoubtRequest {
  documentId: string;
  query: string;
  selectedText?: string;
  currentPage: number;
  snippedImage?: string;
  intent?: 'explain_simple' | 'step_by_step_math' | 'find_video' | 'custom_prompt';
}

export interface AskDoubtResponse {
  answer: string;
  citations: {
    id: string;
    pageNumber: number;
    highlightText: string;
    contextNote: string;
  }[];
  suggestedVideo?: VideoExplanation;
}

export interface OCRSnippetResponse {
  extractedText: string;
  detectedConcept: string;
  mathFormula?: string;
  suggestedPrompt: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  }

  // Upload or parse PDF/image
  async uploadDocument(file: File): Promise<StudyDocument> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${this.baseUrl}/api/documents/upload`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback to client mock reader
    }

    // Mock client-side file representation
    const newDoc: StudyDocument = {
      id: `doc-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ""),
      subject: 'Uploaded Custom Material',
      totalPages: 2,
      fileType: file.name.endsWith('.ppt') || file.name.endsWith('.pptx') ? 'ppt' : 'pdf',
      pages: [
        {
          pageNumber: 1,
          title: `Page 1: ${file.name}`,
          content: `Imported Content from "${file.name}".\n\nStudySync AI has parsed the document. You can now use the "Snip & Ask" marquee tool to capture any equation, diagram, or paragraph, or select text directly to get instant AI explanations and video solutions.`,
        },
        {
          pageNumber: 2,
          title: 'Page 2: Summary & Reference Notes',
          content: 'Key concepts extracted from uploaded file.\n\nAsk questions in the AI Tutor panel to explore deeper conceptual details.',
        }
      ],
      flashcards: [
        {
          id: `fc-up-${Date.now()}`,
          category: 'Document Key Term',
          front: `What is the primary topic of ${file.name}?`,
          back: 'Derived dynamically from your uploaded material.',
          pageReference: 1
        }
      ]
    };
    return newDoc;
  }

  // OCR and Multimodal Snipping
  async processSnippedImage(base64Image: string): Promise<OCRSnippetResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/api/doubts/scan-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback mock
    }

    await new Promise((r) => setTimeout(r, 800));
    return {
      extractedText: "What is the difference between '/' and '//' in Python division?",
      detectedConcept: "Python Arithmetic Operators & Floor Division",
      mathFormula: "a // b = \\lfloor a / b \\rfloor",
      suggestedPrompt: "Explain the difference between '/' and '//' with clear code examples."
    };
  }

  // Ask AI Tutor doubt
  async askDoubt(req: AskDoubtRequest): Promise<AskDoubtResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/api/doubts/ask-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    await new Promise((r) => setTimeout(r, 1100));

    const q = (req.query || req.selectedText || '').toLowerCase();

    if (q.includes('/') || q.includes('division') || q.includes('floor') || q.includes('operator')) {
      return {
        answer: `### Explanation: Single Slash (\`/\`) vs Double Slash (\`//\`) in Python

1. **True Division (\`/\`)**:
   - Computes float division.
   - Always produces a **floating-point number**, even if the numbers divide evenly.
   - \`10 / 2\` returns \`5.0\` (float), not \`5\` (int).
   - \`7 / 2\` returns \`3.5\`.

2. **Floor Division (\`//\`)**:
   - Performs integer division by taking the mathematical floor: $\\lfloor a / b \\rfloor$.
   - Rounds down to the nearest integer towards negative infinity.
   - \`7 // 2\` returns \`3\`.
   - **Important Exam Trap**: \`-7 // 2\` returns \`-4\` (because $-3.5$ rounded down is $-4$, NOT $-3$!).

3. **Formula relationship with Modulus (\`%\`)**:
   $$a = (a // b) \\times b + (a \\% b)$$`,
        citations: [
          {
            id: 'cit-1',
            pageNumber: 1,
            highlightText: "The Critical Difference: True Division (/) vs Floor Division (//)",
            contextNote: "Section 2: Float division vs integer floor division rules"
          }
        ],
        suggestedVideo: MOCK_VIDEOS['py-division']
      };
    }

    if (q.includes('binary') || q.includes('search') || q.includes('complexity') || q.includes('log')) {
      return {
        answer: `### Binary Search & Time Complexity Breakdown

1. **Why $O(\\log N)$?**:
   - In each step, the search interval is cut strictly in half: $N \\to N/2 \\to N/4 \\dots \\to 1$.
   - Solving $N / 2^k = 1$ yields $k = \\log_2 N$ iterations in the worst-case.

2. **Mid Calculation Invariant**:
   - Using \`mid = left + (right - left) // 2\` prevents arithmetic integer overflow in languages with fixed word sizes.

3. **Space Complexity**:
   - Iterative approach: **$O(1)$** auxiliary memory.
   - Recursive approach: **$O(\\log N)$** stack frames.`,
        citations: [
          {
            id: 'cit-2',
            pageNumber: 1,
            highlightText: "mid = left + (right - left) // 2",
            contextNote: "Step 2.a: Algorithm Implementation invariant"
          }
        ],
        suggestedVideo: MOCK_VIDEOS['binary-search']
      };
    }

    return {
      answer: `Based on **Page ${req.currentPage}** of your study document:

The selected text or concept:
> "${req.selectedText || req.query}"

**Key Breakdown**:
- This refers to core algorithmic and language syntax principles covered in this chapter.
- Review the highlighted sections on the left to verify the exact definitions and formula constraints.
- You can also view the corresponding video demonstration in the **Video Explanation** tab!`,
      citations: [
        {
          id: `cit-custom-${Date.now()}`,
          pageNumber: req.currentPage,
          highlightText: req.selectedText || "Chapter Notes & Formulae",
          contextNote: `Page ${req.currentPage} context reference`
        }
      ],
      suggestedVideo: MOCK_VIDEOS['py-division']
    };
  }
}

export const apiService = new ApiService();
