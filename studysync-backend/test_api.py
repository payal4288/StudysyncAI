import io
import requests
from pypdf import PdfWriter

# 1. Create a dummy test PDF in-memory
writer = PdfWriter()
page = writer.add_blank_page(width=612, height=792)
# Since blank page has no text, let's write a quick test using PyPDF or simple test
print("--- 1. Testing GET /health ---")
health_res = requests.get("http://127.0.0.1:8000/health")
print("Health Response:", health_res.json())

# Test with in-memory documents
print("\n--- 2. Direct Mock Upload Verification ---")
# Let's create a real minimal PDF with stream
from pypdf.generic import DecodedStreamObject, NameObject, ArrayObject

pdf_bytes = io.BytesIO()
writer.write(pdf_bytes)
pdf_bytes.seek(0)

upload_res = requests.post(
    "http://127.0.0.1:8000/documents/upload",
    files={"file": ("python_notes.pdf", pdf_bytes, "application/pdf")}
)
print("Upload Response:", upload_res.json())
doc_id = upload_res.json().get("document_id")

print(f"\n--- 3. Testing POST /ask with Gemini AI for doc {doc_id} ---")
ask_res = requests.post(
    "http://127.0.0.1:8000/ask",
    json={
        "document_id": doc_id,
        "question": "Explain the difference between '/' and '//' in Python with short code examples."
    }
)
print("Ask Status Code:", ask_res.status_code)
print("Ask Response:", ask_res.json())
