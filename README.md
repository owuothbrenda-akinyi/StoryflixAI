# storyflixAI — AI Video & TikTok Studio 🎬📱

Turn any idea or script into viral **9:16 vertical videos** and **animated cartoon episodes** for TikTok, Instagram Reels, and YouTube Shorts.

![storyflixAI](https://img.shields.io/badge/Gemini_3.8-Flash-7c3aed?style=for-the-badge&logo=google)
![React](https://img.shields.io/badge/React_19-Vite-61dafb?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS_v4-06b6d4?style=for-the-badge&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-ES2022-3178c6?style=for-the-badge&logo=typescript)

---

## 🌟 Highlights

- **Dual Creation Modes**:
  - 🔥 **Viral Shorts & Reels**: Retention-optimized for psychology facts, dark mysteries, scientific "What-If" scenarios, and motivation.
  - 🎨 **Cartoon Story Creator**: Character-driven animated episodes featuring expressive avatars (*Sir Reginald, Cyber Ninja Kai, Detective Barnaby, Byte the Bot*) with emotions and comic speech bubbles.
- **Full-Stack Gemini AI Pipeline**:
  - **Script & Storyboard Generator** (`gemini-3.8-flash`): 3-second viral hooks, 3–6s scene pacing, camera movements, sound effect cues, and viral badges.
  - **AI Text-to-Speech** (`gemini-3.8-flash-lite-tts`): Persona voices (`Fenrir`, `Kore`, `Puck`, `Zephyr`, `Charon`) with web speech fallback.
  - **3-Second Hook Optimizer**: Generates 5 high-converting hook angles with predicted retention scores.
  - **Scene Visual Generator**: 9:16 vertical scene artwork generation & custom image upload support.
- **Interactive 9:16 Smartphone Player**:
  - Real-time Canvas video renderer with smooth camera motions (*Zoom In, Zoom Out, Pan Left/Right, Impact Screen Shake, Flash Cuts*).
  - **Hormozi & MrBeast Subtitles**: Word-by-word active scale bouncing captions (*Hormozi Yellow, Neon Beast, Cartoon Comic, Minimal Glass, Danger Red*) with emoji auto-injection.
  - **TikTok Safe Zone Guides**: Toggle overlay elements to ensure text is never covered by TikTok buttons.
  - Speed gauge (1x, 1.25x viral speed, 1.5x), scrubbing timeline, and fullscreen.
- **Procedural Audio Studio & Live Soundboard**:
  - Procedural viral SFX (*Vine Boom, Air Whoosh, 808 Sub Drop, Cash Register, Bell Chime, Vinyl Scratch, Alert Stinger*).
  - Procedural background music beats (*Phonk Drift 808, Lo-Fi Chill, Dark Suspense, Upbeat Funk, Cartoon Quirky*).
  - Clickable live soundboard pads.
- **Direct Video Export (`MediaRecorder`)**:
  - Records canvas stream + mixed stereo audio directly in-browser.
  - Exports 9:16 `.webm` video files ready for upload.
  - Exports `.srt` subtitle files.
  - 1-click TikTok caption & viral hashtag copy with confetti celebration!

---

## 🚀 Quickstart

### Prerequisites
- Node.js 20+
- A Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/your-username/storyflixAI.git
cd storyflixAI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root:
```env
GEMINI_API_KEY="your_gemini_api_key_here"
PORT=3000
```

### 4. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production
```bash
npm run build
npm start
```

---

## 🏗️ Project Architecture

```
storyflixAI/
├── server.ts                  # Express backend proxy for Gemini 3.8 & TTS
├── src/
│   ├── App.tsx                # Main studio application & layout
│   ├── components/
│   │   ├── Header.tsx         # Brand header, mode switcher, templates dropdown
│   │   ├── PhonePlayer.tsx    # 9:16 Smartphone canvas player & transport
│   │   ├── SceneTimeline.tsx  # Multi-scene timeline editor & batch TTS
│   │   ├── SceneInspector.tsx # Scene camera, SFX, text, and visual editor
│   │   ├── CaptionSettings.tsx# Hormozi subtitle styles, position, font size
│   │   ├── AudioSoundboard.tsx# Voice persona, BGM beats, live SFX pads
│   │   ├── CartoonStudio.tsx  # Cartoon avatars, dialogues, animation style
│   │   ├── ScriptGeneratorModal.tsx # Gemini AI storyboard generator
│   │   ├── HookOptimizerModal.tsx   # 3-Second viral hook optimizer
│   │   └── ExportModal.tsx    # Canvas MediaRecorder video & SRT exporter
│   ├── data/
│   │   └── presetTemplates.ts # Curated viral templates & character presets
│   ├── types/
│   │   └── studio.ts          # TypeScript interfaces & types
│   └── utils/
│       ├── audioEngine.ts     # Procedural Web Audio SFX & BGM synthesizer
│       ├── canvasRenderer.ts  # 9:16 Canvas rendering engine
│       └── videoExporter.ts   # Video stream recorder & SRT builder
├── index.html                 # HTML entry with custom typography
├── package.json               # Dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

---

## 📄 License
Apache-2.0
