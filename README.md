# 🧠 Learning Companion — Adaptive AI Tutor

**Learn anything, at your own pace, with an AI that actually teaches.**

Learning Companion is an intelligent, adaptive learning platform powered by Google Gemini AI. Unlike a generic chatbot, it behaves like a patient, brilliant tutor — assessing your level, breaking concepts into digestible chunks, checking your understanding, and adapting in real time.

---

## ✨ Key Features

### 🎯 Adaptive Teaching
The AI doesn't just answer questions — it **teaches**. It starts by asking what you already know, then calibrates its explanations to your level:
- **Beginners** get analogies, simple language, and real-world examples
- **Intermediate learners** get terminology and connections to existing knowledge
- **Advanced users** get depth, nuance, and critical thinking challenges

The AI continuously reassesses and adjusts as the conversation progresses.

### 📚 10 Curated Topic Paths
Jump right in with pre-built learning paths across a diverse range of subjects:

| Topic | Category |
|---|---|
| Quantum Computing | Computer Science |
| Machine Learning | Computer Science |
| Climate Change | Environmental Science |
| Human Brain | Neuroscience |
| Space Exploration | Astronomy |
| Genetics & DNA | Biology |
| World History | History |
| Philosophy | Humanities |
| Economics | Social Science |
| Art & Design | Creative Arts |

Each topic comes with curated metadata including prerequisites, key terms, suggested learning paths, related topics, and fun facts — all used to enrich the AI's teaching.

### 🧩 Interactive Quizzes
The AI embeds **interactive multiple-choice quizzes** directly in the conversation to check your comprehension. Click an answer to see instant feedback with explanations — no separate quiz page needed.

### 🎙️ Voice Input
Speak your questions and answers using the built-in **voice input** button (powered by Web Speech API). Great for hands-free learning or when you'd rather talk than type.

### 📊 Learning Dashboard
A 3-panel dashboard designed for focused learning:

- **Left Sidebar** — Track your session progress with a visual engagement ring, see extracted key concepts as tags, browse your topic history, and access quick actions (New Topic, Quiz Me, Summarize)
- **Center Chat** — The main conversational interface with the AI tutor, featuring rich markdown rendering, inline quizzes, and smooth animations
- **Right Reference Panel** — Automatically populated with Wikipedia summaries, recommended books, and related topics to explore next

### 🌐 Real-Time Knowledge Sources
Every conversation is enriched with live data from multiple sources:

| Source | What It Provides |
|---|---|
| **Wikipedia API** | Factual summaries and article thumbnails for the topic being discussed |
| **Open Library API** | Recommended books with cover images, matched to your learning topic |
| **Free Dictionary API** | Definitions for key terms highlighted during the conversation |
| **Curated Topic Database** | Pre-populated learning paths, prerequisites, key terms, and fun facts for 10 core subjects |

The AI synthesizes this data naturally into its teaching — it doesn't just dump facts, it weaves them into explanations.

### 🌓 Light & Dark Mode
Toggle between a clean light theme and a sleek dark theme. Your preference is saved automatically.

### 💡 Key Concept Extraction
As the AI teaches, it **bolds key terms** — these are automatically extracted and displayed as tags in the sidebar, building a visual map of concepts you've encountered.

### ⚡ Quick Actions
One-click shortcuts in the sidebar:
- **New Topic** — Start fresh with a new subject
- **Quiz Me** — Ask the AI to quiz you on everything covered so far
- **Summarize** — Get a concise recap of your learning session

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 20+**
- A **Google Gemini API key** ([Get one free](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/pragmatic-philosopher09/Learning-Companion-PromptWars.git
cd Learning-Companion-PromptWars

# Install dependencies
npm install

# Create your environment file
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## ☁️ Deploy to GCP Cloud Run

The app is fully containerized and ready for Cloud Run deployment.

```bash
# Authenticate with GCP
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com

# Deploy (builds remotely via Cloud Build)
gcloud run deploy learning-companion \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "GEMINI_API_KEY=your_api_key_here" \
  --memory 512Mi \
  --cpu 1 \
  --port 8080
```

Your app will be live at the URL provided by Cloud Run. To redeploy after changes, run the same `gcloud run deploy` command again.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **AI Model** | Google Gemini 2.5 Flash |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 + CSS custom properties |
| **Animations** | Framer Motion |
| **Markdown** | react-markdown + @tailwindcss/typography |
| **Icons** | Lucide React |
| **Deployment** | Docker + GCP Cloud Run |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout with Inter font + ThemeProvider
│   ├── page.tsx              # 3-column dashboard layout
│   ├── globals.css           # Theme variables, animations, scrollbar styles
│   └── api/chat/route.ts     # Chat API — enriches context from all data sources
│
├── components/
│   ├── ChatInterface.tsx     # Main chat with inline quizzes + voice input
│   ├── TopicCards.tsx        # Landing page topic suggestion grid
│   ├── Sidebar.tsx           # Progress ring, quick actions, key concepts
│   ├── ReferencePanel.tsx    # Wikipedia, books, related topics
│   └── InlineQuiz.tsx        # Interactive multiple-choice quiz cards
│
└── lib/
    ├── gemini.ts             # Gemini SDK wrapper with adaptive system prompt
    ├── wikipedia.ts          # Wikipedia API integration
    ├── openlibrary.ts        # Open Library API integration
    ├── dictionary.ts         # Free Dictionary API integration
    ├── topic-database.ts     # Pre-populated topic metadata (10 subjects)
    └── theme-context.tsx     # Light/dark theme state management
```

---

## 🎓 How It Teaches

The Learning Companion follows a structured pedagogical approach:

1. **Assess** — Asks 1–2 questions to gauge your existing knowledge
2. **Calibrate** — Adjusts language, depth, and examples to your level
3. **Chunk** — Breaks concepts into small, digestible pieces
4. **Check** — Pauses after each chunk to verify understanding (conversational questions or interactive quizzes)
5. **Adapt** — Speeds up if you're catching on, slows down and re-explains if you're confused
6. **Motivate** — Celebrates progress and normalizes confusion as part of learning

---

## 🛠️ Developer Guide

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                     │
│  ┌──────────┐  ┌───────────────────┐  ┌──────────────────┐  │
│  │ Sidebar  │  │  ChatInterface    │  │ ReferencePanel   │  │
│  │          │  │  ┌─────────────┐  │  │  - Wikipedia     │  │
│  │ Progress │  │  │ Messages    │  │  │  - Books         │  │
│  │ Actions  │  │  │ InlineQuiz  │  │  │  - Related Topics│  │
│  │ Concepts │  │  │ Voice Input │  │  │                  │  │
│  │ History  │  │  └─────────────┘  │  │                  │  │
│  └──────────┘  └────────┬──────────┘  └──────────────────┘  │
│                         │ POST /api/chat                     │
└─────────────────────────┼───────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                   Server (Next.js API)                       │
│                         │                                    │
│    ┌────────────────────▼────────────────────┐               │
│    │           /api/chat/route.ts            │               │
│    │                                         │               │
│    │  1. Parse topic from user message       │               │
│    │  2. Fetch enrichment data (parallel):   │               │
│    │     ├── topic-database.ts (instant)     │               │
│    │     ├── wikipedia.ts (HTTP)             │               │
│    │     └── openlibrary.ts (HTTP)           │               │
│    │  3. Inject context into system prompt   │               │
│    │  4. Call Gemini API with history        │               │
│    │  5. Return reply + metadata             │               │
│    └─────────────────────────────────────────┘               │
│                                                              │
│    External APIs:                                            │
│    ├── Google Gemini 2.5 Flash                               │
│    ├── Wikipedia REST API (en.wikipedia.org)                 │
│    ├── Open Library Search API (openlibrary.org)             │
│    └── Free Dictionary API (dictionaryapi.dev)               │
└──────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User sends a message** → `ChatInterface` sends a `POST /api/chat` with the full conversation history and detected topic
2. **API route enriches context** — fetches Wikipedia summary, book recommendations, and topic database metadata **in parallel** using `Promise.all`
3. **Enrichment is injected into the system prompt** as a `BACKGROUND CONTEXT` block, instructing the AI to synthesize it naturally
4. **Gemini generates a response** with the full conversation history + enriched context
5. **API returns** the AI reply plus structured metadata (`wikiData`, `books`, `relatedTopics`, `topicMeta`)
6. **Client renders** the reply with markdown, extracts bold terms as key concepts, and populates the sidebar + reference panel

### Key Design Decisions

| Decision | Rationale |
|---|---|
| **Enrichment on server, not client** | Keeps API keys secure, allows parallel fetching, and enriches the AI context before generation |
| **Pre-populated topic database** | Provides instant, curated metadata (learning paths, prerequisites) without API latency. The AI uses this to give structured, curriculum-like guidance |
| **Inline quiz format via markdown** | AI outputs quizzes in a `` ```quiz `` code block with JSON — the frontend parses and renders interactive cards. No separate quiz API needed |
| **Bold term extraction** | The system prompt instructs the AI to **bold** key terms. The client regex-extracts these to build a concept map in the sidebar |
| **Lazy Gemini SDK init** | `GoogleGenAI` is instantiated on first API call (not module load) to avoid build-time errors when `GEMINI_API_KEY` isn't available |
| **Retry with backoff** | The free Gemini tier has a 5 req/min limit. The SDK retries up to 3 times with exponential backoff (10s, 20s, 40s) on 429 errors |
| **`100dvh` layout** | Uses dynamic viewport height units to prevent mobile browser chrome from causing layout overflow |

### System Prompt Engineering

The AI's behavior is controlled by a detailed system prompt in `src/lib/gemini.ts`. Key sections:

- **CORE BEHAVIOR** — 6 rules covering assessment, personalization, chunking, comprehension checks, pacing, and motivation
- **INTERACTIVE QUIZZES** — Exact JSON format the AI should use for quiz blocks
- **RESPONSE STYLE** — Concise, friendly, bold key terms, suggest next steps
- **CONSTRAINTS** — No lecturing unprompted, always check comprehension, never be condescending

The enrichment context (Wikipedia, topic DB) is appended as a `BACKGROUND CONTEXT` block with the instruction: *"Use this to inform your teaching, but synthesize it naturally — do not copy verbatim."*

### Environment Configuration

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ | Google Gemini API key. Get one at [AI Studio](https://aistudio.google.com/apikey) |

The key is read from `.env.local` (local dev) or Cloud Run environment variables (production).

### Adding a New Topic

To add a new curated topic to the landing page and knowledge base:

1. **Add metadata** in `src/lib/topic-database.ts`:
```typescript
{
  name: 'Your Topic',
  slug: 'your-topic',
  category: 'Category',
  difficulty: 'beginner',  // beginner | intermediate | advanced
  prerequisites: ['Prerequisite 1'],
  keyTerms: ['Term 1', 'Term 2'],
  learningPath: ['Step 1', 'Step 2', 'Step 3'],
  relatedTopics: ['Related 1', 'Related 2'],
  funFact: 'An interesting fact about this topic.',
  description: 'A brief description of the topic.',
}
```

2. **Add a card** in `src/components/TopicCards.tsx` — add an entry to the topics array with a name, tagline, icon, and gradient color.

That's it — the API route and AI will automatically use the new topic's metadata for enriched teaching.

### Adding a New Data Source

To integrate a new external API:

1. Create a new fetch utility in `src/lib/` (follow the pattern in `wikipedia.ts` or `openlibrary.ts`)
2. Call it in `src/app/api/chat/route.ts` inside the `Promise.all` block
3. Append the result to `enrichmentParts` so it's injected into the AI's context
4. Optionally return structured data to the client for the reference panel

### API Route Reference

#### `POST /api/chat`

**Request body:**
```json
{
  "messages": [
    { "role": "user", "parts": [{ "text": "I want to learn about quantum computing" }] },
    { "role": "model", "parts": [{ "text": "Great choice! ..." }] }
  ],
  "topic": "quantum computing"
}
```

**Response:**
```json
{
  "reply": "The AI's markdown response...",
  "wikiData": { "title": "...", "extract": "...", "url": "...", "thumbnail": "..." },
  "books": [{ "title": "...", "author": "...", "coverUrl": "..." }],
  "relatedTopics": ["Topic A", "Topic B"],
  "topicMeta": { "name": "...", "category": "...", "difficulty": "...", "learningPath": [...] }
}
```

### Docker & Production Notes

- **Multi-stage Dockerfile** — `deps` → `builder` → `runner` stages for minimal image size (~150MB)
- **Standalone output** — `next.config.ts` uses `output: "standalone"` to generate a self-contained server
- **Port 8080** — Cloud Run's default; configured in the Dockerfile via `ENV PORT=8080`
- **Non-root user** — Production container runs as `nextjs:nodejs` (UID 1001) for security
- **Redeployment** — Same `gcloud run deploy --source .` command rebuilds and deploys. Zero downtime with automatic revision traffic shifting.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
