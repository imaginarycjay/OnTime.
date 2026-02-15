# KHNS OnTime - Quiz System Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install main app dependencies
npm install

# Install server dependencies
cd gemini-server
npm install
cd ..
```

### 2. Set Up Environment Variables

Create a `.env` file in the `gemini-server/` directory:

```bash
cd gemini-server
cp .env.example .env
```

Edit `gemini-server/.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Get your API key:** https://makersuite.google.com/app/apikey

### 3. Run the Application

You need to run **TWO** processes:

**Terminal 1 - API Server:**
```bash
cd gemini-server
npm run dev
```
Server runs on `http://localhost:3001`

**Terminal 2 - Main App:**
```bash
npm run dev
```
App runs on `http://localhost:5173`

---

## 📚 Features

### ✅ Completed Features

1. **Offline Database (sql.js)**
   - Browser-based SQLite database
   - Automatic migration from localStorage
   - No installation required
   - Data persists in localStorage as backup

2. **Quiz System**
   - 10 AI-generated multiple-choice questions per study pack
   - Limited to 3 attempts per quiz
   - Immediate feedback with hints for wrong answers
   - Answers shown only after quiz completion
   - Progress tracking and scoring

3. **Online/Offline Detection**
   - Real-time network status indicator in navigation
   - Offline mode disables study pack generation
   - Quiz-taking works offline for already-generated packs
   - Clear error messages for network issues

4. **Secure AI Integration**
   - Gemini API calls moved to server-side
   - API key protected (not exposed to browser)
   - Rate limiting (10 requests/minute per IP)
   - Comprehensive error handling

5. **Improved UX**
   - Collapsible study pack sections
   - Quiz count badge
   - Regenerate study pack option
   - Loading states and skeletons
   - Quiz attempts counter

---

## 🗂️ Project Structure

```
khns-pomodoro-proj/
├── gemini-server/              # AI API Server (Node.js/Express)
│   ├── server.js              # Main server file
│   ├── routes/
│   │   └── studyPack.js       # Study pack generation endpoint
│   ├── middleware/
│   │   ├── rateLimiter.js     # Rate limiting middleware
│   │   └── errorHandler.js    # Error handling middleware
│   ├── utils/
│   │   └── geminiClient.js    # Gemini API client
│   ├── package.json
│   └── .env                   # API keys (DO NOT COMMIT)
│
├── src/
│   ├── services/
│   │   ├── database.js        # sql.js database service
│   │   └── studyApi.js        # API client for server
│   ├── quiz.jsx               # Quiz modal component
│   ├── quiz.css               # Quiz styling
│   ├── tasks.jsx              # Task list with quiz button
│   ├── modal.jsx              # Task creation modal
│   ├── app.jsx                # Main app with DB init
│   ├── nav.jsx                # Navigation with offline indicator
│   └── content.jsx            # Main content area
│
├── package.json
├── .gitignore
└── README.md
```

---

## 🎮 Usage Guide

### Creating a Study Task

1. Click **"Add Task +"**
2. Select **"Study Mode"**
3. Enter task name, subject, and specific topic
4. Click **"Generate Study Pack"**
   - Requires internet connection
   - Takes 5-15 seconds
   - Generates subtopics, notes, and 10 quiz questions
5. Review generated content (collapsible sections)
6. Click **"Add"** to save

### Taking a Quiz

1. Find a study mode task in your task list
2. Click the **quiz icon** (purple book icon)
3. Answer 10 multiple-choice questions
4. Get immediate feedback:
   - ✅ Correct answer → Move to next question
   - ❌ Wrong answer → See hint, then continue
5. View results after completion:
   - Score percentage
   - Correct/total answers
   - Full answer review
6. Retry up to 3 times total

### Quiz Attempts

- **Maximum:** 3 attempts per quiz
- **Badge:** Shows attempts used (e.g., "2/3")
- **Disabled:** After 3 attempts, quiz button is grayed out
- **Reset:** Delete and recreate task to reset attempts

### Offline Mode

**What Works:**
- Pomodoro timer
- Task management
- Taking quizzes (already generated)
- Viewing analytics

**What Doesn't Work:**
- Generating new study packs
- Regenerating existing packs

**Indicator:** Red WiFi icon with "Offline" text in navigation

---

## 🗄️ Database Schema

### Tables

**tasks**
- `id`: Primary key
- `name`: Task name
- `pomo_total`: Total pomodoros
- `pomo_done`: Completed pomodoros
- `mode`: 'standard' or 'study'
- `subject`: Study subject
- `specific_topic`: Topic for generation
- `subtopics`: JSON array
- `study_notes`: JSON array
- `quizzes`: JSON array with questions
- `created_at`, `updated_at`: Timestamps

**quiz_results**
- `id`: Primary key
- `task_id`: Foreign key to tasks
- `subject`, `topic`: For analytics
- `total_questions`: Always 10
- `correct_answers`: Score
- `score`: Percentage (0-100)
- `attempt_number`: 1-3
- `answers_data`: JSON with user answers
- `completed_at`: Timestamp

**sessions**
- Pomodoro session history
- Migrated from localStorage

**stats**
- Global statistics
- Single row (id=1)

---

## 🔧 Configuration

### Environment Variables

**gemini-server/.env:**
```env
GEMINI_API_KEY=your_key_here
PORT=3001                    # Optional (default: 3001)
CLIENT_URL=http://localhost:5173  # Optional (CORS)
```

**Client (optional):**
Create `.env` in project root:
```env
VITE_API_URL=http://localhost:3001
```

### Rate Limiting

Default: 10 requests/minute per IP

Edit `gemini-server/middleware/rateLimiter.js`:
```javascript
const maxRequests = 10;      // Change limit
const windowMs = 60 * 1000;  // Change window (ms)
```

---

## 🐛 Troubleshooting

### "Failed to generate study pack"

**Check:**
1. Server is running (`cd gemini-server && npm run dev`)
2. `.env` file exists with valid `GEMINI_API_KEY`
3. Internet connection active
4. Console for specific error message

### "No internet connection"

- Check offline indicator in navigation
- Server must be accessible (test: http://localhost:3001/health)
- Try restarting server

### Quiz button grayed out

- You've used all 3 attempts
- Delete task and recreate to reset
- Or wait for future retry reset feature

### Database not loading

- Clear browser cache and reload
- Check browser console for errors
- sql.js loads from CDN - requires internet on first load

---

## 📊 API Endpoints

### Server Endpoints

**POST /api/generate-study-pack**
```json
// Request
{
  "subject": "Mathematics",
  "specificTopic": "Pythagorean Theorem"
}

// Response
{
  "success": true,
  "data": {
    "subtopics": ["...", "..."],
    "studyNotes": ["...", "..."],
    "quizzes": [
      {
        "question": "...",
        "options": ["A", "B", "C", "D"],
        "answer": "A",
        "hint": "..."
      }
      // ... 9 more
    ]
  }
}
```

**GET /health**
- Health check endpoint
- Returns: `{"status": "ok", "timestamp": "..."}`

---

## 🎨 Customization

### Quiz Attempt Limit

Edit `src/quiz.jsx`:
```javascript
const MAX_ATTEMPTS = 3;  // Change to desired limit
```

### Quiz Question Count

Edit `gemini-server/utils/geminiClient.js`:
```javascript
// In prompt:
"... (generate exactly 10 quiz questions)"  // Change 10
```

Also update validation in same file.

### Color Scheme

Quiz uses purple accent (`#a78bfa`). To change:
- Edit `src/quiz.css` (search for `#a78bfa`)
- Update `src/index.css` for quiz button colors

---

## 🔐 Security Notes

1. **Never commit `.env` files**
   - Already in `.gitignore`
   - Use `.env.example` for templates

2. **API Key Protection**
   - Keys stored server-side only
   - Not accessible from browser
   - Rate limiting prevents abuse

3. **Production Deployment**
   - Use environment variables on hosting platform
   - Enable HTTPS
   - Set strict CORS origins
   - Consider adding authentication

---

## 📝 Development Workflow

### Adding Features

1. Database changes: Edit `src/services/database.js`
2. API changes: Edit `gemini-server/routes/` or `utils/`
3. UI changes: Edit React components in `src/`
4. Restart server if backend changed
5. Hot reload for frontend changes

### Testing Offline Mode

1. Open browser DevTools
2. Network tab → "No throttling" → "Offline"
3. Observe offline indicator appears
4. Try generating study pack (should fail gracefully)
5. Try taking quiz (should work)

---

## 🚀 Next Steps

### Future Enhancements

1. **Analytics Integration** (Next task)
   - Quiz performance charts
   - Subject-wise breakdown
   - Progress tracking

2. **Advanced Features**
   - Export quiz results
   - Flashcard mode
   - Spaced repetition
   - Custom quiz creation
   - Multi-device sync (cloud)

3. **Quiz Improvements**
   - Unlimited attempts mode
   - Timed quizzes
   - Difficulty levels
   - Explanation mode

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review console errors
3. Verify environment setup
4. Check server logs

---

**Version:** 2.0.0  
**Last Updated:** 2026-02-15
**Status:** Production Ready ✅
