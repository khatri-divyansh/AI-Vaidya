import { useEffect, useRef } from "react";
import { useChatContext } from "../context/ChatContext";
import ChatMessage from "./ChatMessage";
import Loader from "./Loader";
import SuggestedQuestions from "./SuggestedQuestions";

export default function ChatHistory() {
  const { messages, isLoading } = useChatContext();
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="chat-welcome">
        <div className="welcome-card fundamentals-view">
          <span className="welcome-lotus">🕉️</span>
          <h2 className="welcome-title">Fundamentals of Ayurveda</h2>
          <div className="fundamentals-content">
            <p>
              AI Vaidya is grounded in the timeless wisdom of Ayurvedic medicine. 
              Our knowledge base covers the core principles including:
            </p>
            <div className="fundamentals-grid">
              <div className="fund-item"><strong>The Three Doshas:</strong> Vata, Pitta, and Kapha</div>
              <div className="fund-item"><strong>The Three Gunas:</strong> Sattva, Rajas, and Tamas</div>
              <div className="fund-item"><strong>Agni:</strong> The essential digestive fire</div>
              <div className="fund-item"><strong>Herbal Wisdom:</strong> Turmeric, Tulsi, Ashwagandha, and more</div>
              <div className="fund-item"><strong>Panchakarma:</strong> Traditional therapeutic procedures</div>
            </div>
            <p className="start-hint">Ask your first question below to begin your consultation.</p>
          </div>
          <SuggestedQuestions />
        </div>
      </div>
    );
  }

  return (
    <div className="chat-history">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {isLoading && <Loader />}
      <div ref={bottomRef} />
    </div>
  );
}
