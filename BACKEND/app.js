import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.js";
import { loadPDFsFromFolder } from "./utils/loadPDFs.js";
import { AYURVEDIC_KNOWLEDGE_BASE } from "./data/knowledge.js";
import { splitIntoChunks } from "./utils/retriever.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Load PDFs at startup and combine with built-in knowledge base
async function startServer() {
  console.log("🌿 AI Vaidya starting up with Semantic Retrieval...");

  const pdfText = await loadPDFsFromFolder();
  const fullText = AYURVEDIC_KNOWLEDGE_BASE + pdfText;
  
  const chunkTexts = splitIntoChunks(fullText);
  const chunkObjects = [];

  app.locals.knowledgeChunks = chunkTexts.map(text => ({ text, embedding: [] }));

  // Run embedding generation in the background to avoid blocking the server
  generateEmbeddings(app, chunkTexts);

  const pdfNote = pdfText
    ? `\n📖 PDF content added: ${pdfText.length.toLocaleString()} extra characters`
    : "\n📖 No PDFs loaded. Using built-in knowledge base only.";
  console.log(`✅ Knowledge base ready: ${app.locals.knowledgeChunks.length} chunks created.${pdfNote}`);

  // Routes
  app.use("/api", chatRoutes);

  // Health check
  app.get("/health", (req, res) => {
    res.json({
      status: "Server is running",
      chunks: app.locals.knowledgeChunks.length,
      embeddingsReady: app.locals.knowledgeChunks.some(c => c.embedding.length > 0)
    });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

async function generateEmbeddings(app, chunkTexts) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.OPENROUTER_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

    console.log(`📡 Background: Generating semantic embeddings for ${chunkTexts.length} chunks...`);

    for (let i = 0; i < chunkTexts.length; i += 20) {
      const batch = chunkTexts.slice(i, i + 20);
      const result = await model.batchEmbedContents({
        requests: batch.map(text => ({
          content: { parts: [{ text }] },
          taskType: "RETRIEVAL_DOCUMENT"
        }))
      });

      result.embeddings.forEach((emb, idx) => {
        const index = i + idx;
        if (app.locals.knowledgeChunks[index]) {
          app.locals.knowledgeChunks[index].embedding = emb.values;
        }
      });
      process.stdout.write("."); 
      
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    console.log("\n✅ Semantic Database fully initialized.");
  } catch (err) {
    console.error("\n❌ Background embedding failed:", err.message);
  }
}

startServer();
