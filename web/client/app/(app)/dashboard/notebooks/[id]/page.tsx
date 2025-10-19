'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import RichTextEditor from '@/components/shared/RichTextEditor';
import WhisperVoiceInput from '@/components/shared/WhisperVoiceInput';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen,
  FileText,
  Sparkles,
  Eye,
  EyeOff,
  Mic,
  MicOff
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface Notebook {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  notes: Note[];
  createdAt: string;
  updatedAt: string;
}

export default function NotebookDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [notebook, setNotebook] = useState<Notebook | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    isPublic: false
  });
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [showAddNote, setShowAddNote] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadNotebook();
    }
  }, [params.id]);

  const loadNotebook = async () => {
    try {
      const response: any = await api.get(`/notebooks/${params.id}`);
      const notebookData = response.data;
      setNotebook(notebookData);
      setFormData({
        title: notebookData.title,
        description: notebookData.description || '',
        tags: notebookData.tags || [],
        isPublic: notebookData.isPublic
      });
    } catch (error) {
      console.error('Failed to load notebook:', error);
      router.push('/dashboard/notebooks');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.put(`/notebooks/${params.id}`, formData);
      setEditing(false);
      loadNotebook(); // Reload to get updated data
    } catch (error) {
      console.error('Failed to update notebook:', error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    try {
      await api.post(`/notebooks/${params.id}/notes`, newNote);
      setNewNote({ title: '', content: '' });
      setShowAddNote(false);
      loadNotebook(); // Reload to get updated notes
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  // Handle voice transcript
  const handleVoiceTranscript = (transcript: string) => {
    setNewNote(prev => ({
      ...prev,
      content: prev.content + ' ' + transcript
    }));
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await api.delete(`/notebooks/${params.id}/notes/${noteId}`);
      loadNotebook(); // Reload to get updated notes
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const generateFlashcards = async () => {
    try {
      const allContent = notebook?.notes.map(note => `${note.title}: ${note.content}`).join('\n\n') || '';
      const response: any = await api.post(`/notebooks/${params.id}/notes/flashcards`, {
        content: allContent,
        count: 5
      });
      
      if (response.data) {
        alert(`Generated ${response.data.length} flashcards!`);
        // You can implement a flashcard modal here
      }
    } catch (error) {
      console.error('Failed to generate flashcards:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notebook...</p>
        </div>
      </div>
    );
  }

  if (!notebook) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Notebook Not Found</h2>
        <p className="text-gray-600 mb-6">The notebook you're looking for doesn't exist or has been deleted.</p>
        <Link href="/dashboard/notebooks">
          <Button className="bg-purple-gradient text-white hover:opacity-90">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Notebooks
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/notebooks">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {editing ? (
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="text-3xl font-bold border-none p-0 h-auto bg-transparent"
                />
              ) : (
                notebook.title
              )}
            </h1>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant={notebook.isPublic ? "default" : "outline"}>
                {notebook.isPublic ? (
                  <>
                    <Eye className="w-3 h-3 mr-1" />
                    Public
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3 h-3 mr-1" />
                    Private
                  </>
                )}
              </Badge>
              {notebook.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={generateFlashcards}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Flashcards</span>
          </Button>
          
          {editing ? (
            <>
              <Button onClick={handleSave} className="bg-purple-gradient text-white hover:opacity-90">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)} variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Notebook
            </Button>
          )}
        </div>
      </div>

      {/* Description */}
      <Card className="p-6">
        <h3 className="font-semibold mb-3">Description</h3>
        {editing ? (
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Add a description for your notebook..."
            rows={3}
          />
        ) : (
          <p className="text-gray-700">
            {notebook.description || 'No description provided.'}
          </p>
        )}
      </Card>

      {/* Notes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Notes ({notebook.notes?.length || 0})</h2>
          <Button
            onClick={() => setShowAddNote(true)}
            className="bg-purple-gradient text-white hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Note
          </Button>
        </div>

        {/* Add Note Form */}
        {showAddNote && (
          <Card className="p-6 border-2 border-purple-200">
            <h3 className="font-semibold mb-4">Add New Note</h3>
            <div className="space-y-4">
              <Input
                placeholder="Note title..."
                value={newNote.title}
                onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
              />
              <div className="space-y-3">
                <RichTextEditor
                  value={newNote.content}
                  onChange={(content) => setNewNote(prev => ({ ...prev, content }))}
                  placeholder="Write your note content... Use the toolbar for formatting."
                  className="min-h-[200px]"
                />
                <div className="flex items-center justify-between">
                  <WhisperVoiceInput 
                    onTranscript={handleVoiceTranscript}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-500 ml-4">
                    Click mic for AI-powered voice transcription
                  </span>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowAddNote(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddNote}
                  disabled={!newNote.title.trim() || !newNote.content.trim()}
                  className="bg-purple-gradient text-white hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Notes List */}
        {notebook.notes && notebook.notes.length > 0 ? (
          <div className="grid gap-4">
            {notebook.notes.map((note) => (
              <Card key={note._id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteNote(note._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div 
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: note.content }}
                />
                <div className="mt-4 text-xs text-gray-500">
                  Created: {new Date(note.createdAt).toLocaleDateString()}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Notes Yet</h3>
            <p className="text-gray-600 mb-6">Start adding notes to organize your learning materials.</p>
            <Button
              onClick={() => setShowAddNote(true)}
              className="bg-purple-gradient text-white hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Note
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
