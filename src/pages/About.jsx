import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <div className="about-content">
        <h1 className="about-title">About AI Vaidya</h1>
        <p className="about-lead">
          AI Vaidya is a domain-specific Retrieval-Augmented Generation (RAG)
          system built for the BMS Institute of Technology AI Fusion Hackathon.
        </p>

        <section className="about-section">
          <h2>How It Works</h2>
          <ol className="about-steps">
            <li>Upload an Ayurvedic PDF or paste text into the Knowledge Base.</li>
            <li>The system extracts and stores the text as context.</li>
            <li>You ask a question in natural English.</li>
            <li>The AI retrieves the most relevant passages and generates an answer.</li>
            <li>The source passage is shown alongside every answer.</li>
          </ol>
        </section>

        <section className="about-section">
          <h2>Technology Stack</h2>
          <ul className="about-tech">
            <li><strong>Frontend:</strong> React + Vite</li>
            <li><strong>AI Model:</strong> Claude (claude-sonnet-4) via Anthropic API</li>
            <li><strong>PDF Parsing:</strong> pdf.js (client-side)</li>
            <li><strong>Voice Input:</strong> Web Speech API</li>
            <li><strong>Retrieval:</strong> Context-window RAG — knowledge base is passed as system context</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Disclaimer</h2>
          <p>
            AI Vaidya is a research and educational prototype. It is not a
            substitute for professional Ayurvedic or medical advice. Always
            consult a qualified practitioner for health decisions.
          </p>
        </section>

        <button className="home-cta" onClick={() => navigate("/chat")}>
          Start Using AI Vaidya →
        </button>
      </div>
    </div>
  );
}
