# EduEcho - Credentials Checklist

## 📋 What You Need to Update

This document lists all the credentials and configuration you need to provide to make EduEcho fully functional.

---

## 1. MongoDB Atlas

**What it's for:** Database for storing users, threads, replies, notebooks

**How to get:**
1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up (FREE tier available)
3. Create a cluster (M0 Sandbox - Free)
4. Click "Connect" → "Drivers"
5. Copy connection string

**Where to add:**
- File: `/server/.env`
- Variable: `MONGODB_URI`
- Format: `mongodb+srv://username:password@cluster.mongodb.net/eduecho`

**Status:** ⬜ Not configured

---

## 2. OpenAI API Key

**What it's for:** 
- Voice transcription (Whisper)
- Content evaluation (GPT-4)
- Text summarization
- Embeddings for search
- Text-to-speech

**How to get:**
1. Go to: https://platform.openai.com
2. Sign up / Log in
3. Go to: API Keys section
4. Create new secret key
5. **Important:** Add billing method (you'll need ~$5-10 credit)

**Where to add:**
- File: `/server/.env`
- Variable: `OPENAI_API_KEY`
- Format: `sk-proj-xxxxxxxxxxxxxxxxxx`

**Cost estimate:** ~$2-5 for testing/demo

**Status:** ⬜ Not configured

---

## 3. Pinecone API Key

**What it's for:** Vector database for semantic search

**How to get:**
1. Go to: https://www.pinecone.io
2. Sign up (FREE tier available)
3. Create a new index with these settings:
   - **Name:** `eduecho-embeddings`
   - **Dimensions:** `1536` (important!)
   - **Metric:** `cosine`
   - **Pod Type:** Starter (free)
4. Copy API key from dashboard

**Where to add:**
- File: `/server/.env`
- Variables: 
  - `PINECONE_API_KEY=your-api-key`
  - `PINECONE_INDEX_NAME=eduecho-embeddings`

**Status:** ⬜ Not configured

---

## 4. Cloudinary Credentials

**What it's for:** Storage for audio files (voice replies, TTS outputs)

**How to get:**
1. Go to: https://cloudinary.com
2. Sign up (FREE tier: 25GB storage, 25GB bandwidth)
3. Dashboard shows all three values:
   - Cloud Name
   - API Key
   - API Secret

**Where to add:**
- File: `/server/.env`
- Variables:
  ```
  CLOUDINARY_CLOUD_NAME=your-cloud-name
  CLOUDINARY_API_KEY=your-api-key
  CLOUDINARY_API_SECRET=your-api-secret
  ```

**Status:** ⬜ Not configured

---

## 📝 Configuration Files

### Server `.env` File

Location: `/server/.env`

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas - YOU NEED TO ADD THIS ⚠️
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eduecho

# OpenAI - YOU NEED TO ADD THIS ⚠️
OPENAI_API_KEY=sk-your-key-here

# Pinecone - YOU NEED TO ADD THIS ⚠️
PINECONE_API_KEY=your-pinecone-key
PINECONE_INDEX_NAME=eduecho-embeddings

# Cloudinary - YOU NEED TO ADD THIS ⚠️
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret

# CORS (Already configured)
ALLOWED_ORIGINS=http://localhost:3000

# Rate Limiting (Already configured)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Client `.env.local` File

Location: `/client/.env.local`

```env
# These are already set correctly, no changes needed
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## ⚡ Quick Setup Commands

Once you have all credentials, run:

```bash
# 1. Setup Server
cd server

# Create .env file
cat > .env << 'EOF'
PORT=5000
NODE_ENV=development

MONGODB_URI=YOUR_MONGODB_URI_HERE
OPENAI_API_KEY=YOUR_OPENAI_KEY_HERE
PINECONE_API_KEY=YOUR_PINECONE_KEY_HERE
PINECONE_INDEX_NAME=eduecho-embeddings
CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_NAME_HERE
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_KEY_HERE
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_SECRET_HERE
ALLOWED_ORIGINS=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

# Install and run
npm install
npm run dev

# 2. Setup Client (in new terminal)
cd ../client
npm install
npm run dev
```

---

## ✅ Verification Checklist

### Before Running

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with read/write permissions
- [ ] IP whitelist configured (0.0.0.0/0 for testing)
- [ ] OpenAI account created
- [ ] Billing method added to OpenAI
- [ ] API key generated
- [ ] Pinecone account created
- [ ] Pinecone index created (dimensions: 1536)
- [ ] Cloudinary account created
- [ ] All credentials copied to `/server/.env`

### After Running

- [ ] Backend starts without errors
- [ ] http://localhost:5000/health returns success
- [ ] Frontend starts without errors
- [ ] http://localhost:3000 shows homepage
- [ ] No console errors

---

## 🆘 Troubleshooting

### "MongoDB connection failed"
- Check MONGODB_URI format
- Verify IP whitelist includes your IP
- Confirm database user has correct permissions

### "OpenAI API error"
- Verify API key is correct
- Check billing is enabled
- Ensure you have credit balance

### "Pinecone initialization failed"
- Verify API key is correct
- Check index name matches exactly
- Ensure dimensions = 1536
- Wait if index is still initializing (takes 1-2 minutes)

### "Cloudinary upload failed"
- Verify all three credentials (name, key, secret)
- Check credentials don't have extra spaces

---

## 💰 Cost Breakdown

| Service | Free Tier | Estimated Demo Cost |
|---------|-----------|---------------------|
| MongoDB Atlas | ✅ 512 MB | $0 |
| OpenAI | ❌ Pay-as-you-go | $2-5 |
| Pinecone | ✅ 1 index, 100k vectors | $0 |
| Cloudinary | ✅ 25 GB | $0 |
| **Total** | | **$2-5** |

**Note:** Only OpenAI requires payment. Recommended to add $5-10 credit for testing and demo.

---

## 📞 Support

If you encounter issues:

1. Check the documentation:
   - `/server/README.md` - Server setup
   - `/server/API_DOCS.md` - API reference
   - `/server/AI_INTEGRATION.md` - AI setup details
   - `/SETUP_GUIDE.md` - Complete setup guide

2. Verify environment variables are correctly set

3. Check service dashboards for status:
   - MongoDB Atlas: https://cloud.mongodb.com
   - OpenAI: https://platform.openai.com
   - Pinecone: https://app.pinecone.io
   - Cloudinary: https://cloudinary.com/console

---

## 🎯 Ready to Go?

Once all checkboxes are marked:
1. ✅ All credentials obtained
2. ✅ `.env` file created with credentials
3. ✅ Both servers running
4. ✅ No errors in console

**You're ready to demo EduEcho! 🚀**

---

**Last Updated:** 2025-10-18

