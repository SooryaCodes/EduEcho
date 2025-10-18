# 🔧 Environment Setup Guide - CRITICAL FIXES NEEDED

## 🚨 **IMMEDIATE ACTION REQUIRED**

Your server is showing API key errors. You need to create the `.env` file with your actual API keys.

---

## 📁 **Create Server Environment File**

**Location**: `/Users/sooryaaxx/Documents/EduEcho/web/server/.env`

```bash
# Navigate to server directory
cd /Users/sooryaaxx/Documents/EduEcho/web/server

# Create .env file
touch .env
```

---

## 🔑 **Required Environment Variables**

Add these to your `server/.env` file:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database - ALREADY WORKING
MONGODB_URI=mongodb+srv://sooryakriz111:sooryakriz111@cluster0.mongodb.net/eduecho?retryWrites=true&w=majority

# OpenAI Configuration - NEEDS YOUR REAL API KEY
OPENAI_API_KEY=sk-your_actual_openai_api_key_here

# Pinecone Configuration - NEEDS YOUR REAL API KEYS  
PINECONE_API_KEY=your_actual_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment_here
PINECONE_INDEX_NAME=eduecho-embeddings

# Cloudinary Configuration - OPTIONAL FOR NOW
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name_here
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d

# Email Configuration (for OTP) - OPTIONAL FOR NOW
RESEND_API_KEY=your_resend_api_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password_here
```

---

## 🔥 **CRITICAL: Get Your API Keys**

### 1. **OpenAI API Key** (REQUIRED for voice input)
- Go to: https://platform.openai.com/account/api-keys
- Click "Create new secret key"
- Copy the key (starts with `sk-`)
- Replace `sk-your_actual_openai_api_key_here` in your .env

### 2. **Pinecone API Key** (REQUIRED for semantic search)
- Go to: https://app.pinecone.io/
- Sign up/login
- Go to API Keys section
- Copy your API key and environment
- Replace the placeholders in your .env

### 3. **JWT Secret** (REQUIRED for authentication)
- Generate a random string (at least 32 characters)
- You can use: `openssl rand -base64 32`
- Replace `your_super_secret_jwt_key_here_make_it_long_and_random`

---

## ⚡ **Quick Fix Commands**

```bash
# 1. Navigate to server directory
cd /Users/sooryaaxx/Documents/EduEcho/web/server

# 2. Create .env file
cat > .env << 'EOF'
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb+srv://sooryakriz111:sooryakriz111@cluster0.mongodb.net/eduecho?retryWrites=true&w=majority
OPENAI_API_KEY=sk-your_actual_openai_api_key_here
PINECONE_API_KEY=your_actual_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment_here
PINECONE_INDEX_NAME=eduecho-embeddings
CLOUDINARY_CLOUD_NAME=placeholder
CLOUDINARY_API_KEY=placeholder
CLOUDINARY_API_SECRET=placeholder
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d
RESEND_API_KEY=placeholder
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password_here
EOF

# 3. Edit the file with your actual keys
nano .env
```

---

## 🎯 **What Each Key Fixes**

| API Key | Fixes | Status |
|---------|-------|--------|
| `OPENAI_API_KEY` | ✅ Voice input transcription | **CRITICAL** |
| `PINECONE_API_KEY` | ✅ Semantic search | **CRITICAL** |
| `JWT_SECRET` | ✅ User authentication | **CRITICAL** |
| `MONGODB_URI` | ✅ Database connection | **WORKING** |
| `CLOUDINARY_*` | ✅ File uploads | Optional |
| `RESEND_API_KEY` | ✅ OTP emails | Optional |

---

## 🚀 **After Adding Keys**

1. **Restart your server**:
   ```bash
   cd server
   npm run dev
   ```

2. **Check for success messages**:
   - ✅ MongoDB connected successfully
   - ✅ OpenAI configured (no more warnings)
   - ✅ Pinecone initialized successfully

3. **Test voice input**:
   - Go to `/dashboard/threads/new`
   - Click "Voice Input" button
   - Should work without API key errors

---

## 🆘 **Still Having Issues?**

If you're still getting errors after adding the API keys:

1. **Check .env file exists**:
   ```bash
   ls -la /Users/sooryaaxx/Documents/EduEcho/web/server/.env
   ```

2. **Verify file contents**:
   ```bash
   cat /Users/sooryaaxx/Documents/EduEcho/web/server/.env
   ```

3. **Restart server completely**:
   ```bash
   # Kill server (Ctrl+C)
   # Then restart
   cd server && npm run dev
   ```

---

**🎯 PRIORITY: Get OpenAI API key first - this will fix voice input immediately!**
