import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const SYSTEM_PROMPT = (knowledge) => `You are AI Vaidya, a deeply knowledgeable Ayurvedic assistant. You answer ONLY from the provided Ayurvedic knowledge base below. Never hallucinate or use outside knowledge.

Rules:
1. Answer clearly and concisely in 3–5 sentences.
2. After your answer, add a line that begins with "SOURCE:" followed by the most relevant passage (≤70 words) from the text that supports your answer.
3. If the topic is not covered in the text, respond: "The provided Ayurvedic texts do not contain information about this topic. Please upload more comprehensive texts."

AYURVEDIC KNOWLEDGE BASE:
${knowledge.substring(0, 7000)}`;

router.post("/chat", async (req, res) => {
  const { message, knowledge } = req.body;
  
  if (!message || !knowledge) {
    return res.status(400).json({ error: "Missing message or knowledge in request" });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(500).json({ error: "OpenRouter API key not configured" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "AI Vaidya"
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT(knowledge)
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 1000
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter API Error:", data);
      return res.status(response.status).json({ error: data.error?.message || "OpenRouter API error" });
    }

    const fullText = data.choices[0]?.message?.content || "";
    
    res.json({ response: fullText });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: err.message || "Failed to get response from OpenRouter" });
  }
});

export default router;