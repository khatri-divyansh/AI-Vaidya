import { useState, useRef } from "react";

export default function VoiceInput({ onTranscript, onListening }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const supported = typeof window !== "undefined" && 
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const toggle = () => {
    if (!supported) return;

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      onListening?.(false);
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();

    // Configuration
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => {
      console.log("🎤 Mic active");
      setListening(true);
      onListening?.(true);
    };

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      onTranscript(final || interim, !!final);
    };

    recognition.onerror = (event) => {
      console.error("Voice Error:", event.error);
      if (event.error === "no-speech") {
        alert("Microphone heard no sound. Please check your mic connection or speak louder.");
      } else if (event.error === "not-allowed") {
        alert("Microphone permission denied. Please enable it in browser settings.");
      }
      stop();
    };

    recognition.onend = () => {
      setListening(false);
      onListening?.(false);
    };

    const stop = () => {
      recognition.stop();
      setListening(false);
      onListening?.(false);
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.error("Start failed:", err);
    }
  };

  return (
    <button
      className={`voice-btn ${listening ? "listening" : ""}`}
      onClick={toggle}
      title={listening ? "Stop listening" : "Speak your question"}
      type="button"
    >
      {listening ? "⏹" : "🎤"}
    </button>
  );
}