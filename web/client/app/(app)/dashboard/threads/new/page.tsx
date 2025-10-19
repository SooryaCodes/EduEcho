'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import WhisperVoiceInput from '@/components/shared/WhisperVoiceInput';
import { 
  MessageSquare, 
  Tag, 
  Mic, 
  Upload, 
  X,
  Plus,
  Brain,
  Zap,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function NewThreadPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    category: ''
  });
  const [newTag, setNewTag] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { name: 'AI/ML', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { name: 'Frontend', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { name: 'Backend', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { name: 'Database', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { name: 'DevOps', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { name: 'Mobile', color: 'bg-pink-100 text-pink-700 border-pink-200' }
  ];

  const popularTags = [
    'React', 'JavaScript', 'Python', 'Node.js', 'TypeScript', 
    'CSS', 'HTML', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Git'
  ];

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim()) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      // Use Web Speech API for transcription
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          
          setFormData(prev => ({
            ...prev,
            description: prev.description + ' ' + transcript
          }));
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
        };
        
        recognition.start();
      } else {
        console.warn('Speech recognition not supported in this browser');
        alert('Speech recognition not supported. Please type your description manually.');
      }
    } catch (error) {
      console.error('Error with speech recognition:', error);
    }
  };

  const showVoiceAnalysis = (analysis: any) => {
    // Create a simple alert for now - can be enhanced with a modal
    const summary = `
🎧 Clarity: ${analysis.clarity.score}/100
🎤 Confidence: ${analysis.confidence.score}/100  
🧠 Depth: ${analysis.depth.score}/100
🗣️ Fluency: ${analysis.fluency.score}/100
🧩 Emotion: ${analysis.emotion.score}/100
📊 Overall: ${analysis.overall.score}/100

${analysis.overall.feedback}
    `;
    alert(summary);
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        alert('Please log in again');
        window.location.href = '/auth/login';
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user._id || user.id || user.userId || user.user_id;
      
      if (!userId) {
        alert('User ID not found. Please log in again.');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/threads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: formData.title,
        description: formData.description,
        tags: formData.tags,
          subject: formData.category,
          userId: userId,
        }),
      });

      if (response.ok) {
        router.push('/dashboard/threads');
      } else {
        console.error('Failed to create thread');
      }
    } catch (error) {
      console.error('Error creating thread:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/threads">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Threads
            </Button>
          </Link>
        <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Ask a <span className="gradient-text">Question</span>
            </h1>
            <p className="text-gray-600 mt-1">Share your question with the community and get expert answers</p>
          </div>
      </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    <Label htmlFor="title" className="text-lg font-semibold">Question Title</Label>
                  </div>
                  <Input
                    id="title"
                    placeholder="What's your programming question? Be specific and clear..."
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="text-lg"
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Make your title descriptive and specific to get better answers
              </p>
            </div>
              </Card>

              {/* Description */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <Label htmlFor="description" className="text-lg font-semibold">Detailed Description</Label>
                    </div>
                    <div className="flex items-center space-x-2">
            <Button
              type="button"
                        variant="outline"
                        size="sm"
                        className={`${isRecording ? 'bg-red-100 text-red-700 border-red-200' : ''}`}
                        onClick={handleVoiceToggle}
                      >
                        <Mic className="w-4 h-4 mr-2" />
                        {isRecording ? 'Stop Recording' : 'Voice Input'}
                      </Button>
                      <Button type="button" variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
            </Button>
          </div>
              </div>
                  
                  <Textarea
                    id="description"
                    placeholder="Provide more details about your question. Include what you've tried, error messages, code snippets, etc..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={8}
                    className="resize-none"
                  />
                  
                  {isRecording && (
                    <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-700 text-sm font-medium">Recording... Speak your question</span>
            </div>
          )}
                </div>
        </Card>

              {/* Category */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-5 h-5 text-purple-600" />
                    <Label className="text-lg font-semibold">Category</Label>
            </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <Button
                        key={category.name}
                        type="button"
                        variant={formData.category === category.name ? "default" : "outline"}
                        className={`${formData.category === category.name 
                          ? 'bg-purple-gradient text-white' 
                          : `${category.color} hover:opacity-80`
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, category: category.name }))}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Tags */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <Label className="text-lg font-semibold">Tags</Label>
                    <Badge variant="outline" className="text-xs">
                      {formData.tags.length}/5
                    </Badge>
            </div>

                  {/* Current Tags */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} className="bg-purple-100 text-purple-700 pr-1">
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-4 w-4 p-0 hover:bg-purple-200"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
            </div>
                  )}

                  {/* Add New Tag */}
                  <div className="flex space-x-2">
                <Input
                  placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      disabled={formData.tags.length >= 5}
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                      disabled={!newTag.trim() || formData.tags.length >= 5}
                      size="sm"
                >
                      <Plus className="w-4 h-4" />
                </Button>
              </div>
                  
                  {/* Popular Tags */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Popular tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag) => (
                        <Button
                      key={tag}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs hover:bg-purple-50 hover:border-purple-200"
                          onClick={() => {
                            if (!formData.tags.includes(tag) && formData.tags.length < 5) {
                              setFormData(prev => ({
                                ...prev,
                                tags: [...prev.tags, tag]
                              }));
                            }
                          }}
                          disabled={formData.tags.includes(tag) || formData.tags.length >= 5}
                    >
                      {tag}
                        </Button>
                  ))}
                </div>
            </div>
          </div>
        </Card>

        {/* Submit */}
              <div className="flex justify-end space-x-4">
                <Link href="/dashboard/threads">
                  <Button type="button" variant="outline">
            Cancel
          </Button>
                </Link>
          <Button
            type="submit"
                  className="bg-purple-gradient text-white hover:opacity-90"
                  disabled={!formData.title.trim() || !formData.category || isSubmitting}
                >
                  {isSubmitting ? 'Posting...' : 'Post Question'}
          </Button>
        </div>
      </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips */}
            <Card className="bento-card-yellow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">💡 Tips for Great Questions</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Be specific and clear in your title</li>
                <li>• Include relevant code snippets</li>
                <li>• Mention what you've already tried</li>
                <li>• Add appropriate tags</li>
                <li>• Use proper formatting</li>
              </ul>
            </Card>

            {/* AI Help */}
            <Card className="bento-card-purple p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-6 h-6 text-white" />
                <h3 className="text-lg font-bold text-white">AI Assistant</h3>
              </div>
              <p className="text-white/90 text-sm mb-4">
                Get instant suggestions and improvements for your question before posting.
              </p>
              <Button className="w-full bg-white/20 hover:bg-white/30 text-white">
                Analyze Question
              </Button>
            </Card>

            {/* Community Stats */}
            <Card className="bento-card-purple-secondary p-6">
              <h3 className="text-lg font-bold text-white mb-4">Community Stats</h3>
              <div className="space-y-3 text-white">
                <div className="flex justify-between">
                  <span className="text-white/80">Questions Today</span>
                  <span className="font-bold">127</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Avg Response Time</span>
                  <span className="font-bold">12 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Active Experts</span>
                  <span className="font-bold">45</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}