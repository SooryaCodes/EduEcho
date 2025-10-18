# 1-Hour Guide: Offline Transcription & Translation in Next.js

## 1. Core Concept (5 mins)

Transformers.js is a powerful library that runs sophisticated AI models directly in your browser, with no server or internet connection required after the initial model download. This means your audio processing happens entirely on the user's device, ensuring privacy and speed.

We're using a pre-trained "Whisper" model (whisper-base) for transcription, which provides excellent accuracy for speech-to-text conversion, and an NLLB model for translation. The whisper-base model is optimized for balanced speed and accuracy, handling accents and background noise much better than smaller models.

## 2. Project Setup (5 mins)

First, let's create a new Next.js project and install the required library:

```bash
# Create a new Next.js app
npx create-next-app@latest audio-transcription-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Navigate to the project directory
cd audio-transcription-app

# Install the Transformers.js library
npm install @xenova/transformers
```

## 3. The Audio Processor Component (40 mins)

Now, let's create the main component that handles audio processing. Create a new file called `components/AudioProcessor.jsx`:

```jsx
'use client';

import { useState, useRef } from 'react';
import { pipeline } from '@xenova/transformers';

export default function AudioProcessor() {
  // State management for our component
  const [audioFile, setAudioFile] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState('hi'); // Default to Hindi
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Language options for translation
  const languageOptions = [
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' }
  ];

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
        setError('');
      } else {
        setError('Please select a valid audio file');
      }
    }
  };

  // Main processing function
  const handleTranscribe = async () => {
    if (!audioFile) {
      setError('Please select an audio file first');
      return;
    }

    setIsProcessing(true);
    setError('');
    setResult('');

    try {
      // Step 1: Load the Whisper pipeline
      // This downloads the model on first use (~142MB)
      console.log('Loading Whisper model...');
      const transcriber = await pipeline(
        'automatic-speech-recognition',
        'Xenova/whisper-base'
      );

      // Step 2: Convert audio file to the format expected by the model
      const audioData = await audioFile.arrayBuffer();
      const audioArray = new Float32Array(audioData);

      // Step 3: Process the audio with transcription and translation
      console.log('Processing audio...');
      const output = await transcriber(audioArray, {
        language: targetLanguage, // Target language for translation
        task: 'transcribe' // or 'translate' for translation
      });

      // Step 4: Display the result
      setResult(output.text);
      console.log('Transcription complete:', output.text);

    } catch (err) {
      console.error('Error during processing:', err);
      setError(`Processing failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Offline Audio Transcription & Translation
      </h1>
      
      {/* File Upload Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Audio File
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {audioFile && (
          <p className="mt-2 text-sm text-green-600">
            Selected: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      {/* Language Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Language
        </label>
        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {languageOptions.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Transcribe Button */}
      <div className="mb-6">
        <button
          onClick={handleTranscribe}
          disabled={!audioFile || isProcessing}
          className={`w-full py-3 px-4 rounded-md font-medium ${
            !audioFile || isProcessing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          }`}
        >
          {isProcessing ? 'Processing...' : 'Transcribe & Translate'}
        </button>
      </div>

      {/* Progress Indicator */}
      {isProcessing && (
        <div className="mb-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              {result === '' ? 'Loading model and processing audio...' : 'Processing audio...'}
            </span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Transcription Result:</h3>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-gray-800 whitespace-pre-wrap">{result}</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-600">
        <h3 className="font-medium mb-2">How to use:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Select an audio file (MP3, WAV, M4A, etc.)</li>
          <li>Choose your target language</li>
          <li>Click "Transcribe & Translate"</li>
          <li>Wait for processing (first time may take longer to download the model)</li>
        </ol>
      </div>
    </div>
  );
}
```

## 4. Final Integration & Testing (10 mins)

Now, let's integrate our component into the main page. Update your `app/page.js` file:

```jsx
import AudioProcessor from './components/AudioProcessor';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <AudioProcessor />
      </div>
    </main>
  );
}
```

Also, update your `app/layout.js` to ensure proper styling:

```jsx
import './globals.css';

export const metadata = {
  title: 'Audio Transcription & Translation',
  description: 'Offline audio transcription and translation using AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
```

Now run your application:

```bash
npm run dev
```

Open your browser to `http://localhost:3000` and test the application:

1. **Test with a short audio file** (30 seconds or less for faster processing)
2. **Try different languages** to see translation capabilities
3. **Check the browser console** for processing logs
4. **Verify offline functionality** by disconnecting from the internet after the first model download

## 5. Next Steps & What You Learned

**Model Performance Trade-offs:**
- `whisper-tiny`: Fast, small (~40MB), good for quick demos and basic transcription
- `whisper-base`: Balanced speed and accuracy (~142MB), excellent for production use ✅ **Currently Using**
- `whisper-small`: Even more accurate (~461MB), but takes longer to load

**What You've Accomplished:**
Congratulations! You've successfully implemented a sophisticated, offline AI feature in a web application. This demonstrates:

- **Client-side AI processing** without server dependencies
- **Real-time audio transcription** using state-of-the-art models
- **Multi-language translation** capabilities
- **Modern React patterns** with hooks and async processing
- **User-friendly interface** with progress indicators and error handling

**Next Steps for Production:**
- Consider using `whisper-base` or `whisper-small` for better accuracy
- Add audio format validation and conversion
- Implement audio recording directly in the browser
- Add support for longer audio files with chunking
- Implement result saving and export functionality

This proof-of-concept shows the power of modern web technologies combined with AI, enabling sophisticated features that run entirely in the browser!
