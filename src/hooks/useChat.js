import { useCallback } from "react";
import { useChatContext } from "../context/ChatContext";

export function useChat() {
  const { addMessage, setIsLoading } = useChatContext();

  const sendMessage = useCallback(
    async (question) => {
      if (!question.trim()) return;

      addMessage("user", question);
      setIsLoading(true);

      try {
        const response = await fetch("http://localhost:5000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: question
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
    [addMessage, setIsLoading]
  );

  return { sendMessage };
}
