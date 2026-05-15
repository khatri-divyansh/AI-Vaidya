import { useEffect, useRef, useState } from "react";

export default function VoiceInput({ onTranscript, onListening }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  const onTranscriptRef = useRef(onTranscript);
  const onListeningRef = useRef(onListening);
  useEffect(() => { onTranscriptRef.current = onTranscript; }, [onTranscript]);
  useEffect(() => { onListeningRef.current = onListening; }, [onListening]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }

    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-IN";

    r.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += t;
        } else {
          interim += t;
        }
      }

      if (final) onTranscriptRef.current(final, true);
      if (interim) onTranscriptRef.current(interim, false);
    };

    r.onerror = (event) => {
      if (event.error === "no-speech") {
        try {
          r.stop();
          r.start();
        } catch (err) {
          console.warn("restart error:", err);
        }
        return;
      }

      console.error("SpeechRecognition error:", event.error);
      setListening(false);
      onListeningRef.current?.(false);
    };

    r.onend = () => {
      setListening(false);
      onListeningRef.current?.(false);
    };

    recognitionRef.current = r;

    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const toggle = () => {
    const r = recognitionRef.current;
    if (!r) return;

    if (listening) {
      r.stop();
      setListening(false);
      onListeningRef.current?.(false);
    } else {
      try {
        r.start();
        setListening(true);
        onListeningRef.current?.(true);
      } catch (err) {
        console.warn("start() error:", err);
      }
    }
  };

  if (!supported) {
    return (
      <button disabled title="Voice not supported — use Chrome or Edge">
        🎤
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      title={listening ? "Stop listening" : "Speak your question"}
      style={{
        background: listening ? "#e53e3e" : "transparent",
        color: listening ? "#fff" : "inherit",
        border: "1px solid currentColor",
        borderRadius: "50%",
        width: 36,
        height: 36,
        cursor: "pointer",
        fontSize: 16,
        transition: "all 0.2s",
      }}
    >
      {listening ? "⏹" : "🎤"}
    </button>
  );
}