import { useState, useRef } from "react";
import { useChat } from "../hooks/useChat";
import { useChatContext } from "../context/ChatContext";
import VoiceInput from "./VoiceInput";

export default function InputBox() {
  const [value, setValue] = useState("");
  const [interimValue, setInterimValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const { sendMessage } = useChat();
  const { isLoading } = useChatContext();
  const textareaRef = useRef();

  const handleSend = () => {
    const finalValue = (value + " " + interimValue).trim();
    if (!finalValue || isLoading) return;
    sendMessage(finalValue);
    setValue("");
    setInterimValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleVoiceTranscript = (text, isFinal) => {
    if (isFinal) {
      setValue((v) => (v.trim() + " " + text).trim());
      setInterimValue("");
    } else {
      setInterimValue(text);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setValue(e.target.value);
    setInterimValue("");
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
  };

  return (
    <div className="input-box-area">
      {isListening && (
        <div className="voice-status">
          <span className="pulse-dot"></span>
          {interimValue ? `"${interimValue}..."` : "Listening..."}
        </div>
      )}
      <div className="input-row">
        <textarea
          ref={textareaRef}
          className="question-input"
          value={interimValue ? (value.trim() + " " + interimValue).trim() : value}
          onInput={handleInput}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask a question about Ayurveda…"
          rows={1}
          disabled={isLoading}
        />
        <VoiceInput 
          onTranscript={handleVoiceTranscript} 
          onListening={setIsListening}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          title="Send"
        >
          ➤
        </button>
      </div>
      <p className="input-hint">
        Answers are grounded in our built-in Ayurvedic database · Enter to send
      </p>
    </div>
  );
}
