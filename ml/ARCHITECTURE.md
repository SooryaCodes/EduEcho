# Application Architecture

## Two-Step Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Step 1: Transcription                     │
│                       (Blue Section)                         │
├─────────────────────────────────────────────────────────────┤
│  1. Upload Audio File (MP3, WAV, M4A, etc.)                 │
│  2. Click "Transcribe Audio" Button                         │
│                                                              │
│     ┌──────────────────────────────────────┐               │
│     │   Whisper Tiny Model (~40MB)         │               │
│     │   - Speech Recognition                │               │
│     │   - Auto-detect Language              │               │
│     │   - Fast Processing                   │               │
│     └──────────────────────────────────────┘               │
│                                                              │
│  3. Display Transcribed Text (Original Language)            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Step 2: Translation                       │
│                      (Green Section)                         │
├─────────────────────────────────────────────────────────────┤
│  1. Select Target Language (Hindi/Tamil/Malayalam/etc.)     │
│  2. Click "Translate to [Language]" Button                  │
│                                                              │
│     ┌──────────────────────────────────────┐               │
│     │   NLLB-200 Model (~600MB)            │               │
│     │   - Text-to-Text Translation          │               │
│     │   - 200 Languages Supported           │               │
│     │   - High Quality Translation          │               │
│     └──────────────────────────────────────┘               │
│                                                              │
│  3. Display Translated Text (Target Language)               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
Audio File (User Upload)
    │
    ├──► AudioContext API
    │    (Browser Native)
    │
    ├──► Decode Audio Data
    │    (Convert to Float32Array)
    │
    ├──► Whisper Model Pipeline
    │    (Transformers.js)
    │
    └──► Transcribed Text (Original Language)
             │
             ├──► User Reviews Text
             │
             ├──► User Selects Target Language
             │
             ├──► NLLB Translation Model
             │    (Transformers.js)
             │
             └──► Translated Text (Target Language)
```

## Component Hierarchy

```
AudioProcessor Component
│
├── State Management (React useState)
│   ├── audioFile
│   ├── transcribedText
│   ├── translatedText
│   ├── targetLanguage
│   ├── isTranscribing
│   ├── isTranslating
│   ├── progress
│   └── error
│
├── Event Handlers
│   ├── handleFileChange()
│   ├── handleTranscribe()
│   ├── handleTranslate()
│   └── handleReset()
│
└── UI Sections
    ├── File Upload Input
    ├── Step 1: Transcription Section
    │   ├── Transcribe Button
    │   ├── Progress Indicator
    │   └── Transcribed Text Display
    │
    ├── Step 2: Translation Section (Conditional)
    │   ├── Language Selector
    │   ├── Translate Button
    │   ├── Progress Indicator
    │   └── Translated Text Display
    │
    ├── Reset Button
    ├── Error Display
    └── Instructions Panel
```

## Model Loading Strategy

### First-Time User Experience
```
1. User uploads audio
   └─► Click "Transcribe"
       └─► Download Whisper Model (~40MB, 30-60 seconds)
           └─► Cache in Browser
               └─► Transcribe Audio (2-5 seconds)
                   └─► Show Transcribed Text
                       
2. User selects language
   └─► Click "Translate"
       └─► Download NLLB Model (~600MB, 2-5 minutes)
           └─► Cache in Browser
               └─► Translate Text (5-15 seconds)
                   └─► Show Translated Text
```

### Returning User Experience
```
1. User uploads audio
   └─► Click "Transcribe"
       └─► Use Cached Whisper Model (instant)
           └─► Transcribe Audio (2-5 seconds)
               └─► Show Transcribed Text
                       
2. User selects language
   └─► Click "Translate"
       └─► Use Cached NLLB Model (instant)
           └─► Translate Text (5-15 seconds)
               └─► Show Translated Text
```

## Browser Storage

```
IndexedDB (Browser Cache)
│
├── Transformers.js Models
│   ├── whisper-tiny/
│   │   ├── model.onnx (~40MB)
│   │   ├── tokenizer.json
│   │   └── config.json
│   │
│   └── nllb-200-distilled-600M/
│       ├── model.onnx (~600MB)
│       ├── tokenizer.json
│       └── config.json
│
└── User Data (Temporary)
    ├── Audio File (session only)
    ├── Transcribed Text (session only)
    └── Translated Text (session only)
```

## Technology Stack

```
┌─────────────────────────────────────────┐
│           User Interface Layer           │
│  Next.js 15 + React 19 + Tailwind CSS   │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│        AI Processing Layer               │
│      Transformers.js (Hugging Face)      │
│  - Whisper Tiny (Transcription)          │
│  - NLLB-200 (Translation)                │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│         Browser Runtime Layer            │
│  - WebAssembly (ONNX Runtime)           │
│  - Web Audio API                         │
│  - IndexedDB (Model Caching)             │
└─────────────────────────────────────────┘
```

## Key Features

### ✅ Offline First
- Models cached in browser
- No server required
- Works without internet after initial download

### ✅ Privacy Focused
- All processing happens locally
- No data sent to external servers
- Audio never leaves the device

### ✅ Progressive Enhancement
- Step 2 only appears after Step 1 completes
- Users can translate multiple times without re-transcribing
- Clear visual feedback for each step

### ✅ Efficient Resource Usage
- Models load on-demand
- Translation model only downloads if user needs it
- Browser caching prevents redundant downloads

## Performance Characteristics

| Operation | First Time | Subsequent Times |
|-----------|-----------|------------------|
| Model Download (Whisper) | 30-60s | Instant (cached) |
| Model Download (NLLB) | 2-5 min | Instant (cached) |
| Audio Transcription | 2-5s | 2-5s |
| Text Translation | 5-15s | 5-15s |

## Supported Languages

The application uses language code mapping:

```javascript
Simple Code → NLLB Format
────────────────────────────
'hi' → 'hin_Deva'  (Hindi)
'ta' → 'tam_Taml'  (Tamil)
'ml' → 'mal_Mlym'  (Malayalam)
'en' → 'eng_Latn'  (English)
'es' → 'spa_Latn'  (Spanish)
'fr' → 'fra_Latn'  (French)
'de' → 'deu_Latn'  (German)
'ja' → 'jpn_Jpan'  (Japanese)
'ko' → 'kor_Hang'  (Korean)
'zh' → 'zho_Hans'  (Chinese)
```

## Error Handling

```
Error Types:
│
├── File Upload Errors
│   ├── Invalid file type
│   └── File too large
│
├── Transcription Errors
│   ├── Model loading failure
│   ├── Audio decoding failure
│   └── Processing failure
│
└── Translation Errors
    ├── Model loading failure
    ├── No transcribed text
    └── Processing failure

All errors displayed with:
- Clear error messages
- Suggested solutions
- Option to reset and try again
```

## Future Enhancements

Potential improvements for production:

1. **Audio Recording**: Add browser-based recording
2. **File Format Support**: Add more audio formats
3. **Batch Processing**: Process multiple files
4. **Language Detection**: Auto-detect source language
5. **Export Options**: Download results as text/JSON
6. **History**: Save previous transcriptions
7. **Model Selection**: Choose between model sizes
8. **Advanced Options**: Adjust temperature, beam size, etc.

