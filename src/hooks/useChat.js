import { useCallback } from "react";
import { useChatContext } from "../context/ChatContext";

const SYSTEM_PROMPT = (knowledge) => `You are AI Vaidya, a deeply knowledgeable Ayurvedic assistant. You answer ONLY from the provided Ayurvedic knowledge base below. Never hallucinate or use outside knowledge.

Rules:
1. Answer clearly and concisely in 3–5 sentences.
2. After your answer, add a line that begins with "SOURCE:" followed by the most relevant passage (≤70 words) from the text that supports your answer.
3. If the topic is not covered in the text, respond: "The provided Ayurvedic texts do not contain information about this topic. Please upload more comprehensive texts."

AYURVEDIC KNOWLEDGE BASE:
${knowledge.substring(0, 7000)}`;

export function useChat() {
  const { addMessage, setIsLoading, effectiveKnowledge } = useChatContext();

  const sendMessage = useCallback(
    async (question) => {
      if (!question.trim()) return;
      if (!effectiveKnowledge.trim()) {
        addMessage(
          "assistant",
          "⚠️ Please upload a PDF or paste Ayurvedic text in the Knowledge Base before asking questions.",
          null
        );
        return;
      }

      addMessage("user", question);
      setIsLoading(true);

      try {
        const response = await fetch("http://localhost:5000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: question,
            knowledge: effectiveKnowledge,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          addMessage("assistant", `⚠️ API Error: ${data.error}`, null);
          return;
        }

        const fullText = data.response || "";
        const sourceMatch = fullText.match(/SOURCE:([\s\S]+)$/i);
        const mainAnswer = sourceMatch
          ? fullText.substring(0, fullText.indexOf(sourceMatch[0])).trim()
          : fullText.trim();
        const sourceText = sourceMatch ? sourceMatch[1].trim() : null;

        addMessage("assistant", mainAnswer, sourceText);
      } catch (err) {
        addMessage("assistant", "⚠️ Connection error. Please try again.", null);
      } finally {
        setIsLoading(false);
      }
    },
    [addMessage, setIsLoading, effectiveKnowledge]
  );

  return { sendMessage };
}
