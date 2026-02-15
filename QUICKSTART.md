# Quick Reference Guide

## 🚀 Start Commands

```bash
# One-command start (recommended)
./start.sh

# Or manually in 2 terminals:
# Terminal 1:
cd gemini-server && npm run dev

# Terminal 2:
npm run dev
```

## 🔑 Environment Setup

```bash
# 1. Copy template
cd gemini-server
cp .env.example .env

# 2. Edit .env file
nano .env  # or your preferred editor

# 3. Add your key
GEMINI_API_KEY=your_key_here
```

Get API key: https://makersuite.google.com/app/apikey

## 📱 Using the App

### Create Study Task
1. Click "Add Task +"
2. Select "Study Mode"
3. Enter: Name, Subject, Topic
4. Click "Generate Study Pack"
5. Click "Add"

### Take Quiz
1. Click purple quiz icon on task
2. Answer 10 questions
3. View results
4. Retry (max 3 times)

## 🔧 Common Tasks

### Change Quiz Attempts
```javascript
// src/quiz.jsx line 12
const MAX_ATTEMPTS = 3;  // Change this
```

### Change Rate Limit
```javascript
// gemini-server/middleware/rateLimiter.js line 4-5
const maxRequests = 10;      // Change this
const windowMs = 60 * 1000;  // 1 minute
```

### Update Quiz Count
```javascript
// gemini-server/utils/geminiClient.js line 24
"... (generate exactly 10 quiz questions)"  // Change 10
```

## 🐛 Troubleshooting

### Server won't start
- Check `gemini-server/.env` exists
- Verify `GEMINI_API_KEY` is set
- Try: `cd gemini-server && npm install`

### "Failed to generate"
- Is server running? Check http://localhost:3001/health
- Is internet connected?
- Check browser console for errors

### Quiz button disabled
- You used 3 attempts
- Solution: Delete task, recreate

### Offline indicator stuck
- Check actual internet connection
- Refresh page (Ctrl+R)

## 📂 Important Files

| File | Purpose |
|------|---------|
| `gemini-server/.env` | API key (required) |
| `src/services/database.js` | Database operations |
| `src/quiz.jsx` | Quiz component |
| `gemini-server/server.js` | API server |
| `start.sh` | Start script |

## 🌐 URLs

- **App:** http://localhost:5173
- **API:** http://localhost:3001
- **Health:** http://localhost:3001/health

## 📊 Database Location

Browser localStorage key: `ontime_database`

To clear database:
```javascript
// In browser console:
localStorage.removeItem('ontime_database');
location.reload();
```

## 🔒 Security Checklist

- [x] `.env` in `.gitignore`
- [x] API key server-side only
- [x] Rate limiting enabled
- [x] CORS configured
- [ ] HTTPS (production only)
- [ ] Authentication (if deploying)

## 📚 Documentation

- **README.md** - Overview
- **SETUP.md** - Detailed setup
- **IMPLEMENTATION.md** - Technical details

## 💡 Tips

1. **Always run both servers** (API + App)
2. **Test offline mode** with DevTools
3. **Monitor console** for errors
4. **Check server logs** in terminal
5. **Backup `.env`** file safely

## 🎯 Quick Test

```bash
# 1. Start servers
./start.sh

# 2. Open browser: http://localhost:5173
# 3. Create study task
# 4. Generate study pack
# 5. Take quiz
# 6. View results
```

---

**Need help?** Check SETUP.md or IMPLEMENTATION.md
