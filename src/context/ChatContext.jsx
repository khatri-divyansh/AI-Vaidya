import { createContext, useContext, useState, useCallback } from "react";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const addMessage = useCallback((role, content, sourceChunk = null) => {
    setMessages((prev) => [...prev, { id: Date.now(), role, content, sourceChunk }]);
  }, []);

  const clearChat = useCallback(() => {
    if (messages.length > 0) {
      setSessions((prev) => [
        { id: Date.now(), title: messages[0].content.substring(0, 30), messages: [...messages] },
        ...prev
      ]);
    }
    setMessages([]);
  }, [messages]);

  const loadSession = useCallback((session) => {
    setMessages(session.messages);
  }, []);

  const deleteSession = useCallback((sessionId) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        sessions,
        addMessage,
        clearChat,
        loadSession,
        deleteSession,
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
