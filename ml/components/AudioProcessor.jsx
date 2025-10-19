'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { pipeline } from '@xenova/transformers';

export default function AudioProcessor() {
  // State management for our component
  const [audioFile, setAudioFile] = useState(null);
  const [sourceLanguage, setSourceLanguage] = useState('auto'); // Input language (auto-detect by default)
  const [targetLanguage, setTargetLanguage] = useState('hi'); // Default to Hindi
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState(''); // Store detected language
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const [notification, setNotification] = useState(null);
  const notificationTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  // Language options for input audio (transcription source)
  const sourceLanguageOptions = [
    { code: 'auto', name: 'Auto-Detect' },
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'te', name: 'Telugu' },
    { code: 'bn', name: 'Bengali' },
    { code: 'mr', name: 'Marathi' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'kn', name: 'Kannada' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'ur', name: 'Urdu' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'tr', name: 'Turkish' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'th', name: 'Thai' },
    { code: 'nl', name: 'Dutch' },
    { code: 'pl', name: 'Polish' },
    { code: 'id', name: 'Indonesian' }
  ];

  // Language options for translation (target)
  const targetLanguageOptions = [
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'te', name: 'Telugu' },
    { code: 'bn', name: 'Bengali' },
    { code: 'mr', name: 'Marathi' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'kn', name: 'Kannada' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'ur', name: 'Urdu' },
    { code: 'ar', name: 'Arabic' },
    { code: 'ru', name: 'Russian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'it', name: 'Italian' },
    { code: 'tr', name: 'Turkish' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'th', name: 'Thai' }
  ];

  // Memoized target language name to prevent repeated lookups
  const targetLanguageName = useMemo(() => {
    return targetLanguageOptions.find(lang => lang.code === targetLanguage)?.name || 'Unknown';
  }, [targetLanguage]);

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      // Clear notification timeout on unmount
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  // Notification system - Fixed to prevent memory leaks
  const showNotification = (message, type = 'info', duration = 4000) => {
    // Clear any existing timeout
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    
    setNotification({ message, type, duration });
    
    // Store timeout reference for cleanup
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification(null);
      notificationTimeoutRef.current = null;
    }, duration);
  };

  const getNotificationStyles = (type) => {
    const baseStyles = "fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ease-in-out";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-500 text-white border-l-4 border-green-600`;
      case 'error':
        return `${baseStyles} bg-red-500 text-white border-l-4 border-red-600`;
      case 'warning':
        return `${baseStyles} bg-yellow-500 text-white border-l-4 border-yellow-600`;
      case 'info':
        return `${baseStyles} bg-blue-500 text-white border-l-4 border-blue-600`;
      default:
        return `${baseStyles} bg-gray-500 text-white border-l-4 border-gray-600`;
    }
  };

  // Handle file selection - Enhanced with comprehensive validation
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        setError('Please select a valid audio file (MP3, WAV, M4A, etc.)');
        showNotification('Invalid file type. Please select an audio file.', 'error', 4000);
        return;
      }
      
      // Validate file size (max 100MB)
      const maxSize = 100 * 1024 * 1024; // 100MB in bytes
      if (file.size > maxSize) {
        setError('File too large. Please select a file under 100MB.');
        showNotification('File too large. Maximum size is 100MB.', 'error', 4000);
        return;
      }
      
      // Validate minimum file size (1KB)
      if (file.size < 1024) {
        setError('File too small. Please select a valid audio file.');
        showNotification('File too small. Please select a valid audio file.', 'error', 4000);
        return;
      }
      
      // File is valid
      setAudioFile(file);
      setError('');
      setTranscribedText('');
      setTranslatedText('');
      setDetectedLanguage('');
      showNotification(`Audio file selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`, 'success', 3000);
    }
  };

  // Step 1: Transcribe audio to text
  const handleTranscribe = async () => {
    if (!audioFile) {
      setError('Please select an audio file first');
      showNotification('Please select an audio file first', 'warning', 3000);
      return;
    }

    setIsTranscribing(true);
    setError('');
    setTranscribedText('');
    setTranslatedText('');
    setDetectedLanguage('');
    setProgress('Initializing...');
    showNotification('Starting transcription...', 'info', 2000);

    try {
      // Load the Whisper pipeline for transcription
      setProgress('Loading Whisper model (this may take a moment on first use)...');
      showNotification('Loading Whisper-base model (first time may take longer)...', 'info', 5000);
      console.log('Loading Whisper model...');
      
      const transcriber = await pipeline(
        'automatic-speech-recognition',
        'Xenova/whisper-base'
      );

      // Convert audio file to URL for processing
      setProgress('Processing audio file...');
      showNotification('Processing audio file...', 'info', 2000);
      
      // Create a temporary URL for the audio file
      // Transformers.js will handle all audio preprocessing internally
      const audioUrl = URL.createObjectURL(audioFile);
      
      try {
        // Transcribe the audio
        const isAutoDetect = sourceLanguage === 'auto';
        setProgress(isAutoDetect ? 'Transcribing audio (auto-detecting language)...' : `Transcribing audio (${sourceLanguage.toUpperCase()})...`);
        showNotification('Transcribing speech to text...', 'info', 3000);
        console.log('Transcribing audio with language:', sourceLanguage);
        
        // Build transcription options
        const transcriptionOptions = {
          task: 'transcribe', // Transcribe in the original language
          chunk_length_s: 30, // Process in 30-second chunks
          stride_length_s: 5, // Overlap between chunks
          return_timestamps: true, // Get timestamps
        };
        
        // If user selected a specific language, pass it to Whisper
        if (!isAutoDetect) {
          transcriptionOptions.language = sourceLanguage;
        }
        
        const output = await transcriber(audioUrl, transcriptionOptions);
        
        // Log the full output to debug structure
        console.log('Full Whisper output:', output);
        
        // Determine the language used for transcription
        let detected = 'en'; // Default to English
        
        if (!isAutoDetect) {
          // User manually selected the language
          detected = sourceLanguage;
          console.log('Using manually selected language:', detected);
        } else {
          // Try to auto-detect language from Whisper output
          // Check multiple possible locations for language information
          if (output.chunks && output.chunks.length > 0 && output.chunks[0].language) {
            detected = output.chunks[0].language;
          } else if (output.language) {
            detected = output.language;
          } else if (output.chunks && output.chunks.length > 0) {
            // Check if language is in chunk metadata
            const chunk = output.chunks[0];
            detected = chunk.language || chunk.lang || 'en';
          }
          
          // For now, detect language from the text content as fallback
          // Check if text uses non-Latin scripts to infer language
          if (detected === 'en' && output.text) {
            detected = inferLanguageFromText(output.text);
          }
          console.log('Auto-detected language:', detected);
        }
        
        setDetectedLanguage(detected);
        
        // Display the transcribed text
        setTranscribedText(output.text);
        setProgress('Transcription complete!');
        
        const langDisplay = isAutoDetect 
          ? `Auto-detected: ${detected.toUpperCase()}` 
          : `Language: ${detected.toUpperCase()} (Manual)`;
        showNotification(`✅ Transcription successful! ${langDisplay}`, 'success', 5000);
        console.log('Transcription complete:', output.text);
        console.log('Final language:', detected);
        
      } catch (transcribeErr) {
        throw transcribeErr; // Re-throw to outer catch
      } finally {
        // Always clean up the URL to prevent memory leaks
        URL.revokeObjectURL(audioUrl);
      }

    } catch (err) {
      console.error('Error during transcription:', err);
      setError(`Transcription failed: ${err.message}`);
      setProgress('');
      showNotification(`❌ Transcription failed: ${err.message}`, 'error', 6000);
    } finally {
      setIsTranscribing(false);
    }
  };

  // Step 2: Translate the transcribed text
  const handleTranslate = async () => {
    if (!transcribedText) {
      setError('Please transcribe audio first');
      showNotification('Please transcribe audio first', 'warning', 3000);
      return;
    }

    setIsTranslating(true);
    setError('');
    setTranslatedText('');
    setProgress('Initializing translation...');
    showNotification('Starting translation...', 'info', 2000);

    try {
      // Load the translation pipeline
      setProgress('Loading translation model...');
      showNotification('Loading translation model (this may take longer on first use)...', 'info', 8000);
      console.log('Loading translation model...');
      
      const translator = await pipeline(
        'translation',
        'Xenova/nllb-200-distilled-600M'
      );

      // Translate the text to target language
      setProgress(`Translating to ${targetLanguageName}...`);
      showNotification(`Translating to ${targetLanguageName}...`, 'info', 3000);
      console.log('Translating text...');
      
      const output = await translator(transcribedText, {
        src_lang: whisperToNLLB(detectedLanguage), // Use detected language from transcription
        tgt_lang: getLanguageCode(targetLanguage) // Target language
      });

      // Display the translated text
      setTranslatedText(output[0].translation_text);
      setProgress('Translation complete!');
      showNotification(`✅ Translation successful! Translated to ${targetLanguageName}`, 'success', 5000);
      console.log('Translation complete:', output[0].translation_text);

    } catch (err) {
      console.error('Error during translation:', err);
      setError(`Translation failed: ${err.message}. Note: Translation model is larger and may take time to download.`);
      setProgress('');
      showNotification(`❌ Translation failed: ${err.message}`, 'error', 6000);
    } finally {
      setIsTranslating(false);
    }
  };

  // Helper function to convert language code to NLLB format (target language)
  const getLanguageCode = (code) => {
    const mapping = {
      'hi': 'hin_Deva',
      'ta': 'tam_Taml',
      'ml': 'mal_Mlym',
      'en': 'eng_Latn',
      'es': 'spa_Latn',
      'fr': 'fra_Latn',
      'de': 'deu_Latn',
      'ja': 'jpn_Jpan',
      'ko': 'kor_Hang',
      'zh': 'zho_Hans',
      'te': 'tel_Telu',
      'bn': 'ben_Beng',
      'mr': 'mar_Deva',
      'gu': 'guj_Gujr',
      'kn': 'kan_Knda',
      'pa': 'pan_Guru',
      'ur': 'urd_Arab',
      'ar': 'arb_Arab',
      'ru': 'rus_Cyrl',
      'pt': 'por_Latn',
      'it': 'ita_Latn',
      'tr': 'tur_Latn',
      'vi': 'vie_Latn',
      'th': 'tha_Thai'
    };
    return mapping[code] || 'eng_Latn';
  };

  // Helper function to infer language from text content based on script
  const inferLanguageFromText = (text) => {
    if (!text || text.trim().length === 0) return 'en';
    
    // Check for different scripts/characters
    const devanagari = /[\u0900-\u097F]/; // Hindi, Marathi, Sanskrit
    const tamil = /[\u0B80-\u0BFF]/;
    const malayalam = /[\u0D00-\u0D7F]/;
    const bengali = /[\u0980-\u09FF]/;
    const telugu = /[\u0C00-\u0C7F]/;
    const kannada = /[\u0C80-\u0CFF]/;
    const gujarati = /[\u0A80-\u0AFF]/;
    const gurmukhi = /[\u0A00-\u0A7F]/; // Punjabi
    const arabic = /[\u0600-\u06FF]/;
    const chinese = /[\u4E00-\u9FFF]/;
    const japanese = /[\u3040-\u309F\u30A0-\u30FF]/; // Hiragana + Katakana
    const korean = /[\uAC00-\uD7AF]/;
    const thai = /[\u0E00-\u0E7F]/;
    const cyrillic = /[\u0400-\u04FF]/; // Russian, Ukrainian, etc.
    
    // Test for each script
    if (devanagari.test(text)) return 'hi'; // Default to Hindi for Devanagari
    if (tamil.test(text)) return 'ta';
    if (malayalam.test(text)) return 'ml';
    if (bengali.test(text)) return 'bn';
    if (telugu.test(text)) return 'te';
    if (kannada.test(text)) return 'kn';
    if (gujarati.test(text)) return 'gu';
    if (gurmukhi.test(text)) return 'pa';
    if (arabic.test(text)) return 'ar';
    if (chinese.test(text)) return 'zh';
    if (japanese.test(text)) return 'ja';
    if (korean.test(text)) return 'ko';
    if (thai.test(text)) return 'th';
    if (cyrillic.test(text)) return 'ru';
    
    // Default to English for Latin script
    return 'en';
  };

  // Helper function to convert Whisper detected language to NLLB format
  const whisperToNLLB = (whisperLang) => {
    const mapping = {
      'en': 'eng_Latn',
      'hi': 'hin_Deva',
      'ta': 'tam_Taml',
      'ml': 'mal_Mlym',
      'es': 'spa_Latn',
      'fr': 'fra_Latn',
      'de': 'deu_Latn',
      'ja': 'jpn_Jpan',
      'ko': 'kor_Hang',
      'zh': 'zho_Hans',
      'ar': 'arb_Arab',
      'ru': 'rus_Cyrl',
      'pt': 'por_Latn',
      'it': 'ita_Latn',
      'nl': 'nld_Latn',
      'pl': 'pol_Latn',
      'tr': 'tur_Latn',
      'id': 'ind_Latn',
      'vi': 'vie_Latn',
      'th': 'tha_Thai',
      'bn': 'ben_Beng',
      'te': 'tel_Telu',
      'mr': 'mar_Deva',
      'ur': 'urd_Arab',
      'pa': 'pan_Guru',
      'gu': 'guj_Gujr',
      'kn': 'kan_Knda',
    };
    return mapping[whisperLang] || 'eng_Latn'; // Default to English if unknown
  };

  // Reset function
  const handleReset = () => {
    setAudioFile(null);
    setTranscribedText('');
    setTranslatedText('');
    setDetectedLanguage('');
    setError('');
    setProgress('');
    setNotification(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showNotification('Application reset successfully', 'info', 3000);
  };

  return (
    <>
      {/* Notification Popup */}
      {notification && (
        <div className={getNotificationStyles(notification.type)}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {notification.type === 'success' && (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {notification.type === 'error' && (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {notification.type === 'warning' && (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {notification.type === 'info' && (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setNotification(null)}
                className="inline-flex text-white hover:text-gray-200 focus:outline-none"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Offline Audio Transcription & Translation
        </h1>
        <p className="text-center text-gray-600 mb-8">Two-step process: Transcribe first, then translate</p>
      
      {/* Step 1: File Upload and Transcription */}
      <div className="mb-8 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Step 1: Upload & Transcribe Audio</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Audio File
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
          {audioFile && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600 text-sm">
                <strong>Selected:</strong> {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Input Language
          </label>
          <select
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isTranscribing}
          >
            {sourceLanguageOptions.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            {sourceLanguage === 'auto' 
              ? '🔍 Whisper will automatically detect the language' 
              : '✓ Transcription will be optimized for the selected language'}
          </p>
        </div>

        <button
          onClick={handleTranscribe}
          disabled={!audioFile || isTranscribing}
          className={`w-full py-3 px-4 rounded-md font-medium ${
            !audioFile || isTranscribing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          }`}
        >
          {isTranscribing ? 'Transcribing...' : 'Transcribe Audio'}
        </button>

        {/* Transcription Progress */}
        {isTranscribing && (
          <div className="mt-4">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">{progress}</span>
            </div>
          </div>
        )}

        {/* Transcribed Text Display */}
        {transcribedText && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Transcribed Text 
              {detectedLanguage && (
                <span className="ml-2 px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-full">
                  {sourceLanguage === 'auto' 
                    ? `Auto-detected: ${detectedLanguage.toUpperCase()}` 
                    : `Language: ${detectedLanguage.toUpperCase()}`}
                </span>
              )}
            </h3>
            <div className="p-4 bg-white border border-gray-300 rounded-md">
              <p className="text-gray-800 whitespace-pre-wrap">{transcribedText}</p>
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Translation */}
      {transcribedText && (
        <div className="mb-6 p-6 bg-green-50 rounded-lg border-2 border-green-200">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Step 2: Translate Text</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Target Language
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              disabled={isTranslating}
            >
              {targetLanguageOptions.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleTranslate}
            disabled={isTranslating}
            className={`w-full py-3 px-4 rounded-md font-medium ${
              isTranslating
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
            }`}
          >
            {isTranslating ? 'Translating...' : `Translate to ${targetLanguageName}`}
          </button>

          {/* Translation Progress */}
          {isTranslating && (
            <div className="mt-4">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-3 text-gray-600">{progress}</span>
              </div>
            </div>
          )}

          {/* Translated Text Display */}
          {translatedText && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Translated Text ({targetLanguageName}):</h3>
              <div className="p-4 bg-white border border-gray-300 rounded-md">
                <p className="text-gray-800 whitespace-pre-wrap">{translatedText}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reset Button */}
      <div className="mb-6">
        <button
          onClick={handleReset}
          disabled={isTranscribing || isTranslating}
          className={`w-full px-4 py-3 rounded-md font-medium ${
            isTranscribing || isTranslating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500'
          }`}
        >
          Reset All
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-md border border-gray-200">
        <h3 className="font-medium mb-2 text-gray-800">How to use:</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li><strong>Step 1:</strong> Upload an audio file and click "Transcribe Audio" to convert speech to text</li>
          <li><strong>Step 2:</strong> After transcription, select your target language and click "Translate" to translate the text</li>
        </ol>
        <div className="mt-3 text-xs text-gray-600">
          <strong>Note:</strong> Models will download on first use (~40MB for transcription, ~600MB for translation). 
          Subsequent runs will be faster as models are cached in your browser.
        </div>
      </div>
    </div>
    </>
  );
}
