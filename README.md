# AI Vaidya 🪷

**An Intelligent Q&A Assistant for Ayurveda Knowledge**  
*BMS Institute of Technology & Management — AI Fusion Hackathon, Problem Statement 2*

---

## Overview

AI Vaidya is a domain-specific Retrieval-Augmented Generation (RAG) system that lets users upload any Ayurvedic PDF or text and ask questions in natural English. Every answer is grounded **exclusively** in the uploaded knowledge base — no hallucinations, no internet.

## Features

- 📄 **PDF Upload** — Client-side text extraction using pdf.js (no server needed)
- ✍️ **Text Paste** — Directly paste Ayurvedic text into the knowledge base
- 🔍 **Semantic Q&A** — Context-window RAG via Claude API
- 📜 **Source Citations** — Every answer shows the reference passage from your text
- 🎤 **Voice Input** — Ask questions by speaking (Web Speech API)
- 🏠 **Multi-page App** — Home, Chat, and About pages with React Router

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| AI Model | Claude Sonnet 4 (Anthropic API) |
| PDF Parsing | pdf.js 3.x (CDN, client-side) |
| Voice Input | Web Speech API |
| Styling | Custom CSS (parchment/Ayurveda aesthetic) |

## Setup & Run

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd ai-vaidya

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open http://localhost:5173
```

> **Note:** The Anthropic API key is handled by the claude.ai artifact environment.  
> For standalone deployment, add your key to a `.env` file:
> ```
> VITE_ANTHROPIC_API_KEY=sk-ant-...
> ```
> Then update `src/hooks/useChat.js` to use `import.meta.env.VITE_ANTHROPIC_API_KEY`.

## How to Use

1. Go to `/chat`
2. Upload an Ayurvedic PDF (e.g., from National Institute of Ayurveda) or click **Load Sample Text**
3. Ask a question like:
   - *"What are the three doshas?"*
   - *"How does turmeric help in wound healing?"*
   - *"What is Panchakarma?"*
4. The AI answers only from your uploaded text, with a source reference shown below each answer.

## Project Structure

```
src/
  components/
    ChatHistory.jsx       # Message list with auto-scroll
    ChatMessage.jsx       # Individual message bubble
    ChatWindow.jsx        # Chat area container
    FileUpload.jsx        # PDF drag-and-drop + extraction
    Footer.jsx
    InputBox.jsx          # Text input + voice + send
    Loader.jsx            # Animated thinking indicator
    Navbar.jsx
    PDFPreview.jsx        # Shows extracted PDF snippet
    Sidebar.jsx           # Knowledge base panel
    SourceCard.jsx        # Reference passage display
    SuggestedQuestions.jsx
    VoiceInput.jsx        # Web Speech API integration
  context/
    ChatContext.jsx       # Global state
  hooks/
    useChat.js            # Anthropic API call + RAG prompt
  pages/
    Home.jsx
    ChatPage.jsx
    About.jsx
  App.jsx
  main.jsx
  index.css
```

## License

MIT License — open source, free to use and modify.
