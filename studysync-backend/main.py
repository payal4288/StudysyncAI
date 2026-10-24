import os
import uuid
from io import BytesIO
from typing import Optional
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pypdf import PdfReader
from supabase import create_client, Client
from google import genai

# Load environment variables from .env
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_KEY:
    raise RuntimeError("Missing GEMINI_API_KEY in .env file.")

# Initialize Supabase client if valid credentials are provided
supabase: Optional[Client] = None
is_supabase_connected = False

if SUPABASE_URL and SUPABASE_KEY and "your-project-id" not in SUPABASE_URL and "your_supabase" not in SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        is_supabase_connected = True
        print("[INFO] Supabase client initialized successfully.")
    except Exception as e:
        print(f"[WARN] Could not connect to Supabase: {e}. Falling back to in-memory store.")
else:
    print("[WARN] Supabase placeholder credentials detected. Using in-memory fallback store until credentials are provided.")

# Local in-memory fallback store for documents and chats
in_memory_documents = {}
in_memory_chats = {}

# Initialize Google GenAI client
ai = genai.Client(api_key=GEMINI_KEY)

app = FastAPI(
    title="StudySync AI Backend",
    description="Unified API server for PDF ingestion, multimodal learning, and Gemini AI doubt solving.",
    version="1.0.0"
)

# CORS configuration for frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AskRequest(BaseModel):
    document_id: str = Field(..., description="The UUID of the uploaded document.")
    question: str = Field(..., description="The student's doubt or question.")

class AskResponse(BaseModel):
    answer: str
    document_id: str
    saved_to_history: bool

@app.get("/health")
def health_check():
    """Health check endpoint to verify backend status."""
    return {
        "status": "healthy",
        "service": "StudySync AI Backend",
        "gemini_connected": bool(GEMINI_KEY),
        "supabase_connected": is_supabase_connected,
        "storage_mode": "Supabase PostgreSQL" if is_supabase_connected else "In-Memory Prototype Cache"
    }

@app.post("/documents/upload")
@app.post("/api/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload a PDF file, extract its text content, and store it."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported at this endpoint.")

    try:
        content = await file.read()
        reader = PdfReader(BytesIO(content))
        
        extracted_pages = []
        for i, page in enumerate(reader.pages):
            page_text = page.extract_text() or ""
            if page_text.strip():
                extracted_pages.append(f"--- Page {i + 1} ---\n{page_text.strip()}")
        
        full_text = "\n\n".join(extracted_pages)
        if not full_text.strip():
            full_text = f"Document: {file.filename}\n(Text could not be extracted; document might contain scanned images without OCR text layer)."

        doc_id = str(uuid.uuid4())

        # Attempt to store in Supabase
        stored_in_supabase = False
        if supabase and is_supabase_connected:
            try:
                res = supabase.table("documents").insert({
                    "id": doc_id,
                    "filename": file.filename,
                    "extracted_text": full_text
                }).execute()
                stored_in_supabase = True
            except Exception as e:
                print(f"[WARN] Failed to insert document into Supabase: {e}")

        # Always keep in local memory cache as well
        in_memory_documents[doc_id] = {
            "id": doc_id,
            "filename": file.filename,
            "extracted_text": full_text,
            "total_pages": len(reader.pages)
        }

        return {
            "document_id": doc_id,
            "filename": file.filename,
            "total_pages": len(reader.pages),
            "extracted_characters": len(full_text),
            "stored_in_supabase": stored_in_supabase,
            "message": "Document parsed and indexed successfully."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")

@app.post("/ask", response_model=AskResponse)
async def ask_question(request: AskRequest):
    """Answer student doubts using the uploaded PDF content as grounded context via Gemini AI."""
    extracted_text = ""

    # Look up in Supabase first if connected
    if supabase and is_supabase_connected:
        try:
            res = supabase.table("documents").select("extracted_text").eq("id", request.document_id).execute()
            if res.data and len(res.data) > 0:
                extracted_text = res.data[0]["extracted_text"]
        except Exception as e:
            print(f"[WARN] Error fetching from Supabase: {e}")

    # Fallback to in-memory store
    if not extracted_text and request.document_id in in_memory_documents:
        extracted_text = in_memory_documents[request.document_id]["extracted_text"]

    # If document still not found, return helpful 404
    if not extracted_text:
        raise HTTPException(
            status_code=404,
            detail=f"Document with ID '{request.document_id}' not found. Please upload a PDF first."
        )

    # Bound context to first ~12,000 characters to keep queries ultra-fast and cost-efficient
    bounded_context = extracted_text[:12000]

    system_instruction = (
        "You are StudySync AI, an expert, encouraging university tutor for engineering and science students. "
        "Your task is to explain concepts clearly, resolve doubts step-by-step, and ground your explanations "
        "in the provided study material. Always include relevant math formulas, code examples where applicable, "
        "and mention specific page numbers if they appear in the text."
    )

    prompt = (
        f"STUDY MATERIAL CONTEXT:\n{bounded_context}\n\n"
        f"STUDENT DOUBT / QUESTION:\n{request.question}\n\n"
        "Provide a clear, engaging, step-by-step explanation for the student."
    )

    try:
        response = ai.models.generate_content(
            model="gemini-3.8-flash",
            contents=prompt,
            config={
                "system_instruction": system_instruction,
                "temperature": 0.4,
            }
        )
        answer = response.text or "I was unable to generate an answer. Please rephrase your question."

        # Save to chat history
        saved_to_history = False
        if supabase and is_supabase_connected:
            try:
                supabase.table("chat_history").insert({
                    "document_id": request.document_id,
                    "question": request.question,
                    "answer": answer
                }).execute()
                saved_to_history = True
            except Exception as e:
                print(f"[WARN] Failed to save chat history to Supabase: {e}")

        # Local in-memory chat cache
        if request.document_id not in in_memory_chats:
            in_memory_chats[request.document_id] = []
        in_memory_chats[request.document_id].append({
            "question": request.question,
            "answer": answer
        })

        return AskResponse(
            answer=answer,
            document_id=request.document_id,
            saved_to_history=saved_to_history
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini AI generation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
