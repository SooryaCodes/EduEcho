# EduEcho - Complete Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Get Your Credentials

You need 4 API keys. Here's where to get them:

#### 1. MongoDB Atlas (FREE)
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Create account
4. Create a free cluster (M0 Sandbox)
5. Click "Connect" → "Drivers" → Copy connection string
6. Replace `<password>` with your actual password

**Result:** `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/eduecho`

#### 2. OpenAI API Key (PAID - $5-10 credit recommended)
1. Go to https://platform.openai.com
2. Sign up/Login
3. Click your profile → "View API keys"
4. "Create new secret key"
5. Copy the key (starts with `sk-`)
6. Add billing: Settings → Billing → Add payment method

**Result:** `sk-proj-xxxxxxxxxxxxxxxxxx`

#### 3. Pinecone (FREE)
1. Go to https://www.pinecone.io
2. Sign up (free tier available)
3. Create a new index:
   - Name: `eduecho-embeddings`
   - Dimensions: `1536`
   - Metric: `cosine`
   - Region: Choose closest to you
4. Copy API key from dashboard

**Result:** API key

#### 4. Cloudinary (FREE)
1. Go to https://cloudinary.com
2. Sign up (free tier: 25 GB storage)
3. Dashboard shows:
   - Cloud Name
   - API Key
   - API Secret

---

### Step 2: Setup Backend

```bash
# Navigate to server directory
cd /Users/sooryaaxx/Documents/EduEcho/web/server

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://your-connection-string-here

# OpenAI
OPENAI_API_KEY=sk-your-key-here

# Pinecone
PINECONE_API_KEY=your-pinecone-key-here
PINECONE_INDEX_NAME=eduecho-embeddings

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS
ALLOWED_ORIGINS=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

# Start server
npm run dev
```

**✅ Server should be running on http://localhost:5000**

Test it:
```bash
curl http://localhost:5000/health
```

Should return:
```json
{
  "success": true,
  "message": "EduEcho API is running"
}
```

---

### Step 3: Setup Frontend

Open a **NEW terminal** (keep server running):

```bash
# Navigate to client directory
cd /Users/sooryaaxx/Documents/EduEcho/web/client

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
EOF

# Start client
npm run dev
```

**✅ Client should be running on http://localhost:3000**

---

### Step 4: Verify Everything Works

1. **Open Browser:** http://localhost:3000
2. **You should see:**
   - Beautiful homepage with search bar
   - Navigation header
   - Thread cards
   - Stats section

3. **Test Backend:**
   - Open http://localhost:5000/health
   - Should show API status

**🎉 Done! You're ready to demo!**

---

## 🔧 Detailed Configuration

### Environment Variables Explained

#### Server (.env)

```env
# The port your backend runs on
PORT=5000

# Development or production
NODE_ENV=development

# Your MongoDB connection string
# Format: mongodb+srv://username:password@cluster.mongodb.net/dbname
MONGODB_URI=mongodb+srv://...

# OpenAI API key for AI features
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-...

# Pinecone for semantic search
# Get from: https://app.pinecone.io
PINECONE_API_KEY=...
PINECONE_INDEX_NAME=eduecho-embeddings

# Cloudinary for audio file storage
# Get from: https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Which origins can access your API
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Rate limiting settings (15 min window, 100 requests)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Client (.env.local)

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# WebSocket URL (usually same as API)
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## 📊 Testing the Features

### 1. Test API Endpoints

```bash
# Get all threads
curl http://localhost:5000/api/v1/threads

# Get leaderboard
curl http://localhost:5000/api/v1/leaderboard

# Search
curl "http://localhost:5000/api/v1/threads/search?q=database"
```

### 2. Test Voice Transcription

```bash
# Upload audio file
curl -X POST http://localhost:5000/api/v1/ai/transcribe \
  -F "audio=@path/to/audio.mp3"
```

### 3. Test AI Evaluation

```bash
curl -X POST http://localhost:5000/api/v1/ai/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Binary search is an efficient algorithm...",
    "question": "Explain binary search"
  }'
```

---

## 🐛 Troubleshooting

### Backend Issues

#### 1. "MongoDB connection failed"
**Solution:**
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for testing)
- Ensure database user has read/write permissions

#### 2. "OpenAI API error: 401 Unauthorized"
**Solution:**
- Verify OPENAI_API_KEY is correct
- Check billing status at https://platform.openai.com/account/billing
- Ensure API key has not been revoked

#### 3. "Pinecone initialization failed"
**Solution:**
- Verify PINECONE_API_KEY is correct
- Check index exists with correct name
- Ensure index dimensions = 1536
- Wait if index is still initializing

#### 4. "Port 5000 already in use"
**Solution:**
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill

# Or change PORT in .env to 5001
```

### Frontend Issues

#### 1. "Cannot connect to API"
**Solution:**
- Verify backend is running on port 5000
- Check NEXT_PUBLIC_API_URL in .env.local
- Check CORS settings in backend allow localhost:3000

#### 2. "Module not found" errors
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

#### 3. "Port 3000 already in use"
**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill

# Or run on different port
npm run dev -- -p 3001
```

---

## 📁 Project Structure

```
EduEcho/web/
├── server/                      # Backend
│   ├── src/
│   │   ├── config/             # DB, AI configs
│   │   ├── models/             # MongoDB schemas
│   │   ├── controllers/        # API handlers
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   ├── middleware/         # Express middleware
│   │   └── index.ts            # Server entry
│   ├── .env                    # ⚠️ ADD YOUR CREDENTIALS
│   ├── package.json
│   └── README.md
│
├── client/                      # Frontend
│   ├── app/                    # Next.js pages
│   ├── components/             # React components
│   ├── lib/                    # Utilities
│   ├── hooks/                  # Custom hooks
│   ├── stores/                 # State management
│   ├── types/                  # TypeScript types
│   ├── .env.local              # ⚠️ ADD YOUR CONFIG
│   ├── package.json
│   └── README.md
│
├── PROJECT_SUMMARY.md          # Overview
└── SETUP_GUIDE.md              # This file
```

---

## 🎯 What You Can Demo

### Working Features:

✅ **Homepage**
- Modern UI with gradient headers
- Search bar
- Thread cards
- Stats dashboard

✅ **Backend API** (40+ endpoints)
- GET /api/v1/threads - List threads
- POST /api/v1/threads - Create thread
- GET /api/v1/leaderboard - Rankings
- POST /api/v1/ai/transcribe - Voice transcription
- POST /api/v1/ai/evaluate - AI scoring
- Full CRUD for threads, replies, notebooks

✅ **AI Integration**
- Voice transcription (Whisper)
- Content evaluation (GPT-4)
- Summary generation
- Semantic search (Embeddings + Pinecone)
- Text-to-speech
- Flashcard generation

✅ **Real-time**
- WebSocket connections
- Live notifications

✅ **Database**
- MongoDB models
- Proper indexing
- Data validation

---

## 📚 Additional Resources

### Documentation
- **Server README:** `/server/README.md`
- **API Documentation:** `/server/API_DOCS.md`
- **Implementation Guide:** `/server/IMPLEMENTATION.md`
- **AI Integration:** `/server/AI_INTEGRATION.md`
- **Client README:** `/client/README.md`
- **Components Guide:** `/client/COMPONENTS.md`

### API Endpoints Summary
- Threads: `/api/v1/threads`
- Replies: `/api/v1/replies`
- Users: `/api/v1/users`
- Notebooks: `/api/v1/notebooks`
- AI Services: `/api/v1/ai`
- Search: `/api/v1/search`
- Leaderboard: `/api/v1/leaderboard`

### Technologies Used
- **Backend:** Node.js, Express, TypeScript, MongoDB
- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS
- **UI:** shadcn/ui (35+ components)
- **AI:** OpenAI (GPT-4, Whisper, Embeddings, TTS)
- **Vector DB:** Pinecone
- **Storage:** Cloudinary
- **Real-time:** Socket.IO

---

## 🚀 Quick Commands Reference

### Server
```bash
cd server
npm install              # Install dependencies
npm run dev              # Development mode
npm run build            # Build for production
npm start                # Run production
npm run lint             # Lint code
```

### Client
```bash
cd client
npm install              # Install dependencies
npm run dev              # Development mode
npm run build            # Build for production
npm start                # Run production
npm run lint             # Lint code
```

---

## 💡 Tips for Judges/Demo

1. **Show the Homepage First**
   - Point out modern UI design
   - Demonstrate responsive layout
   - Show component variety

2. **Demonstrate Backend API**
   - Open http://localhost:5000/api/v1/threads
   - Show JSON response
   - Explain data structure

3. **Highlight AI Features**
   - Mention Whisper transcription
   - Explain GPT-4 evaluation (5 metrics)
   - Show semantic search capability
   - Demonstrate TTS generation

4. **Show Documentation**
   - Open API_DOCS.md
   - Show comprehensive setup guides
   - Highlight architecture diagrams

5. **Emphasize Production-Ready**
   - TypeScript throughout
   - Error handling
   - Validation
   - Security
   - Testing ready
   - Deployment ready

---

## ✅ Checklist

Before demo:
- [ ] MongoDB Atlas cluster created and running
- [ ] OpenAI API key with billing enabled
- [ ] Pinecone index created (dimensions: 1536)
- [ ] Cloudinary account set up
- [ ] Backend .env file configured
- [ ] Frontend .env.local file configured
- [ ] Server running on port 5000
- [ ] Client running on port 3000
- [ ] Browser showing homepage
- [ ] API health check working

---

## 🎉 You're All Set!

Your EduEcho platform is ready to impress judges with:
- ✨ Beautiful, modern UI
- 🤖 Complete AI integration
- 📊 Full-stack functionality
- 📚 Comprehensive documentation
- 🚀 Production-ready code

**Good luck with your hackathon! 🚀**

