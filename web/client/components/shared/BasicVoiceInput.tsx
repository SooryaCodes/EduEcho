'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface BasicVoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export default function BasicVoiceInput({ onTranscript, className = '' }: BasicVoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    // Simple timer
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    // Stop after 10 seconds or when user clicks stop
    setTimeout(() => {
      if (isRecording) {
        stopRecording();
      }
    }, 10000);

    // Store interval for cleanup
    (window as any).recordingInterval = interval;
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    // Clear interval
    if ((window as any).recordingInterval) {
      clearInterval((window as any).recordingInterval);
      (window as any).recordingInterval = null;
    }

    // Simulate transcription with actual text
    const sampleTexts = [
      "This is a voice note about the topic we discussed.",
      "I want to add this important information to my notes.",
      "Here are my thoughts on this subject matter.",
      "This is a voice recording for my notebook.",
      "I'm recording my ideas about this topic."
    ];

    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    
    // Add timestamp
    const timestamp = new Date().toLocaleTimeString();
    const finalText = `[Voice Note - ${timestamp}] ${randomText}`;
    
    onTranscript(finalText);
  };

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
        onClick={isRecording ? stopRecording : startRecording}
        className={`w-10 h-10 rounded-full p-0 transition-all duration-200 ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg' 
            : 'bg-purple-gradient hover:opacity-90 shadow-md'
        }`}
      >
        {isRecording ? (
          <MicOff className="w-4 h-4 text-white" />
        ) : (
          <Mic className="w-4 h-4 text-white" />
        )}
      </Button>
    </div>
  );
}
