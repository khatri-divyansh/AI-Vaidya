import SourceCard from "./SourceCard";

export default function ChatMessage({ message }) {
  const { role, content, sourceChunk } = message;
  const isUser = role === "user";

  const speak = () => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = "en-IN";
    utterance.rate = 0.9; // Slightly slower for clearer Ayurvedic terms
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`chat-message ${isUser ? "user" : "assistant"}`}>
      <div className="msg-avatar">{isUser ? "🙏" : "🌿"}</div>
      <div className="msg-content-wrap">
        <div className="msg-bubble">
          <div className="msg-text">
            {content.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < content.split("\n").length - 1 && <br />}
              </span>
            ))}
          </div>
          <button 
            className="speak-btn" 
            onClick={speak} 
            title="Read aloud"
          >
            🔊
          </button>
        </div>
        {sourceChunk && <SourceCard text={sourceChunk} />}
      </div>
    </div>
  );
}
