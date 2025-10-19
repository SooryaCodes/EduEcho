'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';

interface WhisperVoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export default function WhisperVoiceInput({ onTranscript, className = '' }: WhisperVoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });

      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      setAudioChunks(chunks);

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('language', 'en');

      console.log('🎤 Sending audio to Whisper API...');
      
      // Use relative URL to avoid CORS issues
      const response = await fetch('/api/v1/ai/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data.transcript) {
        console.log('✅ Transcription successful:', result.data.transcript);
        onTranscript(result.data.transcript);
      } else {
        throw new Error('No transcript received');
      }

    } catch (error) {
      console.error('❌ Transcription failed:', error);
      
      // Fallback: Try browser Web Speech API as backup
      try {
        console.log('🔄 Trying Web Speech API as fallback...');
        await fallbackWebSpeechAPI();
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
        onTranscript('[Voice recorded successfully! Transcription temporarily unavailable.]');
      }
    } finally {
      setIsTranscribing(false);
    }
  };

  const fallbackWebSpeechAPI = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        reject(new Error('Web Speech API not supported'));
        return;
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('✅ Web Speech API fallback successful:', transcript);
        onTranscript(transcript);
        resolve();
      };

      recognition.onerror = (event: any) => {
        console.error('❌ Web Speech API fallback failed:', event.error);
        reject(new Error(`Web Speech API error: ${event.error}`));
      };

      recognition.onend = () => {
        console.log('🎤 Web Speech API ended');
      };

      try {
        recognition.start();
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {(isRecording || isTranscribing) && (
        <div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-full animate-pulse">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
          <span className="text-red-600 text-sm font-medium">
            {isRecording ? `Recording ${formatTime(recordingTime)}` : 'Transcribing...'}
          </span>
          {isTranscribing ? (
            <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
          ) : (
            <Volume2 className="w-4 h-4 text-red-500" />
          )}
        </div>
      )}
      
      <Button
        type="button"
        onClick={handleToggle}
        disabled={isTranscribing}
        className={`w-10 h-10 rounded-full p-0 transition-all duration-200 ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg' 
            : isTranscribing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-purple-gradient hover:opacity-90 shadow-md'
        }`}
      >
        {isTranscribing ? (
          <Loader2 className="w-4 h-4 text-white animate-spin" />
        ) : isRecording ? (
          <MicOff className="w-4 h-4 text-white" />
        ) : (
          <Mic className="w-4 h-4 text-white" />
        )}
      </Button>
    </div>
  );
}
