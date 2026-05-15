import { useChat } from "../hooks/useChat";

const QUESTIONS = [
  "What are the three doshas in Ayurveda?",
  "How does digestion work in Ayurveda?",
  "What are the three Gunas?",
  "Which herbs help with cough and cold?",
  "What is Panchakarma?",
  "How does turmeric help in wound healing?",
];

export default function SuggestedQuestions() {
  const { sendMessage } = useChat();

  return (
    <div className="suggested-questions">
      <p className="suggested-label">Try asking:</p>
      <div className="suggested-pills">
        {QUESTIONS.map((q) => (
          <button
            key={q}
            className="suggested-pill"
            onClick={() => sendMessage(q)}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
