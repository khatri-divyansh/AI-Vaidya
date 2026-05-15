import { createContext, useContext, useState, useCallback } from "react";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const addMessage = useCallback((role, content, sourceChunk = null) => {
    setMessages((prev) => [...prev, { id: Date.now(), role, content, sourceChunk }]);
  }, []);

  const clearChat = useCallback(() => setMessages([]), []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        clearChat,
        isLoading,
        setIsLoading,
        sidebarOpen,
        setSidebarOpen,
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
