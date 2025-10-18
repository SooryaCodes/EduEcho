# Quick Fix Guide - Get EduEcho Running in 2 Minutes

## 🚨 If You're Seeing Errors, Start Here

### Step 1: Fix MongoDB Connection (Most Common Issue)

**Error**: `MongooseServerSelectionError: Could not connect to any servers`

**Solution**:
1. Go to https://cloud.mongodb.com
2. Click your cluster → "Network Access" (left sidebar)
3. Click "Add IP Address"
4. Select "Allow Access from Anywhere" (0.0.0.0/0)
5. Click "Confirm"
6. **Wait 1-2 minutes** for changes to apply
7. Restart your server

**Alternative**: Add your current IP specifically:
```bash
# Get your public IP
curl ifconfig.me

# Add that IP in MongoDB Atlas Network Access
```

---

### Step 2: Verify Environment Variables

**Check if `.env` file exists in server directory**:
```bash
ls -la /Users/sooryaaxx/Documents/EduEcho/web/server/.env
```

**If it doesn't exist, create it**:
```bash
cd /Users/sooryaaxx/Documents/EduEcho/web/server

cat > .env << 'EOF'
# Required
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/eduecho

# Optional (but recommended)
OPENAI_API_KEY=sk-your-key-here
PINECONE_API_KEY=your-pinecone-key
PINECONE_INDEX_NAME=eduecho-embeddings
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server Config
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF
```

**Replace the placeholders** with your actual credentials:
- `YOUR_USERNAME`, `YOUR_PASSWORD`, `YOUR_CLUSTER` from MongoDB Atlas
- OpenAI key from https://platform.openai.com/api-keys
- Pinecone key from https://app.pinecone.io
- Cloudinary credentials from https://cloudinary.com/console

---

### Step 3: Start the Server

```bash
cd /Users/sooryaaxx/Documents/EduEcho/web/server

# Install dependencies if needed
npm install

# Start server
npm run dev
```

**What You Should See** (Success):
```
🔍 Checking environment variables...
✅ MongoDB connected successfully
✅ Pinecone initialized successfully

🚀 ===============================================
   Server running successfully on port 5000
   ===============================================
📊 Environment: development
🔗 API: http://localhost:5000/api/v1
💚 Health: http://localhost:5000/health

✅ Services Status:
   - MongoDB: Connected
   - OpenAI: Configured
   - Pinecone: Configured
   - Cloudinary: Configured

💡 Ready to accept requests!
```

**If You See Warnings** (Acceptable):
```
⚠️  Missing optional environment variables: OPENAI_API_KEY, PINECONE_API_KEY
   Some features may not work without these variables.
```
This is OK! The server will still run. Add these keys later for full functionality.

**If You See Errors**:
- `MONGODB_URI is not defined` → Create .env file (see Step 2)
- `MongoDB connection failed` → Check IP whitelist (see Step 1)
- `Port 5000 already in use` → Kill process: `lsof -ti:5000 | xargs kill`

---

### Step 4: Start the Client

**Open a NEW terminal** (keep server running):

```bash
cd /Users/sooryaaxx/Documents/EduEcho/web/client

# Check if .env.local exists
ls -la .env.local

# If not, create it:
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
EOF

# Install dependencies if needed
npm install

# Start client
npm run dev
```

**What You Should See**:
```
▲ Next.js 15.0.1
- Local:        http://localhost:3000
- Ready in 2.3s
```

---

### Step 5: Test Everything

1. **Open browser**: http://localhost:3000
2. **You should see**: Beautiful landing page with purple/yellow theme
3. **Test API**: http://localhost:5000/health
4. **You should see**: `{"success":true,"message":"EduEcho API is running"}`

---

## 🔥 Quick Troubleshooting

### Server Won't Start

**Problem**: Port already in use
```bash
# Kill the process
lsof -ti:5000 | xargs kill

# Or use a different port
# Edit server/.env: PORT=5001
```

**Problem**: MongoDB connection fails
```bash
# Test your MongoDB URI directly
node -e "const mongoose = require('mongoose'); mongoose.connect('YOUR_MONGODB_URI').then(() => console.log('✅ Connected!')).catch(err => console.error('❌ Error:', err.message));"
```

**Problem**: Missing dependencies
```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

### Frontend Won't Start

**Problem**: Port 3000 in use
```bash
# Kill the process
lsof -ti:3000 | xargs kill

# Or use different port
npm run dev -- -p 3001
```

**Problem**: Build errors
```bash
cd client
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

### Can't Connect Frontend to Backend

**Problem**: CORS errors in browser console

**Solution**:
1. Verify server is running on port 5000
2. Check `client/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:5000`
3. Restart both server and client

---

## 🎯 Absolute Minimum to Run

**You ONLY need**:
1. MongoDB Atlas account (free tier)
2. IP whitelisted in MongoDB Atlas
3. MONGODB_URI in server/.env
4. Both servers running

**Everything else is optional** for basic demo!

---

## 📞 Still Stuck?

### Check These Files

1. **Server .env exists**:
   ```bash
   cat /Users/sooryaaxx/Documents/EduEcho/web/server/.env
   ```
   Should show your MongoDB URI

2. **Client .env.local exists**:
   ```bash
   cat /Users/sooryaaxx/Documents/EduEcho/web/client/.env.local
   ```
   Should show API URLs

3. **MongoDB Atlas Network Access**:
   - Go to https://cloud.mongodb.com
   - Check "Network Access" has 0.0.0.0/0 or your IP

4. **Ports are free**:
   ```bash
   lsof -i :5000  # Should be empty or show your server
   lsof -i :3000  # Should be empty or show your client
   ```

---

## ✅ Success Checklist

- [ ] MongoDB Atlas cluster is running (not paused)
- [ ] IP address whitelisted in Network Access
- [ ] server/.env file exists with MONGODB_URI
- [ ] client/.env.local file exists with API URLs
- [ ] Server running on port 5000 (no errors)
- [ ] Client running on port 3000 (no errors)
- [ ] http://localhost:3000 shows landing page
- [ ] http://localhost:5000/health returns success

---

## 🎉 You're Done!

Once all checkboxes above are ✅, you have:
- ✅ Working backend API
- ✅ Beautiful frontend UI
- ✅ MongoDB connected
- ✅ Ready to demo!

**Optional**: Add OpenAI, Pinecone, and Cloudinary keys later for full AI features.

---

**Last Updated**: October 18, 2025

