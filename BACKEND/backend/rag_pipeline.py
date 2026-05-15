from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import pickle
import anthropic
import os
from dotenv import load_dotenv

load_dotenv()

INDEX_PATH = "index_data"

class AyurvedaRAG:
    _instance = None  # singleton so model loads once

    def __init__(self):
        print("🔄 Loading RAG pipeline...")
        self.embedder = SentenceTransformer("all-MiniLM-L6-v2")
        self.index = faiss.read_index(f"{INDEX_PATH}/faiss.index")
        with open(f"{INDEX_PATH}/chunks.pkl", "rb") as f:
            self.chunks = pickle.load(f)
        self.client = anthropic.Anthropic(
            api_key=os.getenv("ANTHROPIC_API_KEY")
        )
        print(f"✅ RAG ready — {len(self.chunks)} chunks loaded")

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def retrieve(self, query: str, top_k: int = 4) -> list[dict]:
        q_vec = self.embedder.encode([query]).astype("float32")
        distances, indices = self.index.search(q_vec, top_k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx < len(self.chunks):
                # Convert L2 distance to confidence score (0-100)
                confidence = max(0, round(100 - float(distances[0][i]) * 10, 1))
                results.append({
                    "chunk": self.chunks[idx],
                    "confidence": confidence
                })
        return results

    def answer(self, query: str) -> dict:
        retrieved = self.retrieve(query)
        
        if not retrieved:
            return {
                "answer": "No relevant information found in the Ayurvedic texts.",
                "sources": [],
                "avg_confidence": 0
            }

        context = "\n\n---\n\n".join([r["chunk"] for r in retrieved])
        avg_confidence = round(
            sum(r["confidence"] for r in retrieved) / len(retrieved), 1
        )

        prompt = f"""You are AI Vaidya, a knowledgeable Ayurvedic assistant.
Your answers must be based ONLY on the context provided below from classical Ayurvedic texts.
If the answer is not clearly present in the context, respond:
"This specific information was not found in the loaded Ayurvedic texts."
Never fabricate or guess. Be concise, clear, and helpful.

CONTEXT:
{context}

QUESTION: {query}

Provide a well-structured answer in 3-5 sentences. 
If relevant, mention the Ayurvedic concept or text this relates to."""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=800,
            messages=[{"role": "user", "content": prompt}]
        )

        return {
            "answer": response.content[0].text,
            "sources": retrieved,
            "avg_confidence": avg_confidence
        }