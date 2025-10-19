'use client';

import { useState, useCallback, useRef } from 'react';

interface SpeechRecognitionHook {
  isListening: boolean;
  isRecording: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
}

export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const retryCountRef = useRef(0);
  const isStartingRef = useRef(false);

  const isSupported = typeof window !== 'undefined' && 
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  const [isRecording, setIsRecording] = useState(false);

  const startListening = useCallback(() => {
    if (!isSupported) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    if (isListening || isStartingRef.current) {
      return;
    }

    isStartingRef.current = true;

    // Clear any existing recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    // Add a small delay to prevent rapid restarts
    setTimeout(() => {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
      
      recognition.continuous = false; // Changed to false to avoid network issues
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setIsRecording(true);
        isStartingRef.current = false;
        retryCountRef.current = 0; // Reset retry count on successful start
        console.log('🎤 Speech recognition started');
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(prev => prev + finalTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsRecording(false);
        isStartingRef.current = false;
        
        // Don't restart on any errors - let user manually retry
        console.log('Speech recognition failed - manual retry required');
      };

      recognition.onend = () => {
        setIsListening(false);
        setIsRecording(false);
        isStartingRef.current = false;
        console.log('🎤 Speech recognition ended');
      };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
        setIsRecording(false);
        isStartingRef.current = false;
      }
    }, 100); // Small delay to prevent rapid restarts
  }, [isSupported, isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setIsRecording(false);
      isStartingRef.current = false;
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    isRecording,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  };
};
