import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-content">
        <div className="home-om">ॐ</div>
        <h1 className="home-title">AI Vaidya</h1>
        <p className="home-tagline">
          An Intelligent Q&A Assistant for Ayurveda Knowledge
        </p>
        <p className="home-desc">
          Ask questions in plain English. Every answer is grounded exclusively in
          our comprehensive built-in Ayurvedic database — no hallucinations, no internet.
        </p>

        <div className="home-features">
          {[
            { icon: "📚", title: "Built-in Library", desc: "Powered by a massive internal database of Ayurvedic scriptures" },
            { icon: "🔍", title: "Semantic Q&A", desc: "Ask natural language questions about the text" },
            { icon: "📜", title: "Source Citations", desc: "Every answer shows the reference passage" },
            { icon: "🎤", title: "Voice Input", desc: "Ask questions by speaking" },
          ].map((f) => (
            <div className="feature-card" key={f.title}>
              <span className="feature-icon">{f.icon}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>

        <button className="home-cta" onClick={() => navigate("/chat")}>
          Begin Consultation →
        </button>
      </div>
    </div>
  );
}
