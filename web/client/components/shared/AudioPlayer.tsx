'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, Languages } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  transcript?: string;
  className?: string;
  showTranslate?: boolean;
}

export default function AudioPlayer({ 
  audioUrl, 
  transcript, 
  className = '',
  showTranslate = false 
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnd = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnd);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100 ${className}`}>
      <audio ref={audioRef} src={audioUrl} />
      
      <div className="flex items-center space-x-3">
        <Button
          onClick={togglePlay}
          size="sm"
          className="w-10 h-10 rounded-full bg-purple-gradient hover:opacity-90 p-0"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4 text-white ml-0.5" />
          )}
        </Button>

        <div className="flex-1">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-gradient h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-gray-500" />
          
          {transcript && (
            <Button
              onClick={() => setShowTranscript(!showTranscript)}
              size="sm"
              variant="ghost"
              className="text-xs"
            >
              {showTranscript ? 'Hide' : 'Show'} Text
            </Button>
          )}

          {showTranslate && (
            <Button
              size="sm"
              variant="ghost"
              className="text-xs"
            >
              <Languages className="w-3 h-3 mr-1" />
              Translate
            </Button>
          )}
        </div>
      </div>

      {showTranscript && transcript && (
        <div className="mt-3 p-3 bg-white rounded-lg border text-sm text-gray-700">
          <div className="font-medium text-xs text-gray-500 mb-1">Transcript:</div>
          {transcript}
        </div>
      )}
    </div>
  );
}
