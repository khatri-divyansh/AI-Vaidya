import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="page-layout">
      <Navbar />
      <div className="about-page">
        <div className="about-content">
          <h1 className="about-title">About AI Vaidya</h1>
          <p className="about-lead">
            AI Vaidya is an advanced Retrieval-Augmented Generation (RAG)
            intelligence system specifically trained on the core texts of Ayurvedic medicine.
          </p>

          <section className="about-section">
            <h2>How It Works</h2>
            <ol className="about-steps">
              <li><strong>Built-in Knowledge:</strong> The system automatically parses a curated library of Ayurvedic PDFs on startup.</li>
              <li><strong>Smart Retrieval:</strong> When you ask a question, AI Vaidya searches the entire database for the most relevant semantic chunks.</li>
              <li><strong>Gemini 3.1 Intelligence:</strong> The system uses Google's latest Gemini 3.1 Flash-Lite model to generate grounded, accurate answers.</li>
              <li><strong>Verified Sources:</strong> Every answer includes a "SOURCE" quote directly from the ancient texts.</li>
              <li><strong>Persistent Sessions:</strong> Your conversations are archived and can be recalled at any time.</li>
            </ol>
          </section>

          <section className="about-section">
            <h2>Technology Stack</h2>
            <ul className="about-tech">
              <li><strong>AI Core:</strong> Google Gemini 3.1 Flash via Gen AI SDK</li>
              <li><strong>Backend:</strong> Node.js + Express with Automated RAG Pipeline</li>
              <li><strong>Frontend:</strong> React + Vite with Contextual State Management</li>
              <li><strong>Voice Suite:</strong> Web Speech API (STT) + Browser Speech Synthesis (TTS)</li>
              <li><strong>Performance:</strong> Keyword-based semantic chunking for zero-latency retrieval</li>
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
            Start Consultation →
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
