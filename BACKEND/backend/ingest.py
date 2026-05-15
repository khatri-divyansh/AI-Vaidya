import fitz  # PyMuPDF
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import pickle
import os

CHUNK_SIZE = 500
CHUNK_OVERLAP = 100
INDEX_PATH = "index_data"

def extract_text(pdf_path: str) -> str:
    doc = fitz.open(pdf_path)
    full_text = ""
    for page in doc:
        full_text += page.get_text()
    doc.close()
    return full_text

def chunk_text(text: str) -> list[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = start + CHUNK_SIZE
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start += CHUNK_SIZE - CHUNK_OVERLAP
    return chunks

def build_faiss_index(pdf_path: str):
    print("📄 Extracting text from PDF...")
    text = extract_text(pdf_path)

    print("✂️  Chunking text...")
    chunks = chunk_text(text)
    print(f"   Total chunks: {len(chunks)}")

    print("🔢 Generating embeddings (first run takes ~3 mins)...")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    embeddings = model.encode(chunks, show_progress_bar=True)
    embeddings = np.array(embeddings, dtype="float32")

    print("🗄️  Building FAISS index...")
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)

    os.makedirs(INDEX_PATH, exist_ok=True)
    faiss.write_index(index, f"{INDEX_PATH}/faiss.index")
    with open(f"{INDEX_PATH}/chunks.pkl", "wb") as f:
        pickle.dump(chunks, f)

    print(f"✅ Done! {len(chunks)} chunks indexed and saved.")
    return len(chunks)

# Run directly to pre-build index
if __name__ == "__main__":
    import sys
    pdf = sys.argv[1] if len(sys.argv) > 1 else "ayurveda.pdf"
    build_faiss_index(pdf)