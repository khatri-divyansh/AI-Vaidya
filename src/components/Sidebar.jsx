import { useChatContext } from "../context/ChatContext";

export default function Sidebar() {
  const { sidebarOpen, clearChat, messages, sessions, loadSession, deleteSession } = useChatContext();

  if (!sidebarOpen) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={clearChat}>
          <span>+</span> New Consultation
        </button>
      </div>

      <div className="sidebar-history">
        <h4 className="history-label">Past Consultations</h4>
        <div className="history-list">
          {/* Active Chat */}
          {messages.length > 0 && (
            <div className="history-item active">
              <span className="history-icon">💬</span>
              <span className="history-text">
                Current: {messages[0].content.substring(0, 20)}...
              </span>
            </div>
          )}

          {/* Saved Sessions */}
          {sessions.map((session) => (
            <div key={session.id} className="history-item-container">
              <div 
                className="history-item" 
                onClick={() => loadSession(session)}
              >
                <span className="history-icon">📜</span>
                <span className="history-text">{session.title}...</span>
              </div>
              <button 
                className="delete-session-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(session.id);
                }}
                title="Delete Consultation"
              >
                ×
              </button>
            </div>
          ))}

          {messages.length === 0 && sessions.length === 0 && (
            <p className="no-history">No consultations yet</p>
          )}
        </div>
      </div>

      <div className="sidebar-footer">
        <span className="char-count">Vaidya AI v1.0</span>
      </div>
    </aside>
  );
}
