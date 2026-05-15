import { createContext, useContext, useState, useCallback } from "react";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [knowledgeBase, setKnowledgeBase] = useState("");
  const [pdfText, setPdfText] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const effectiveKnowledge = pdfText || knowledgeBase;

  const addMessage = useCallback((role, content, sourceChunk = null) => {
    setMessages((prev) => [...prev, { id: Date.now(), role, content, sourceChunk }]);
  }, []);

  const clearChat = useCallback(() => setMessages([]), []);

  const clearKnowledge = useCallback(() => {
    setKnowledgeBase("");
    setPdfText("");
    setPdfName("");
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        clearChat,
        knowledgeBase,
        setKnowledgeBase,
        pdfText,
        setPdfText,
        pdfName,
        setPdfName,
        effectiveKnowledge,
        isLoading,
        setIsLoading,
        sidebarOpen,
        setSidebarOpen,
        clearKnowledge,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used inside ChatProvider");
  return ctx;
}
