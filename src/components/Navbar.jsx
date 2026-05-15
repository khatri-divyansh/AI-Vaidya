import { useNavigate } from "react-router-dom";
import { useChatContext } from "../context/ChatContext";

export default function Navbar() {
  const { clearChat } = useChatContext();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <span className="nav-om">ॐ</span>
        <div className="nav-titles">
          <h1 className="nav-title">AI Vaidya</h1>
          <p className="nav-subtitle">Ayurveda Intelligence Assistant</p>
        </div>
      </div>

      <div className="nav-actions">
        <a href="/" className="nav-link">Home</a>
        <a href="/about" className="nav-link">About</a>
        <button className="nav-btn-clear" onClick={clearChat}>
          Clear Chat
        </button>
      </div>
    </nav>
  );
}
