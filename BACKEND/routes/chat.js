import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getRelevantChunks } from "../utils/retriever.js";

dotenv.config();

const router = express.Router();

const SYSTEM_PROMPT = (knowledge) => `You are AI Vaidya, a deeply knowledgeable Ayurvedic assistant. You answer ONLY from the provided Ayurvedic knowledge base below. Never hallucinate or use outside knowledge.

Rules:
1. Answer clearly and concisely in 3–5 sentences.
2. After your answer, add a line that begins with "SOURCE:" followed by the most relevant passage (≤70 words) from the text that supports your answer.
3. If the topic is not covered in the text, respond: "The provided Ayurvedic texts do not contain information about this topic."

AYURVEDIC KNOWLEDGE BASE:
${knowledge}`;

router.post("/chat", async (req, res) => {
  const { message } = req.body;
  const chunks = req.app.locals.knowledgeChunks || [];
  
  if (!message) {
    return res.status(400).json({ error: "Missing message in request" });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(500).json({ error: "Gemini API key not configured" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.OPENROUTER_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

    // Retrieve relevant context using Vector Search
    const relevantKnowledge = await getRelevantChunks(message, chunks, genAI);

    const prompt = `${SYSTEM_PROMPT(relevantKnowledge)}\n\nUSER QUESTION: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const fullText = response.text();
    
    res.json({ response: fullText });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: err.message || "Failed to get response from Gemini" });
  }
});

export default router;