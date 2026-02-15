# 🎯 KHNS OnTime - Pomodoro with AI-Powered Quiz System

A Pomodoro timer application with an integrated AI study system featuring quiz generation, offline support, and comprehensive analytics.

## ✨ Features

### 🍅 Pomodoro Timer
- 25-minute focus sessions
- Short breaks (5 min) and long breaks (15 min)
- Visual and audio notifications
- Task tracking and management

### 📚 Study Mode
- **AI-Generated Study Packs** powered by Google Gemini
  - 5-10 key subtopics
  - Study notes and hints
  - **10 multiple-choice quiz questions** per topic
- Offline quiz-taking for generated content
- 3 attempts per quiz with immediate feedback
- Answer review after completion

### 💾 Offline-First Architecture
- **sql.js** browser-based database
- Works completely offline after initial load
- Automatic data persistence
- No server dependency for core features

### 📊 Analytics
- Study session tracking
- Quiz performance monitoring (coming soon)
- Subject-wise progress breakdown
- Interactive charts (Recharts)

### 🌐 Smart Online/Offline Detection
- Real-time network status indicator
- Graceful degradation when offline
- Clear user feedback for unavailable features

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

```bash
# 1. Install dependencies
npm install
cd gemini-server && npm install && cd ..

# 2. Set up environment variables
cd gemini-server
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
cd ..

# 3. Start the application
./start.sh
```

Or manually:

**Terminal 1 - API Server:**
```bash
cd gemini-server
npm run dev
```

**Terminal 2 - Main App:**
```bash
npm run dev
```

The app will be available at:
- **Main App:** http://localhost:5173
- **API Server:** http://localhost:3001

---

## 📖 Usage

### Creating a Study Task

1. Click **"Add Task +"**
2. Select **"Study Mode"**
3. Enter task name, subject, and specific topic
4. Click **"Generate Study Pack"** (requires internet)
5. Review generated content (collapsible sections)
6. Click **"Add"** to save

### Taking a Quiz

1. Find a study task with the quiz icon
2. Click the **purple quiz button**
3. Answer 10 questions with immediate feedback
4. View results and retry up to 3 times

### Offline Mode

Works offline: Timer, task management, quizzes (already generated)  
Requires internet: Generating new study packs

---

## 🗂️ Project Structure

```
khns-pomodoro-proj/
├── gemini-server/              # Express API server
│   ├── server.js
│   ├── routes/studyPack.js
│   ├── middleware/
│   └── utils/geminiClient.js
├── src/
│   ├── services/
│   │   ├── database.js        # sql.js database
│   │   └── studyApi.js
│   ├── quiz.jsx               # Quiz modal
│   ├── tasks.jsx
│   └── ...
└── start.sh                   # Start both servers
```

---

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Comprehensive setup and configuration guide

---

**Built with ❤️ by KHNS Team**  
**Version:** 2.0.0 | **Last Updated:** February 15, 2026

### Launch the web app using this link: [Visit OnTime. Pomodoro](https://ontime-pomodoro.vercel.app)
