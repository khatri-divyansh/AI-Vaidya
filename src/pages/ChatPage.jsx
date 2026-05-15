import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import Footer from "../components/Footer";
import { useChatContext } from "../context/ChatContext";

export default function ChatPage() {
  const { sidebarOpen } = useChatContext();

  return (
    <div className="page-layout">
      <Navbar />
      <div className={`app-body ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        {sidebarOpen && <Sidebar />}
        <ChatWindow />
      </div>
      <Footer />
    </div>
  );
}
