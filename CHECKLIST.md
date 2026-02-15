# ✅ Setup Verification Checklist

Use this checklist to verify your quiz system is properly configured.

## 📦 Installation

- [ ] Main dependencies installed (`npm install` in root)
- [ ] Server dependencies installed (`cd gemini-server && npm install`)
- [ ] No error messages during installation

## 🔑 Environment Configuration

- [ ] `gemini-server/.env` file exists
- [ ] `GEMINI_API_KEY` is set in `.env`
- [ ] API key is valid (get from https://makersuite.google.com/app/apikey)
- [ ] `.env` file is in `.gitignore` (security check)

## 🖥️ Server Startup

### API Server (Terminal 1)
- [ ] `cd gemini-server && npm run dev` runs without errors
- [ ] See message: "🚀 Gemini AI Server running on http://localhost:3001"
- [ ] No "API key not found" warnings
- [ ] Health check works: http://localhost:3001/health returns `{"status":"ok"}`

### Main App (Terminal 2)
- [ ] `npm run dev` runs without errors
- [ ] See message with URL: http://localhost:5173
- [ ] Browser opens automatically or manually open the URL

## 🌐 Browser Checks

### Initial Load
- [ ] App loads without errors
- [ ] See "KHNS OnTime" title
- [ ] Timer shows "25:00"
- [ ] "Add Task +" button visible
- [ ] No red error messages in browser console (F12)

### Online/Offline Indicator
- [ ] **Online:** No red WiFi icon visible
- [ ] **Test Offline:** 
  - [ ] Open DevTools (F12) → Network tab
  - [ ] Select "Offline" from throttling dropdown
  - [ ] Red WiFi icon appears with "Offline" text
  - [ ] Back to "No throttling" - icon disappears

## 📚 Study Mode Features

### Create Study Task
- [ ] Click "Add Task +"
- [ ] Modal opens
- [ ] See "Task Mode" radio buttons (Standard/Study)
- [ ] Select "Study Mode"
- [ ] Enter task name (e.g., "Test Task")
- [ ] Enter subject (e.g., "Science")
- [ ] Enter specific topic (e.g., "Photosynthesis")
- [ ] Click "Generate Study Pack"
- [ ] Button shows "Generating..."
- [ ] After 5-15 seconds, content appears:
  - [ ] Subtopics section (collapsible ▶)
  - [ ] Study Notes section (collapsible ▶)
  - [ ] Green badge: "✓ 10 Quiz Questions Ready"
- [ ] Click "Add" button
- [ ] Task appears in list with 📚 icon

### Error Handling
- [ ] **With internet:** Generation works
- [ ] **Without internet (DevTools Offline):**
  - [ ] "Generate Study Pack" button shows "Offline - Cannot Generate"
  - [ ] Button is disabled (grayed out)
  - [ ] Error message: "No internet connection..."

### Regenerate Feature
- [ ] After generating once, see "🔄 Regenerate Study Pack" button
- [ ] Click regenerate
- [ ] New content loads
- [ ] Quiz count updates

## 🎯 Quiz System

### Quiz Button Appearance
- [ ] Study task shows purple quiz icon (📚)
- [ ] Hover shows purple glow effect
- [ ] No badge initially (first attempt)

### Taking Quiz
- [ ] Click quiz icon
- [ ] Modal opens with:
  - [ ] Task name and subject at top
  - [ ] Progress bar (Question 1 of 10)
  - [ ] Question text
  - [ ] Four options (A, B, C, D)
- [ ] Click an option
- [ ] Option is selected (highlighted)
- [ ] Correct answer shows green checkmark
- [ ] Wrong answer shows:
  - [ ] Red cross mark
  - [ ] Yellow hint box appears with 💡 icon
- [ ] Click "Next Question"
- [ ] Progress bar updates
- [ ] Answer 10 questions
- [ ] Last question shows "Finish Quiz" button

### Quiz Results
- [ ] Results screen appears:
  - [ ] Large score percentage (colored green if ≥70%, red if <70%)
  - [ ] "🎉 Great job!" or "📚 Keep studying!" message
  - [ ] Correct answers count (e.g., "7 / 10")
  - [ ] Attempts used (e.g., "1 / 3")
- [ ] "Review Your Answers" section shows:
  - [ ] All 10 questions
  - [ ] Your answer
  - [ ] Correct answer (if you got it wrong)
  - [ ] Green/red color coding
- [ ] "Retake Quiz" button visible (if attempts < 3)
- [ ] Click "Close" to exit

### Attempt Tracking
- [ ] After first quiz: Badge shows "1/3"
- [ ] After second quiz: Badge shows "2/3"  
- [ ] After third quiz: Badge shows "3/3"
- [ ] After 3 attempts: Quiz button is disabled (gray, no cursor)
- [ ] Hover shows "No more attempts"

### Offline Quiz
- [ ] Generate study pack while online
- [ ] Switch to offline mode (DevTools)
- [ ] Quiz button still works!
- [ ] Can complete quiz offline
- [ ] Results save to database

## 💾 Database

### Persistence
- [ ] Create a task
- [ ] Refresh browser (Ctrl+R or F5)
- [ ] Task still appears in list
- [ ] Take quiz, get results
- [ ] Refresh browser
- [ ] Quiz attempts still tracked (badge shows same count)

### Database Console Check
```javascript
// Open browser console (F12), paste:
localStorage.getItem('ontime_database')
```
- [ ] Returns a long string (database data)
- [ ] If null, database not initialized

## 🎨 UI/UX

### Visual Elements
- [ ] Animations smooth (Framer Motion)
- [ ] Colors consistent (purple for quiz, red for errors)
- [ ] Icons render correctly (Material-UI)
- [ ] Mobile responsive (test by resizing browser)

### Collapsible Sections
- [ ] Click ▶ Subtopics → expands to ▼
- [ ] Content shows in textarea
- [ ] Click ▼ → collapses back to ▶
- [ ] Same for Study Notes section

## 🔧 Advanced Checks

### API Endpoints
```bash
# In terminal:
curl http://localhost:3001/health
```
- [ ] Returns: `{"status":"ok","timestamp":"..."}`

```bash
curl -X POST http://localhost:3001/api/generate-study-pack \
  -H "Content-Type: application/json" \
  -d '{"subject":"Math","specificTopic":"Algebra"}'
```
- [ ] Returns JSON with subtopics, studyNotes, quizzes

### Rate Limiting
- [ ] Make 10+ API calls rapidly
- [ ] 11th request returns 429 error
- [ ] Error message: "Too many requests..."
- [ ] Wait 1 minute → works again

### Browser Console
- [ ] Open DevTools (F12) → Console
- [ ] See "Database initialized successfully"
- [ ] See "Database ready"
- [ ] No red error messages

## 📊 Analytics (Partial)

- [ ] Click chart icon in navigation
- [ ] Analytics modal opens
- [ ] See "Study Performance" tab
- [ ] (Quiz charts pending - database ready)

## 🚨 Common Issues

If any check fails:

### ❌ API Server won't start
**Solution:**
1. Check `gemini-server/.env` exists
2. Verify `GEMINI_API_KEY` is set
3. Run: `cd gemini-server && npm install`

### ❌ "Failed to generate study pack"
**Solution:**
1. Check server is running (http://localhost:3001/health)
2. Verify internet connection
3. Check browser console for specific error
4. Check terminal logs for server errors

### ❌ Database not persisting
**Solution:**
1. Check browser console for errors
2. Ensure localStorage not disabled
3. Try: `localStorage.clear()` then refresh

### ❌ Quiz button not showing
**Solution:**
1. Verify task mode is "study"
2. Check quizzes were generated (✓ badge)
3. Inspect task object in console:
   ```javascript
   // In browser console:
   JSON.parse(localStorage.getItem('ontime_database'))
   ```

### ❌ Offline indicator not working
**Solution:**
1. Hard refresh: Ctrl+Shift+R
2. Clear cache and reload
3. Check network tab: set to "No throttling"

## ✅ Final Verification

**All checks passed?**
- [ ] Yes → System is ready! Start using quiz system
- [ ] No → Review failed checks and apply solutions

**Core Functionality Working:**
- [ ] Can create study tasks ✓
- [ ] Can generate study packs ✓
- [ ] Can take quizzes ✓
- [ ] Offline mode works ✓
- [ ] Data persists ✓
- [ ] Attempts tracked ✓

---

## 📞 Still Having Issues?

1. **Check documentation:**
   - QUICKSTART.md (basics)
   - SETUP.md (detailed guide)
   - IMPLEMENTATION.md (technical details)

2. **Review error messages:**
   - Browser console (F12 → Console)
   - Server terminal output

3. **Verify versions:**
   - Node.js 16+ (`node --version`)
   - npm 7+ (`npm --version`)

4. **Nuclear option (reset everything):**
   ```bash
   # Delete node_modules
   rm -rf node_modules gemini-server/node_modules
   
   # Reinstall
   npm install
   cd gemini-server && npm install && cd ..
   
   # Clear database
   # In browser console:
   localStorage.clear()
   
   # Restart
   ./start.sh
   ```

---

**Checklist Version:** 1.0  
**Last Updated:** February 15, 2026

🎉 Congratulations on setting up the quiz system!
