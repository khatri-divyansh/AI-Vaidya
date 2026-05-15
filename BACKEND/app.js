import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.js";
import { loadPDFsFromFolder } from "./utils/loadPDFs.js";
import { AYURVEDIC_KNOWLEDGE_BASE } from "./data/knowledge.js";
import { splitIntoChunks } from "./utils/retriever.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Load PDFs at startup and combine with built-in knowledge base
async function startServer() {
  console.log("🌿 AI Vaidya starting up...");

  const pdfText = await loadPDFsFromFolder();
  const fullText = AYURVEDIC_KNOWLEDGE_BASE + pdfText;
  
  // Pre-chunk the knowledge for fast searching
  app.locals.knowledgeChunks = splitIntoChunks(fullText);

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
    });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
