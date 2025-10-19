'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Volume2, 
  Mic, 
  Brain, 
  MessageSquare, 
  Heart, 
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Play,
  Pause
} from 'lucide-react';

interface VoiceAnalysis {
  clarity: {
    score: number;
    pronunciation: number;
    understandability: number;
    feedback: string;
  };
  confidence: {
    score: number;
    toneStability: number;
    energy: number;
    consistency: number;
  };
  depth: {
    score: number;
    conceptualCoverage: number;
    semanticRichness: number;
    feedback: string;
  };
  fluency: {
    score: number;
    smoothness: number;
    fillerWordRatio: number;
    wordPacing: number;
  };
  emotion: {
    score: number;
    expressiveness: number;
    engagement: number;
    sentiment: string;
  };
  overall: {
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  };
}

interface VoiceAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: VoiceAnalysis | null;
  transcript: string;
  audioUrl?: string;
}

export default function VoiceAnalysisModal({ 
  isOpen, 
  onClose, 
  analysis, 
  transcript, 
  audioUrl 
}: VoiceAnalysisModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!analysis) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4" />;
    if (score >= 60) return <AlertCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      setIsPlaying(true);
      audio.play();
      audio.onended = () => setIsPlaying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-2xl">
            <Mic className="w-6 h-6 text-purple-600" />
            <span>Voice Analysis Results</span>
            <Badge className={`ml-2 ${getScoreColor(analysis.overall.score)}`}>
              {analysis.overall.score}/100
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Audio Playback */}
          {audioUrl && (
            <Card className="p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={playAudio}
                    disabled={isPlaying}
                    className="bg-purple-gradient text-white hover:opacity-90"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'Playing...' : 'Play Recording'}
                  </Button>
                  <span className="text-sm text-gray-600">Listen to your voice recording</span>
                </div>
              </div>
            </Card>
          )}

          {/* Overall Score */}
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-yellow-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>Overall Performance</span>
              </h3>
              <div className="flex items-center space-x-2">
                {getScoreIcon(analysis.overall.score)}
                <span className="text-2xl font-bold">{analysis.overall.score}/100</span>
              </div>
            </div>
            <Progress value={analysis.overall.score} className="mb-4" />
            <p className="text-gray-700 mb-4">{analysis.overall.feedback}</p>
            
            {/* Strengths & Improvements */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {analysis.overall.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-green-600">• {strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-orange-700 mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Areas for Improvement
                </h4>
                <ul className="space-y-1">
                  {analysis.overall.improvements.map((improvement, index) => (
                    <li key={index} className="text-sm text-orange-600">• {improvement}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Detailed Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Clarity */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Volume2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">🎧 Clarity</h3>
                <Badge className={getScoreColor(analysis.clarity.score)}>
                  {analysis.clarity.score}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pronunciation</span>
                  <span>{analysis.clarity.pronunciation}/100</span>
                </div>
                <Progress value={analysis.clarity.pronunciation} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Understandability</span>
                  <span>{analysis.clarity.understandability}/100</span>
                </div>
                <Progress value={analysis.clarity.understandability} className="h-2" />
                <p className="text-xs text-gray-600 mt-2">{analysis.clarity.feedback}</p>
              </div>
            </Card>

            {/* Confidence */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Mic className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold">🎤 Confidence</h3>
                <Badge className={getScoreColor(analysis.confidence.score)}>
                  {analysis.confidence.score}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tone Stability</span>
                  <span>{analysis.confidence.toneStability}/100</span>
                </div>
                <Progress value={analysis.confidence.toneStability} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Energy</span>
                  <span>{analysis.confidence.energy}/100</span>
                </div>
                <Progress value={analysis.confidence.energy} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Consistency</span>
                  <span>{analysis.confidence.consistency}/100</span>
                </div>
                <Progress value={analysis.confidence.consistency} className="h-2" />
              </div>
            </Card>

            {/* Depth */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Brain className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold">🧠 Depth</h3>
                <Badge className={getScoreColor(analysis.depth.score)}>
                  {analysis.depth.score}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Conceptual Coverage</span>
                  <span>{analysis.depth.conceptualCoverage}/100</span>
                </div>
                <Progress value={analysis.depth.conceptualCoverage} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Semantic Richness</span>
                  <span>{analysis.depth.semanticRichness}/100</span>
                </div>
                <Progress value={analysis.depth.semanticRichness} className="h-2" />
                <p className="text-xs text-gray-600 mt-2">{analysis.depth.feedback}</p>
              </div>
            </Card>

            {/* Fluency */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <MessageSquare className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold">🗣️ Fluency</h3>
                <Badge className={getScoreColor(analysis.fluency.score)}>
                  {analysis.fluency.score}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Smoothness</span>
                  <span>{analysis.fluency.smoothness}/100</span>
                </div>
                <Progress value={analysis.fluency.smoothness} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Word Pacing</span>
                  <span>{analysis.fluency.wordPacing}/100</span>
                </div>
                <Progress value={analysis.fluency.wordPacing} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Filler Words</span>
                  <span className="text-red-500">{analysis.fluency.fillerWordRatio}%</span>
                </div>
              </div>
            </Card>

            {/* Emotion */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Heart className="w-5 h-5 text-pink-600" />
                <h3 className="font-semibold">🧩 Emotion</h3>
                <Badge className={getScoreColor(analysis.emotion.score)}>
                  {analysis.emotion.score}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Expressiveness</span>
                  <span>{analysis.emotion.expressiveness}/100</span>
                </div>
                <Progress value={analysis.emotion.expressiveness} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Engagement</span>
                  <span>{analysis.emotion.engagement}/100</span>
                </div>
                <Progress value={analysis.emotion.engagement} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Sentiment</span>
                  <Badge variant="outline" className="text-xs">
                    {analysis.emotion.sentiment}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Transcript */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Transcript</span>
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">{transcript}</p>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button className="bg-purple-gradient text-white hover:opacity-90">
              Save Analysis
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
