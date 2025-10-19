'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, Square } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export default function VoiceRecorder({ onTranscript, className = '' }: VoiceRecorderProps) {
  const { isListening, isRecording, transcript, startListening, stopListening, resetTranscript, isSupported } = useSpeechRecognition();
  const [recordingTime, setRecordingTime] = useState(0);

  // Update parent with transcript
  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
      resetTranscript();
    }
  }, [transcript, onTranscript, resetTranscript]);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggle = () => {
    if (!isSupported) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      // Reset transcript before starting
      resetTranscript();
      startListening();
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {isRecording && (
        <div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-full animate-pulse">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
          <span className="text-red-600 text-sm font-medium">
            Recording {formatTime(recordingTime)}
          </span>
          <Volume2 className="w-4 h-4 text-red-500" />
        </div>
      )}
      
      <Button
        type="button"
        onClick={handleToggle}
        className={`w-10 h-10 rounded-full p-0 transition-all duration-200 ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg' 
            : 'bg-purple-gradient hover:opacity-90 shadow-md'
        }`}
      >
        {isRecording ? (
          <Square className="w-4 h-4 text-white" />
        ) : (
          <Mic className="w-4 h-4 text-white" />
        )}
      </Button>
    </div>
  );
}
