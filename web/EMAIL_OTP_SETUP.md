# Email OTP Setup Guide

## 🎯 Overview
Set up email-based OTP (One-Time Password) for authentication in EduEcho.

## 📧 Choose Your Email Provider

### Option 1: Resend (RECOMMENDED - Easiest)

**Why Resend?**
- ✅ Simplest API
- ✅ Free tier: 3,000 emails/month
- ✅ No credit card required
- ✅ Modern, developer-friendly
- ✅ 5-minute setup

**Setup Steps:**

1. **Create Account**
   - Go to: https://resend.com
   - Sign up with GitHub or email
   - No credit card needed

2. **Get API Key**
   - Go to: https://resend.com/api-keys
   - Click "Create API Key"
   - Give it a name: "EduEcho Production"
   - Copy the key (starts with `re_`)

3. **Verify Domain (or use resend.dev)**
   - Option A: Use `onboarding@resend.dev` for testing (no verification needed)
   - Option B: Add your domain for production use

4. **Install Package**
   ```bash
   cd /Users/sooryaaxx/Documents/EduEcho/web/server
   npm install resend
   ```

5. **Add to .env**
   ```env
   # Resend Email Service
   RESEND_API_KEY=re_your_api_key_here
   EMAIL_FROM=onboarding@resend.dev
   ```

6. **Restart Server**
   ```bash
   npm run dev
   ```

---

### Option 2: SendGrid

**Why SendGrid?**
- ✅ Industry standard
- ✅ Free tier: 100 emails/day
- ✅ Reliable delivery
- ✅ Good for production

**Setup Steps:**

1. **Create Account**
   - Go to: https://sendgrid.com
   - Sign up
   - Verify email

2. **Get API Key**
   - Go to Settings → API Keys
   - Create API Key
   - Choose "Full Access"
   - Copy key (starts with `SG.`)

3. **Verify Sender**
   - Go to Settings → Sender Authentication
   - Verify your email address
   - Click verification link in email

4. **Install Package**
   ```bash
   cd /Users/sooryaaxx/Documents/EduEcho/web/server
   npm install @sendgrid/mail
   ```

5. **Add to .env**
   ```env
   # SendGrid Email Service
   SENDGRID_API_KEY=SG.your_api_key_here
   EMAIL_FROM=your-verified-email@gmail.com
   ```

---

### Option 3: Gmail SMTP (Development Only)

**Why Gmail?**
- ✅ Quick for testing
- ✅ Free
- ❌ Not recommended for production
- ❌ Daily sending limits

**Setup Steps:**

1. **Enable 2FA**
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - App: Mail
   - Device: Other (Custom name: "EduEcho")
   - Copy the 16-character password

3. **Install Package**
   ```bash
   cd /Users/sooryaaxx/Documents/EduEcho/web/server
   npm install nodemailer
   ```

4. **Add to .env**
   ```env
   # Gmail SMTP (Development Only)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

---

## 🔧 Implementation

### The email service files are ALREADY CREATED!

I've created the email service that supports all three providers. It automatically detects which provider you're using based on your .env variables.

**File Location:** `/server/src/services/emailService.ts`

### How It Works

1. **User enters email** → Frontend calls `/api/v1/auth/send-otp`
2. **Server generates 6-digit code** → Saves to database with 10-min expiry
3. **Email sent via your provider** → User receives code
4. **User enters code** → Frontend calls `/api/v1/auth/verify-otp`
5. **Server verifies code** → Returns user data + JWT token

---

## 🧪 Testing Your Setup

### 1. Test Email Sending

```bash
# After adding your API key to .env and restarting server
curl -X POST http://localhost:5001/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@gmail.com"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent to email"
}
```

**Check your email inbox!**

### 2. Test OTP Verification

```bash
curl -X POST http://localhost:5001/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email":"your-email@gmail.com",
    "otp":"123456"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "user": {...},
  "token": "jwt_token_here"
}
```

---

## 📊 Email Templates

### OTP Email (Modern Design)

```
Subject: Your EduEcho Login Code

━━━━━━━━━━━━━━━━━━━━━━━━━━

🎓 EduEcho

Your Login Code

Enter this code to continue:

  1  2  3  4  5  6

This code expires in 10 minutes.

If you didn't request this code, ignore this email.

━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🚀 Quick Start (Recommended: Resend)

```bash
# 1. Install Resend
cd /Users/sooryaaxx/Documents/EduEcho/web/server
npm install resend

# 2. Add to .env
echo "" >> .env
echo "# Resend Email Service" >> .env
echo "RESEND_API_KEY=re_your_key_from_resend_com" >> .env
echo "EMAIL_FROM=onboarding@resend.dev" >> .env

# 3. Restart server
pkill -f "node.*server" || true
npm run dev

# 4. Test from frontend
# Go to http://localhost:3000/auth/login
# Enter your email
# Check inbox for code!
```

---

## ⚙️ Environment Variables Summary

### For Resend (Recommended)
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=onboarding@resend.dev
```

### For SendGrid
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
EMAIL_FROM=verified-email@yourdomain.com
```

### For Gmail SMTP
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
```

---

## 🐛 Troubleshooting

### "Email not receiving"
1. Check spam folder
2. Verify API key in .env
3. Check server logs for errors
4. For Gmail: Ensure App Password is correct
5. For SendGrid: Verify sender email
6. For Resend: Check API usage at dashboard

### "Invalid API key"
- Resend: Key should start with `re_`
- SendGrid: Key should start with `SG.`
- Check for extra spaces in .env

### "Rate limit exceeded"
- Resend free: 3,000/month
- SendGrid free: 100/day
- Gmail: ~500/day
- Upgrade plan or wait 24 hours

---

## 🎉 You're Done!

Once you've added your email provider credentials:

1. ✅ Restart the server
2. ✅ Go to http://localhost:3000/auth/login
3. ✅ Enter your email
4. ✅ Check your inbox
5. ✅ Enter the 6-digit code
6. ✅ You're logged in!

---

**Recommended Setup Time:**
- Resend: 5 minutes
- SendGrid: 10 minutes
- Gmail: 5 minutes (dev only)

**My Recommendation:** Use Resend with `onboarding@resend.dev` for instant testing!

---

**Last Updated:** October 19, 2025

