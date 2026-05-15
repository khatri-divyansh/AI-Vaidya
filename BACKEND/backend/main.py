from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tempfile, os, shutil

from ingest import build_faiss_index
from rag_pipeline import AyurvedaRAG

app = FastAPI(title="AI Vaidya API", version="1.0")

# Allow frontend (Stitch/React) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Models ──────────────────────────────────────────
class QuestionRequest(BaseModel):
    question: str

class QuestionResponse(BaseModel):
    answer: str
    sources: list[dict]
    avg_confidence: float

# ── Routes ──────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "AI Vaidya backend running ✅"}

@app.get("/health")
def health():
    index_ready = os.path.exists("index_data/faiss.index")
    return {
        "status": "ok",
        "index_ready": index_ready
    }

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """Upload an Ayurveda PDF and build the FAISS index."""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(400, "Only PDF files are accepted.")
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        chunk_count = build_faiss_index(tmp_path)
        return {
            "message": "PDF processed successfully",
            "chunks_indexed": chunk_count,
            "filename": file.filename
        }
    except Exception as e:
        raise HTTPException(500, f"Failed to process PDF: {str(e)}")
    finally:
        os.unlink(tmp_path)

@app.post("/ask", response_model=QuestionResponse)
def ask_question(body: QuestionRequest):
    """Ask a question and get a grounded Ayurvedic answer."""
    if not body.question.strip():
        raise HTTPException(400, "Question cannot be empty.")
    
    if not os.path.exists("index_data/faiss.index"):
        raise HTTPException(400, "No knowledge base loaded. Upload a PDF first.")
    
    try:
        rag = AyurvedaRAG.get_instance()
        result = rag.answer(body.question)
        return result
    except Exception as e:
        raise HTTPException(500, f"Error generating answer: {str(e)}")

@app.get("/status")
def index_status():
    """Check if knowledge base is loaded."""
    import pickle
    if os.path.exists("index_data/chunks.pkl"):
        with open("index_data/chunks.pkl", "rb") as f:
            chunks = pickle.load(f)
        return {"loaded": True, "chunk_count": len(chunks)}
    return {"loaded": False, "chunk_count": 0}