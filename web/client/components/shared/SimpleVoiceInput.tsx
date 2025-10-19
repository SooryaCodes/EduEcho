'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface SimpleVoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export default function SimpleVoiceInput({ onTranscript, className = '' }: SimpleVoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        
        // Try Web Speech API as fallback for transcription
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = 'en-US';
          
          recognition.onresult = (event: any) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
              transcript += event.results[i][0].transcript;
            }
            onTranscript(transcript);
          };
          
          recognition.onerror = (event: any) => {
            console.log('Speech recognition failed, using fallback');
            onTranscript("Voice recorded successfully! Please type your message manually.");
          };
          
          recognition.start();
        } else {
          // Fallback message
          onTranscript("Voice recorded successfully! Please type your message manually.");
        }
        
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  // Recording timer
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

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
