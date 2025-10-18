# Audio Transcription & Translation POC

A proof-of-concept application that demonstrates offline audio transcription and translation using Hugging Face Transformers.js and the Whisper model. This application runs entirely in the browser without requiring any server-side processing.

## Features

- 🎵 **Audio File Upload**: Support for various audio formats (MP3, WAV, M4A, etc.)
- 🌍 **Multi-language Support**: Transcription and translation to multiple languages
- 🚀 **Offline Processing**: All AI processing happens in the browser
- 🔒 **Privacy-First**: No data sent to external servers
- ⚡ **Fast Processing**: Optimized for quick transcription and translation

## Supported Languages

- Hindi (hi)
- Tamil (ta)
- Malayalam (ml)
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Japanese (ja)
- Korean (ko)
- Chinese (zh)

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Modern web browser with WebAssembly support

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd ml
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## How to Use

### Two-Step Process:

**Step 1: Transcribe Audio**
1. **Upload Audio File**: Click "Select Audio File" and choose an audio file from your device
2. **Transcribe**: Click "Transcribe Audio" to convert speech to text
3. **View Original Text**: See the transcribed text in the original language

**Step 2: Translate Text**
4. **Select Target Language**: Choose your target language from the dropdown (Hindi, Tamil, Malayalam, etc.)
5. **Translate**: Click "Translate to [Language]" to translate the transcribed text
6. **View Translation**: See the translated text in your selected language

**Bonus:** You can translate to multiple languages without re-transcribing the audio!

## Testing the Application

### Recommended Test Files

- **Short audio clips** (30 seconds or less) for faster processing
- **Clear speech** without heavy background noise
- **Various languages** to test translation capabilities

### Test Scenarios

1. **English to Hindi**: Upload an English audio file and select Hindi as target language
2. **Multi-language**: Try different source languages with various target languages
3. **Offline Testing**: Disconnect from internet after first model download to verify offline functionality

## Technical Details

### Models Information

**Transcription Model:**
- **Model**: `Xenova/whisper-base`
- **Size**: ~142MB (downloaded on first use)
- **Performance**: Balanced speed and accuracy, good for production use
- **Accuracy**: Better than tiny model, handles accents and background noise well

**Translation Model:**
- **Model**: `Xenova/nllb-200-distilled-600M`
- **Size**: ~600MB (downloaded on first translation)
- **Performance**: Moderate speed, supports 200 languages
- **Accuracy**: Good quality translations between supported languages

### Browser Requirements

- **WebAssembly Support**: Required for running the AI model
- **Modern Browser**: Chrome 88+, Firefox 78+, Safari 14+, Edge 88+
- **Memory**: At least 2GB RAM recommended for smooth processing

### Performance Notes

- **First Run**: Model download takes 2-3 minutes depending on internet speed
- **Subsequent Runs**: Much faster as model is cached in browser
- **Processing Time**: Typically 3-5 seconds for 30-second audio clips
- **Memory Usage**: ~300-400MB during processing

## Troubleshooting

### Common Issues

1. **Model Loading Fails**
   - Check internet connection for initial download
   - Ensure browser supports WebAssembly
   - Try refreshing the page

2. **Processing Errors**
   - Verify audio file format is supported
   - Check file size (recommend under 10MB for best performance)
   - Ensure audio has clear speech content

3. **Slow Performance**
   - Use shorter audio files for testing
   - Close other browser tabs to free up memory
   - Consider using a more powerful device

### Browser Console

Check the browser console (F12 → Console) for detailed error messages and processing logs.

## Development

### Project Structure

```
ml/
├── TUTORIAL.md          # Complete step-by-step tutorial
├── README.md            # This file
├── package.json         # Dependencies and scripts
├── next.config.js       # Next.js configuration
├── jsconfig.json        # JavaScript configuration
├── app/
│   ├── page.js         # Main entry point
│   ├── layout.js       # App layout
│   └── globals.css     # Global styles
└── components/
    └── AudioProcessor.jsx  # Core component
```

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## Next Steps

### For Production Use

1. **Upgrade Model**: Consider using `whisper-base` or `whisper-small` for better accuracy
2. **Audio Recording**: Add browser-based audio recording functionality
3. **File Management**: Implement result saving and export features
4. **Performance**: Add audio chunking for longer files
5. **UI/UX**: Enhance the interface with better progress indicators and error handling

### Model Alternatives

- **whisper-base**: More accurate, ~150MB, slower loading
- **whisper-small**: Even more accurate, ~500MB, much slower loading
- **whisper-medium**: Best accuracy, ~1.5GB, very slow loading

## License

This project is for educational and demonstration purposes. The Whisper model is provided by OpenAI and used under their terms of service.

## Support

For issues and questions:
1. Check the browser console for error messages
2. Verify all prerequisites are met
3. Test with different audio files and formats
4. Ensure stable internet connection for initial model download
