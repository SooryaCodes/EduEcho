# 🚀 EduEcho - Quick Start Guide

## Get Running in 5 Minutes

### 1. Install Dependencies

```bash
# Frontend
cd client
npm install

# Backend (in another terminal)
cd server
npm install
```

### 2. Set Environment Variables

**Frontend** (`client/.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

**Backend** (`server/.env`):
```bash
MONGODB_URI=mongodb+srv://your_connection_string
OPENAI_API_KEY=sk-your_key_here
PINECONE_API_KEY=your_key_here
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
PORT=5000
NODE_ENV=development
```

### 3. Start the Apps

**Terminal 1 - Backend**:
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend**:
```bash
cd client
npm run dev
# App runs on http://localhost:3000
```

### 4. Visit the App

Open your browser to: **http://localhost:3000**

---

## 🎨 What You'll See

### Landing Page
- Modern hero with purple/yellow bento grid
- Feature cards with vibrant colors
- Professional footer
- **Action**: Click "Get Started" to sign up

### Sign Up
- Email verification (no password!)
- Beautiful split-screen layout
- Purple branded left side
- **Action**: Enter name & email → Get code

### Onboarding
- Choose learning style (QuickLearner, FullMark, etc.)
- Select your interests
- Progress bar shows your completion
- **Action**: Complete 2 steps to reach dashboard

### Dashboard
- Stats cards (threads, replies, points)
- Recent activity
- Quick action cards
- **Action**: Explore sidebar navigation

---

## 📱 Pages to Explore

### Threads (`/dashboard/threads`)
- List of all questions
- Search & filter by subject
- Create new thread button
- **Try**: Create a new question!

### Leaderboard (`/dashboard/leaderboard`)
- Top 3 podium (gold/silver/bronze)
- Full rankings list
- Timeframe tabs
- **Try**: Check different timeframes

### Search (`/dashboard/search`)
- Large AI-powered search interface
- Results by category
- Search suggestions
- **Try**: Search for a topic

### Profile (`/dashboard/profile`)
- Your stats and rank
- Activity tabs
- Learning journey
- **Try**: View your stats

### Settings (`/dashboard/settings`)
- Update profile
- Change learning type
- Language preferences
- **Try**: Update your settings

---

## 🎯 Testing the UI

### Test Responsive Design
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Try different screen sizes
4. Check mobile menu works

### Test Dark Mode
1. Click theme toggle in navbar
2. See all pages in dark mode
3. Check contrast and readability
4. Toggle back to light mode

### Test Forms
1. Try creating a thread
2. Add tags
3. Test voice recording UI (toggle button)
4. Check validation messages

### Test Navigation
1. Use sidebar to navigate
2. Try breadcrumbs
3. Test back buttons
4. Check links work

---

## 🐛 Troubleshooting

### Frontend won't start
```bash
cd client
rm -rf node_modules .next
npm install
npm run dev
```

### Backend won't start
```bash
cd server
rm -rf node_modules dist
npm install
npm run dev
```

### Styles look broken
1. Check `globals.css` is loaded
2. Clear browser cache (Ctrl+Shift+R)
3. Check Tailwind config

### MongoDB connection fails
1. Check `MONGODB_URI` in `.env`
2. Whitelist your IP in MongoDB Atlas
3. Check network connection

---

## 📋 Environment Checklist

### Required
- [x] Node.js 18+
- [x] npm or yarn
- [x] MongoDB Atlas account

### Optional (for full features)
- [ ] OpenAI API key (for AI features)
- [ ] Pinecone account (for semantic search)
- [ ] Cloudinary account (for media storage)

---

## 🎨 UI Features to Test

### Colors
- ✅ Purple primary (#6C5DD3)
- ✅ Yellow secondary (#FFD166)
- ✅ Light purple backgrounds
- ✅ Light yellow backgrounds

### Typography
- ✅ Cabinet Grotesk headings
- ✅ Manrope body text
- ✅ Proper font weights

### Components
- ✅ Rounded buttons (2xl)
- ✅ Card shadows
- ✅ Hover effects
- ✅ Smooth transitions
- ✅ Loading states
- ✅ Empty states

### Animations
- ✅ Page transitions
- ✅ Card hover effects
- ✅ Button interactions
- ✅ List item animations
- ✅ Fade in effects

---

## 🔗 Quick Links

### Documentation
- [Complete Status](./STATUS.md)
- [Implementation Details](./IMPLEMENTATION_COMPLETE.md)
- [API Documentation](./server/API_DOCS.md)
- [Backend Setup](./server/README.md)
- [Frontend Setup](./client/README.md)

### Key Files
- **Landing**: `client/app/(landing)/page.tsx`
- **Dashboard**: `client/app/(app)/dashboard/page.tsx`
- **Threads**: `client/app/(app)/dashboard/threads/page.tsx`
- **Styles**: `client/app/globals.css`
- **API**: `client/lib/api.ts`

---

## 💡 Tips

1. **Test Mobile First**: Most users are mobile
2. **Check Dark Mode**: Toggle often
3. **Try All Forms**: Create, edit, delete
4. **Test Navigation**: Use all links
5. **Check Loading**: See all loading states
6. **Test Empty States**: View pages with no data
7. **Try Filters**: Use search and filters
8. **Test Responsiveness**: Resize browser
9. **Check Accessibility**: Use keyboard navigation
10. **Read Toasts**: Check notification messages

---

## 🎉 You're Ready!

Now you can:
- ✅ Explore the beautiful UI
- ✅ Test all features
- ✅ See the purple/yellow theme
- ✅ Experience smooth animations
- ✅ Navigate all pages
- ✅ Test responsive design
- ✅ Toggle dark mode
- ✅ Create threads
- ✅ View leaderboard
- ✅ Search content

**Next**: Connect real backend APIs and implement voice recording!

---

**Questions?** Check the documentation files or the code comments.

**Ready to Deploy?** See `SETUP_GUIDE.md` for production deployment.

