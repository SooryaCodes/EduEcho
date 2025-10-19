'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  RotateCcw,
  Mic,
  Waveform
} from 'lucide-react';

interface VoicePlayerProps {
  audioUrl: string;
  transcript?: string;
  duration?: number;
  waveformData?: number[];
  className?: string;
  showTranscript?: boolean;
  showAnalysis?: boolean;
  voiceAnalysis?: any;
}

export default function VoicePlayer({
  audioUrl,
  transcript,
  duration,
  waveformData,
  className = '',
  showTranscript = true,
  showAnalysis = false,
  voiceAnalysis
}: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration || 0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setAudioDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = (value[0] / 100) * audioDuration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const changePlaybackRate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const rates = [1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    
    audio.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const resetAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
    audio.pause();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

  return (
    <div className={`bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 space-y-3 ${className}`}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Main Player Controls */}
      <div className="flex items-center space-x-3">
        {/* Play/Pause Button */}
        <Button
          onClick={togglePlayPause}
          size="sm"
          className="w-10 h-10 rounded-full bg-purple-gradient text-white hover:opacity-90 flex-shrink-0"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </Button>

        {/* Waveform or Progress */}
        <div className="flex-1 space-y-1">
          {waveformData ? (
            <div className="flex items-center space-x-1 h-8">
              {waveformData.map((height, index) => (
                <div
                  key={index}
                  className={`w-1 bg-purple-400 rounded-full transition-all duration-200 ${
                    (index / waveformData.length) * 100 <= progress
                      ? 'bg-purple-600'
                      : 'bg-purple-200'
                  }`}
                  style={{ height: `${Math.max(height * 24, 4)}px` }}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              <Progress 
                value={progress} 
                className="h-2 cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const percentage = (x / rect.width) * 100;
                  handleSeek([percentage]);
                }}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(audioDuration)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Additional Controls */}
        <div className="flex items-center space-x-1">
          <Button
            onClick={changePlaybackRate}
            size="sm"
            variant="ghost"
            className="text-xs font-mono px-2 h-8"
          >
            {playbackRate}x
          </Button>
          
          <Button
            onClick={toggleMute}
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>

          <Button
            onClick={resetAudio}
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Voice Analysis Preview */}
      {showAnalysis && voiceAnalysis && (
        <div className="flex items-center space-x-2 text-xs">
          <Mic className="w-3 h-3 text-purple-600" />
          <span className="text-gray-600">Analysis:</span>
          <Badge variant="outline" className="text-xs">
            🎧 {voiceAnalysis.clarity?.score || 0}
          </Badge>
          <Badge variant="outline" className="text-xs">
            🎤 {voiceAnalysis.confidence?.score || 0}
          </Badge>
          <Badge variant="outline" className="text-xs">
            🧠 {voiceAnalysis.depth?.score || 0}
          </Badge>
          <Badge variant="outline" className="text-xs">
            📊 {voiceAnalysis.overall?.score || 0}
          </Badge>
        </div>
      )}

      {/* Transcript */}
      {showTranscript && transcript && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600 flex items-center">
              <Waveform className="w-3 h-3 mr-1" />
              Transcript
            </span>
            {transcript.length > 100 && (
              <Button
                onClick={() => setShowFullTranscript(!showFullTranscript)}
                size="sm"
                variant="ghost"
                className="text-xs h-6 px-2"
              >
                {showFullTranscript ? 'Show less' : 'Show more'}
              </Button>
            )}
          </div>
          <div className="bg-white/60 rounded-lg p-3 text-sm text-gray-700">
            {showFullTranscript || transcript.length <= 100
              ? transcript
              : `${transcript.substring(0, 100)}...`
            }
          </div>
        </div>
      )}
    </div>
  );
}
