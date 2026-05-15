import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatProvider } from "./context/ChatContext";
import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage";
import About from "./pages/About";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </ChatProvider>
    </BrowserRouter>
  );
}
