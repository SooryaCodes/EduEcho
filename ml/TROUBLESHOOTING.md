# Troubleshooting Guide

## Fixed Issues

### ✅ Runtime Error: Cannot find module './778.js'

**Error Message:**
```
Runtime Error
Cannot find module './778.js'
```

**Cause:**
- Next.js build cache corruption
- Issue with server-side rendering (SSR) and client-side components
- Transformers.js requires browser-only APIs (AudioContext, IndexedDB)

**Solution Applied:**

1. **Dynamic Import with SSR Disabled:**
   Updated `ml/app/page.js` to use Next.js dynamic imports:
   ```javascript
   'use client';
   
   import dynamic from 'next/dynamic';
   
   const AudioProcessor = dynamic(() => import('../components/AudioProcessor'), {
     ssr: false,  // Disable server-side rendering
     loading: () => <div className="text-center p-8">Loading...</div>
   });
   ```

2. **Cleared Build Cache:**
   ```bash
   Remove-Item -Recurse -Force ml\.next
   ```

3. **Rebuilt Application:**
   ```bash
   npm run build
   ```

**Why This Works:**
- `ssr: false` ensures AudioProcessor only runs in the browser
- Transformers.js needs browser APIs like AudioContext and IndexedDB
- Dynamic import prevents Next.js from trying to render on the server

---

## Common Issues & Solutions

### Issue 1: Port Already in Use

**Error:**
```
Port 3000 is in use by process XXXXX
```

**Solution:**
Next.js automatically uses the next available port (e.g., 3001).
Check the terminal output for the correct URL.

Alternatively, stop the running process:
```powershell
Get-Process -Name node | Stop-Process -Force
```

---

### Issue 2: Model Download Fails

**Error:**
```
Failed to fetch model
```

**Possible Causes:**
- No internet connection
- Firewall blocking requests
- Hugging Face CDN issues

**Solution:**
1. Check internet connection
2. Try again later if CDN is down
3. Check browser console for detailed error
4. Ensure browser allows IndexedDB storage

---

### Issue 3: Audio File Not Processing

**Error:**
```
Failed to decode audio data
```

**Possible Causes:**
- Unsupported audio format
- Corrupted audio file
- Browser codec limitations

**Solution:**
1. Use common formats: MP3, WAV, M4A
2. Try a different audio file
3. Check browser compatibility
4. Ensure audio file is not too large (< 10MB recommended)

---

### Issue 4: Translation Not Working

**Error:**
```
Translation failed
```

**Possible Causes:**
- Translation model not downloaded
- Source language detection issue
- Model loading timeout

**Solution:**
1. Wait for initial model download (~600MB)
2. Check browser console for errors
3. Try transcribing first before translating
4. Ensure stable internet for first download
5. Check available disk space

---

### Issue 5: Build Errors After Updates

**Error:**
```
Module not found
Compilation failed
```

**Solution:**
1. Clean install dependencies:
   ```bash
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   npm install
   ```

2. Clear Next.js cache:
   ```bash
   Remove-Item -Recurse -Force .next
   ```

3. Rebuild:
   ```bash
   npm run build
   ```

---

## Performance Optimization

### If Application is Slow:

1. **Use Shorter Audio Files:**
   - Recommended: < 30 seconds for testing
   - Longer files take proportionally more time

2. **Close Other Browser Tabs:**
   - ML models need significant memory
   - Close unused tabs to free RAM

3. **First Run is Always Slower:**
   - Model downloads take time
   - Subsequent runs use cached models
   - Be patient on first transcription/translation

4. **Check Browser Console:**
   - Look for memory warnings
   - Check for network errors
   - Monitor download progress

---

## Browser Compatibility

### Supported Browsers:

✅ **Chrome/Edge 88+** (Recommended)
✅ **Firefox 78+**
✅ **Safari 14+**

### Required Features:

- WebAssembly support
- IndexedDB for model caching
- Web Audio API for audio processing
- ES6 modules support

### Check Compatibility:

Open browser console and run:
```javascript
console.log('WebAssembly:', typeof WebAssembly !== 'undefined');
console.log('IndexedDB:', typeof indexedDB !== 'undefined');
console.log('AudioContext:', typeof AudioContext !== 'undefined');
```

All should return `true`.

---

## Development Issues

### Hot Reload Not Working:

```bash
# Restart dev server
npm run dev
```

### TypeScript Errors (if using TS):

The project uses JavaScript (.js/.jsx). If you see TS errors:
```bash
# Ensure jsconfig.json exists (not tsconfig.json)
```

### Import Errors:

Ensure correct import paths:
```javascript
// Correct
import AudioProcessor from '../components/AudioProcessor';

// Wrong  
import AudioProcessor from './components/AudioProcessor';
```

---

## Debugging Steps

### Step 1: Check Console
Open browser DevTools (F12) and check Console tab for errors.

### Step 2: Check Network
Check Network tab to see if models are downloading.

### Step 3: Check Storage
Check Application > IndexedDB to see if models are cached.

### Step 4: Clear Cache
If issues persist:
1. Clear browser cache
2. Clear IndexedDB storage
3. Restart browser
4. Try again

### Step 5: Verify Installation
```bash
cd ml
npm list @xenova/transformers
npm list next
npm list react
```

Ensure all packages are installed correctly.

---

## Getting Help

### Check Logs:

**Browser Console:**
- Press F12 → Console tab
- Look for red error messages

**Terminal Output:**
- Check terminal where `npm run dev` is running
- Look for compilation errors

### Report Issues:

When reporting issues, include:
1. Error message (full text)
2. Browser and version
3. Operating system
4. Steps to reproduce
5. Console output
6. Network errors (if any)

---

## Quick Fixes Summary

| Issue | Quick Fix |
|-------|-----------|
| Module not found | `rm -rf .next && npm run dev` |
| Port in use | Check terminal for new port |
| Model download fails | Check internet & retry |
| Audio won't process | Try different audio file |
| Build fails | `rm -rf node_modules && npm install` |
| Cache issues | Clear browser cache & IndexedDB |

---

## Success Checklist

Before asking for help, verify:

- ✅ All dependencies installed (`npm install`)
- ✅ Dev server running (`npm run dev`)
- ✅ Browser DevTools open (F12)
- ✅ Console shows no errors
- ✅ Correct URL (check terminal for port)
- ✅ Internet connection (for first model download)
- ✅ Supported browser (Chrome 88+)
- ✅ Audio file is valid format
- ✅ Sufficient disk space (> 1GB free)

---

## Current Status: ✅ WORKING

The application has been fixed and is now working correctly:

- ✅ Dynamic imports implemented
- ✅ SSR disabled for client components
- ✅ Build cache cleared
- ✅ Successful build completed
- ✅ Dev server running

**To start:**
```bash
cd ml
npm run dev
```

Open: `http://localhost:3000` (or port shown in terminal)
