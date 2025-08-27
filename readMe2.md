# 🎬 Nolan by Nexus

<p align="center">
  <img src="https://github.com/Ayush5091/pics/blob/main/nolan.png?raw=true" alt="Nolan by Nexus Preview" width="700"/>
</p>

**Try it live ➔ [Nolan by Nexus](https://nolan-by-nexus.vercel.app/)** – your AI-powered screenwriting companion.

Nolan by Nexus is an AI-powered screenwriting assistant that helps writers generate, analyze, and improve scripts. It features two powerful modules — Writer and Critic — tailored to support every phase of the screenwriting process, from concept creation to in-depth critique.

## ✍️ Writer Module
The Writer Module is the core content generation engine of Nolan by Nexus, designed to empower users to craft cinematic-quality screenplays using AI. This module provides:

- 🎞️ Scene-by-Scene Generation – Generate each scene individually for full creative control.
- 📝 Editable Scene Blocks – Inline editing for every scene with real-time updates.
- 🎭 Genre Selector – Choose tones like Action, Comedy, Mystery, and more to influence AI outputs.
- 📄 PDF Export – Export professionally formatted screenplays using jsPDF.
- 🧠 Format-Adaptive Prompts – The AI automatically aligns tone and structure to the selected format.

### 🎬 Supported Screenplay Modes
- **Cinematic**: Hollywood-style formatting for short films. Structured, emotionally paced.
- **BBC-Style**: Interview or documentary dialogue style with realistic pacing.
- **Short-Form**: Snappy, engaging content for Reels, Instagram, or TikTok.

### ⚙️ Technical Architecture
**Core Component:** `WriterPage (page.tsx)`
- Handles genre selection, scene entry, edits, AI generation, PDF export, and state handling.

**AI Integration Stack:**
- `screenplay-generator.ts`: Prepares Gemini prompt based on format and theme.
- `gemini-service.ts`: Calls Google Gemini 1.5 Flash API.
- `screenplay-service.ts`: Defines types like Scene and Screenplay.

**Output & Export:**
- `screenplay-pdf-service.ts`: Generates screenplay PDF using jsPDF.
- `pdf-service.ts`: Applies theme-specific styles and fonts.
- `file-saver`: Handles file download in browser.

### ↻ User Journey Flow
1. User visits WriterPage
2. Selects format & genre
3. Inputs prompt or context
4. WriterPage sends request → `screenplay-generator.ts` → `gemini-service.ts`
5. Gemini 1.5 Flash returns content
6. Scene is displayed as an editable block
7. User repeats generation OR edits scene manually
8. Exports screenplay as PDF

### System Architecture Diagram
```
/writer-module
- page.tsx (WriterPage) → UI Controller
  - GenreTag (Genre Chips)
  - Scene Editor
  - PDF Export Button
  - FilmRollLoader (Loader UI)
- screenplay-generator.ts → Format prompt builder → Calls `gemini-service.ts`
- gemini-service.ts → Google Gemini 1.5 Flash API (Content Generation)
- screenplay-service.ts → Scene/Screenplay Typing + Structuring
- screenplay-pdf-service.ts → Cinematic PDF Output via jsPDF
- pdf-service.ts → Theme-aware PDF styling
```

## Gemini 1.5 Flash – Integration Logic
**Endpoint:**  
`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`

**Config:**
```bash
generationConfig: {
 temperature: 0.4,
 topK: 32,
 topP: 0.95,
 maxOutputTokens: 4096,
}
```

**Prompt Formats:**
- theme === "cinematic": Format the response as a professional short film screenplay with visual cues.
- theme === "bbc": Format the content as a BBC interview or realistic conversation.
- theme === "shortform": Generate fast-paced, engaging visual short-form screenplay for reels.

**Example API Call to Gemini:**
```ts
const response = await fetch(GEMINI_API_URL, {
 method: "POST",
 headers: {
   "Content-Type": "application/json",
   Authorization: `Bearer ${API_KEY}`,
 },
 body: JSON.stringify({
   contents: [{ parts: [{ text: finalPrompt }] }],
   generationConfig,
 }),
});
```

### ✨ Impact & Vision
- Transforms the screenwriting experience from intimidating blank pages to a collaborative AI creative partner.
- Empowers screenwriters, students, and influencers to visualize stories instantly.
- Lays foundation for future additions: AI shot suggestions, voiceovers, multi-user collaboration, director style presets.

---

## 🧐 Critic Module
The Critic Module in Nolan by Nexus is designed to evaluate user-submitted screenplays using advanced AI analysis. It offers director-level feedback across cinematic parameters with a grading system mimicking iconic directors like Christopher Nolan and Denis Villeneuve.

### 🔧 Key Features
- 📂 Upload & Analyze – Users upload a screenplay (PDF/TXT), which is parsed and passed to the AI for review.
- 📊 Category-Based Breakdown – Scores for structure, tone, dialogue realism, character depth, cinematic pacing, and originality.
- ⚡ Real-Time AI Feedback – Detailed suggestions and numerical scores.
- 🎬 Director Modes (Coming Soon) – Optional toggle to analyze based on famous directors' styles.

### 🔹 Critique Parameters
- **Structure**: Analyzes three-act flow and scene composition.
- **Tone**: Evaluates emotional consistency and genre coherence.
- **Dialogue Realism**: Assesses naturalness and impact of conversations.
- **Character Depth**: Grades psychological realism and growth.
- **Cinematic Vision**: Checks for visual cues, pacing, and immersive narration.
- **Originality**: Detects overused tropes, clichés, and creative risks.

### ⚙️ Technical Architecture
**Core Component:** `CriticPage (page.tsx)`
- Handles file uploads, parsing, AI integration, and result rendering.

**AI Integration Stack:** `gemini-service.ts`
- `validateScreenplayFile()`
- `parseScreenplayFile()`
- `analyzeScreenplay()`
- `parseAnalysisResponse()`

**Output Components:**
- `AnalysisResultCard.tsx`: Displays category-wise critique.
- `GlassCard.tsx`: Styled wrapper UI.
- `FloatingPaths.tsx`: Visual background.
- `FadeInText.tsx`: Animated text reveal.
- `SimpleFilmRollLoader.tsx`: Loading feedback.

### ↻ User Journey Flow
1. User visits Critic Module page
2. Uploads screenplay file (.pdf, .fdx, .txt)
3. File is validated → parsed → text extracted
4. Text is sent to Gemini API for critique
5. Gemini returns a full category-based analysis
6. Results are rendered into summary, insights, and cards
7. User can download or share feedback report (Coming Soon)

### System Architecture Diagram
```
/critic-module
- page.tsx (CriticPage) → UI Controller
  - File Upload & Validation
  - Scene Parsing
  - Analysis Loader
  - Results UI
- gemini-service.ts → Analysis Engine (API + Parsers)
  - validateScreenplayFile()
  - parseScreenplayFile()
  - analyzeScreenplay()
  - parseAnalysisResponse()
- components/
  - AnalysisResultCard.tsx
  - GlassCard.tsx
  - FloatingPaths.tsx
  - FadeInText.tsx 
```

### Gemini 1.5 Flash – Integration Logic
**Endpoint:**  
`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`

**Prompt Example:**  
"Analyze the following screenplay in terms of structure, character development, tone, cinematic vision, originality, and dialogue realism. Provide scores and suggestions for each category."

**Config:**
```bash
generationConfig: {
 temperature: 0.3,
 topK: 40,
 topP: 0.9,
 maxOutputTokens: 3072,
}
```

**Example API Call:**
```ts
const response = await fetch(GEMINI_API_URL, {
 method: "POST",
 headers: {
   "Content-Type": "application/json",
   Authorization: `Bearer ${API_KEY}`,
 },
 body: JSON.stringify({
   contents: [{ parts: [{ text: screenplayText }] }],
   generationConfig,
 }),
});
```

### ✨ Impact & Vision
- Eliminates generic or unhelpful peer reviews.
- Helps young screenwriters understand why a scene or dialogue works or fails.
- Acts as a script mentor, giving feedback instantly without bias.
- Sets the foundation for Director Mode (e.g., analyze like Tarantino, Nolan, etc.)

---

## 🛠️ Tech Stack

### Frontend
- React, Next.js, Tailwind CSS – Responsive UI and seamless routing
- Framer Motion – Smooth transitions and animations
- Dnd-Kit – Drag-and-drop functionality for scenes

### Backend & Logic
- Node.js – Backend logic and API handling
- Gemini 1.5 Flash API – Content generation and analysis
- Mammoth.js – DOCX parsing

### Utilities
- jsPDF, FileSaver.js – Professional PDF exports
- Lucide Icons – Iconography for UI

---

## 💪 Run Locally

**Clone the project**
```bash
git clone https://link-to-project
```

**Go to the project directory**
```bash
cd my-project
```

**Install dependencies**
```bash
npm install --legacy-peer-deps
```

**Start the server**
```bash
npm run dev
```
