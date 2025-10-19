'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';

interface ClientVoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export default function ClientVoiceInput({ onTranscript, className = '' }: ClientVoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

  const isSupported = typeof window !== 'undefined' && 
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  const startListening = async () => {
    if (!isSupported) {
      onTranscript('Speech recognition is not supported in this browser. Please type your message manually.');
      return;
    }

    if (isListening) return;

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setIsProcessing(false);
        console.log('🎤 Voice recognition started');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('✅ Voice recognition successful:', transcript);
        onTranscript(transcript);
        setIsProcessing(false);
      };

      recognition.onerror = (event: any) => {
        console.error('❌ Voice recognition error:', event.error);
        setIsListening(false);
        setIsProcessing(false);
        
        let errorMessage = 'Voice recognition failed. ';
        switch (event.error) {
          case 'no-speech':
            errorMessage += 'No speech detected. Please try speaking again.';
            break;
          case 'not-allowed':
            errorMessage += 'Microphone access denied. Please allow microphone access.';
            break;
          case 'network':
            errorMessage += 'Network error. Please check your connection.';
            break;
          default:
            errorMessage += 'Please try again or type manually.';
        }
        onTranscript(errorMessage);
      };

      recognition.onend = () => {
        setIsListening(false);
        setIsProcessing(false);
        console.log('🎤 Voice recognition ended');
      };

      recognitionRef.current = recognition;
      recognition.start();
      
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setIsListening(false);
      setIsProcessing(false);
      onTranscript('Voice recognition failed to start. Please type your message manually.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsProcessing(true);
    }
  };

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {(isListening || isProcessing) && (
        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full animate-pulse">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
          <span className="text-blue-600 text-sm font-medium">
            {isListening ? 'Listening...' : 'Processing...'}
          </span>
          {isProcessing ? (
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          ) : (
            <Volume2 className="w-4 h-4 text-blue-500" />
          )}
        </div>
      )}
      
      <Button
        type="button"
        onClick={handleToggle}
        disabled={isProcessing}
        className={`w-10 h-10 rounded-full p-0 transition-all duration-200 ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg' 
            : isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 shadow-md'
        }`}
      >
        {isProcessing ? (
          <Loader2 className="w-4 h-4 text-white animate-spin" />
        ) : isListening ? (
          <MicOff className="w-4 h-4 text-white" />
        ) : (
          <Mic className="w-4 h-4 text-white" />
        )}
      </Button>

      {!isSupported && (
        <span className="text-xs text-gray-500">
          Voice input not supported in this browser
        </span>
      )}
    </div>
  );
}
