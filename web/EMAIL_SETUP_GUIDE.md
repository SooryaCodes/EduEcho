# 📧 Email Verification Setup Guide

## Gmail App Password Setup (For Email Verification)

### Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification" if not already enabled
3. Follow the prompts to verify your phone number

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" as the app
3. Select "Other" as the device
4. Name it "EduEcho" or "Node Mailer"
5. Click "Generate"
6. **COPY THE 16-CHARACTER PASSWORD** (you won't see it again)

### Step 3: Add to Server .env
```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # The 16-char app password
EMAIL_FROM="EduEcho <noreply@eduecho.com>"
```

---

## Alternative: Using SendGrid (Recommended for Production)

### Setup SendGrid
1. Sign up at https://sendgrid.com
2. Create an API key
3. Verify your sender email
4. Add to .env:

```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM="EduEcho <noreply@yourdomain.com>"
```

---

## Server Environment Variables

### Complete .env File
```env
# MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/eduecho

# OpenAI (for AI features)
OPENAI_API_KEY=sk-your_openai_key

# Pinecone (for semantic search)
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX=eduecho-vectors

# Cloudinary (for voice files)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Email (Gmail App Password)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
EMAIL_FROM="EduEcho <noreply@eduecho.com>"

# JWT & Security
JWT_SECRET=super_secret_jwt_key_min_32_chars
SESSION_SECRET=super_secret_session_key

# Server Config
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Testing Email Verification

### 1. Start the Server
```bash
cd server
npm run dev
```

### 2. Test Email Endpoint
```bash
curl -X POST http://localhost:5000/api/v1/auth/send-verification \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### 3. Check Response
```json
{
  "success": true,
  "message": "Verification code sent to email",
  "expiresIn": "10 minutes"
}
```

---

## Frontend Configuration

### Client .env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## Common Issues & Fixes

### Issue 1: "Invalid credentials"
- **Fix**: Make sure you're using the App Password, not your Gmail password
- **Fix**: Remove any spaces from the app password in .env

### Issue 2: "Less secure app access"
- **Fix**: Don't use "Less secure apps" - use App Passwords instead
- **Fix**: Enable 2FA and generate app password

### Issue 3: CORS errors
- **Fix**: Make sure `CLIENT_URL` in server .env matches your frontend URL
- **Fix**: Check if `ALLOWED_ORIGINS` includes your frontend URL

### Issue 4: Email not sending
- **Check**: Server logs for errors
- **Check**: Email service is configured correctly
- **Check**: Internet connection and firewall settings

---

## Production Checklist

- [ ] Use SendGrid or AWS SES (not Gmail)
- [ ] Set proper `ALLOWED_ORIGINS` for production domain
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Enable rate limiting
- [ ] Set `NODE_ENV=production`
- [ ] Use environment variables (never commit secrets)
- [ ] Set up email templates
- [ ] Add email retry logic
- [ ] Monitor email delivery rates
- [ ] Set up email bounce handling

---

## Quick Start Commands

```bash
# 1. Copy example env
cp server/.env.example server/.env

# 2. Edit .env with your credentials
nano server/.env

# 3. Install dependencies
cd server && npm install

# 4. Start server
npm run dev

# 5. Test email (in another terminal)
curl -X POST http://localhost:5000/api/v1/auth/send-verification \
  -H "Content-Type: application/json" \
  -d '{"email": "your_email@gmail.com"}'
```

---

**Status**: Follow these steps to enable email verification! 🚀

