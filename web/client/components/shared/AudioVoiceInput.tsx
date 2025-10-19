'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, Loader2, Brain, Waveform } from 'lucide-react';
import VoiceAnalysisModal from './VoiceAnalysisModal';

interface AudioVoiceInputProps {
  onTranscript: (text: string) => void;
  onAudioData?: (audioBlob: Blob, transcript: string, analysis?: any) => void;
  className?: string;
  enableAnalysis?: boolean;
  showAnalysisModal?: boolean;
}

export default function AudioVoiceInput({ 
  onTranscript, 
  onAudioData,
  className = '',
  enableAnalysis = false,
  showAnalysisModal = false
}: AudioVoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [voiceAnalysis, setVoiceAnalysis] = useState<any>(null);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>('');
  const [showAnalysis, setShowAnalysis] = useState(false);
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
        const audioUrl = URL.createObjectURL(audioBlob);
        setCurrentAudioUrl(audioUrl);
        
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);

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

  const processAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    
    try {
      let transcript = '';
      let analysis = null;

      if (enableAnalysis) {
        // Use the analyze-voice endpoint for full analysis
        setIsAnalyzing(true);
        const analysisResult = await analyzeVoice(audioBlob);
        transcript = analysisResult.transcript;
        analysis = analysisResult.analysis;
        setVoiceAnalysis(analysis);
        setIsAnalyzing(false);
      } else {
        // Just transcribe
        transcript = await transcribeAudio(audioBlob);
      }

      setCurrentTranscript(transcript);
      onTranscript(transcript);
      
      // Pass audio data to parent if callback provided
      if (onAudioData) {
        onAudioData(audioBlob, transcript, analysis);
      }

      // Show analysis modal if enabled
      if (showAnalysisModal && analysis) {
        setShowAnalysis(true);
      }

    } catch (error) {
      console.error('❌ Audio processing failed:', error);
      
      // Fallback: Try browser Web Speech API
      try {
        console.log('🔄 Trying Web Speech API as fallback...');
        const fallbackTranscript = await fallbackWebSpeechAPI();
        setCurrentTranscript(fallbackTranscript);
        onTranscript(fallbackTranscript);
        
        if (onAudioData) {
          onAudioData(audioBlob, fallbackTranscript);
        }
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
        const errorMessage = '[Voice recorded successfully! Transcription temporarily unavailable.]';
        setCurrentTranscript(errorMessage);
        onTranscript(errorMessage);
        
        if (onAudioData) {
          onAudioData(audioBlob, errorMessage);
        }
      }
    } finally {
      setIsTranscribing(false);
      setIsAnalyzing(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('language', 'en');

    console.log('🎤 Sending audio to Whisper API...');
    
    const response = await fetch('/api/v1/ai/transcribe', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success && result.data.transcript) {
      console.log('✅ Transcription successful:', result.data.transcript);
      return result.data.transcript;
    } else {
      throw new Error('No transcript received');
    }
  };

  const analyzeVoice = async (audioBlob: Blob): Promise<{transcript: string, analysis: any}> => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('language', 'en');

    console.log('🧠 Sending audio for analysis...');
    
    const response = await fetch('/api/v1/ai/analyze-voice', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success && result.data.transcript) {
      console.log('✅ Voice analysis successful');
      return {
        transcript: result.data.transcript,
        analysis: result.data.analysis
      };
    } else {
      throw new Error('No analysis received');
    }
  };

  const fallbackWebSpeechAPI = async (): Promise<string> => {
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
        resolve(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('❌ Web Speech API fallback failed:', event.error);
        reject(new Error(`Web Speech API error: ${event.error}`));
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

  const getStatusText = () => {
    if (isRecording) return `Recording ${formatTime(recordingTime)}`;
    if (isTranscribing && isAnalyzing) return 'Analyzing voice...';
    if (isTranscribing) return 'Transcribing...';
    return '';
  };

  const getStatusIcon = () => {
    if (isRecording) return <Volume2 className="w-4 h-4 text-red-500" />;
    if (isAnalyzing) return <Brain className="w-4 h-4 text-purple-500 animate-pulse" />;
    if (isTranscribing) return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
    return null;
  };

  return (
    <>
      <div className={`flex items-center space-x-2 ${className}`}>
        {(isRecording || isTranscribing) && (
          <div className="flex items-center space-x-2 bg-gradient-to-r from-red-50 to-purple-50 px-3 py-1 rounded-full animate-pulse">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            <span className="text-red-600 text-sm font-medium">
              {getStatusText()}
            </span>
            {getStatusIcon()}
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

        {enableAnalysis && voiceAnalysis && (
          <Button
            onClick={() => setShowAnalysis(true)}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            <Brain className="w-3 h-3 mr-1" />
            View Analysis
          </Button>
        )}
      </div>

      {/* Voice Analysis Modal */}
      <VoiceAnalysisModal
        isOpen={showAnalysis}
        onClose={() => setShowAnalysis(false)}
        analysis={voiceAnalysis}
        transcript={currentTranscript}
        audioUrl={currentAudioUrl}
      />
    </>
  );
}
