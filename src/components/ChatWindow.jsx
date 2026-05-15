import ChatHistory from "./ChatHistory";
import InputBox from "./InputBox";

export default function ChatWindow() {
  return (
    <div className="chat-window">
      <ChatHistory />
      <InputBox />
    </div>
  );
}
