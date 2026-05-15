import { useState, useRef } from "react";

export default function VoiceInput({ onTranscript, onListening }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const setListeningState = (val) => {
    setListening(val);
    if (onListening) onListening(val);
  };

  const supported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const toggle = () => {
    if (!supported) {
      alert("Voice input is not supported in this browser. Try Chrome.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListeningState(false);
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = "en-US"; // Changed from en-IN for better global compatibility
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => console.log("🎤 Voice recognition started");
    recognition.onspeechstart = () => console.log("🗣️ Speech detected...");
    
    recognition.onresult = (e) => {
      console.log("📝 Result received:", e.results.length);
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          finalTranscript += e.results[i][0].transcript;
        } else {
          interimTranscript += e.results[i][0].transcript;
        }
      }

      onTranscript(finalTranscript || interimTranscript, !!finalTranscript);
    };

    recognition.onend = () => {
      console.log("🎤 Voice recognition ended");
      setListeningState(false);
    };

    recognition.onerror = (event) => {
      console.error("❌ Voice recognition error:", event.error);
      setListeningState(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setListeningState(true);
  };

  return (
    <button
      className={`voice-btn ${listening ? "listening" : ""}`}
      onClick={toggle}
      title={listening ? "Stop listening" : "Voice input"}
      type="button"
    >
      {listening ? "⏹" : "🎤"}
    </button>
  );
}
