'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  BookOpen, 
  Plus, 
  X,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import Link from 'next/link';

export default function NewNotebookPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    isPublic: false
  });
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        router.push('/auth/login');
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user._id || user.id;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notebooks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId,
        }),
      });

      if (response.ok) {
        router.push('/dashboard/notebooks');
      } else {
        console.error('Failed to create notebook');
      }
    } catch (error) {
      console.error('Error creating notebook:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/notebooks">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notebooks
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New <span className="gradient-text">Notebook</span>
            </h1>
            <p className="text-gray-600 mt-1">Organize your learning materials and notes</p>
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
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    <Label htmlFor="title" className="text-lg font-semibold">Notebook Title</Label>
                  </div>
                  <Input
                    id="title"
                    placeholder="Enter notebook title..."
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="text-lg"
                    required
                  />
                </div>
              </Card>

              {/* Description */}
              <Card className="p-6">
                <div className="space-y-4">
                  <Label htmlFor="description" className="text-lg font-semibold">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this notebook is about..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </Card>

              {/* Tags */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
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
                </div>
              </Card>

              {/* Privacy Settings */}
              <Card className="p-6">
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Privacy Settings</Label>
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant={formData.isPublic ? "outline" : "default"}
                      onClick={() => setFormData(prev => ({ ...prev, isPublic: false }))}
                      className="flex items-center space-x-2"
                    >
                      <EyeOff className="w-4 h-4" />
                      <span>Private</span>
                    </Button>
                    <Button
                      type="button"
                      variant={formData.isPublic ? "default" : "outline"}
                      onClick={() => setFormData(prev => ({ ...prev, isPublic: true }))}
                      className="flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Public</span>
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formData.isPublic 
                      ? "This notebook will be visible to other users" 
                      : "This notebook will only be visible to you"
                    }
                  </p>
                </div>
              </Card>

              {/* Submit */}
              <div className="flex justify-end space-x-4">
                <Link href="/dashboard/notebooks">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  className="bg-purple-gradient text-white hover:opacity-90"
                  disabled={!formData.title.trim() || isSubmitting}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Creating...' : 'Create Notebook'}
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips */}
            <Card className="bento-card-yellow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">💡 Notebook Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Use descriptive titles</li>
                <li>• Add relevant tags for easy searching</li>
                <li>• Make public to share with community</li>
                <li>• Organize notes by topics</li>
                <li>• Use markdown for formatting</li>
              </ul>
            </Card>

            {/* Features */}
            <Card className="bento-card-purple p-6">
              <h3 className="text-lg font-bold text-white mb-4">📚 Features</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>• Rich text editing</li>
                <li>• AI-powered flashcards</li>
                <li>• Import from files</li>
                <li>• Export to PDF</li>
                <li>• Collaborative editing</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
