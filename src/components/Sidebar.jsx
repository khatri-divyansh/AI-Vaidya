import { useChatContext } from "../context/ChatContext";

export default function Sidebar() {
  const { sidebarOpen } = useChatContext();

  if (!sidebarOpen) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-icon">📜</span>
        <span className="sidebar-label">Knowledge Base</span>
      </div>

      <div className="sidebar-info">
        <h3>Fundamentals of Ayurveda</h3>
        <p>
          AI Vaidya is trained on a comprehensive built-in database covering the core principles of Ayurvedic medicine, including:
        </p>
        <ul>
          <li>The Three Doshas (Vata, Pitta, Kapha)</li>
          <li>The Three Gunas (Sattva, Rajas, Tamas)</li>
          <li>Agni — Digestive Fire</li>
          <li>Medicinal Herbs (Turmeric, Tulsi, Ginger, Ashwagandha)</li>
          <li>Panchakarma (Therapeutic procedures)</li>
        </ul>
      </div>

      <div className="sidebar-footer">
        <span className="char-count">Built-in DB Active</span>
      </div>
    </aside>
  );
}
