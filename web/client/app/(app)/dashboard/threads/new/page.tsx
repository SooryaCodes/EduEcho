'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";
import { Loader2, Mic, MicOff, Plus, X, ArrowLeft } from "lucide-react";
import Link from "next/link";

const subjects = ["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology", "Economics", "Literature", "History", "Other"];

export default function NewThreadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    description: "",
    subject: "",
    tags: [] as string[],
    voiceUrl: "",
  });
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    if (!formData.subject) {
      toast.error("Please select a subject");
      return;
    }

    setLoading(true);

    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        toast.error("Please log in again");
        router.push("/auth/login");
        return;
      }

      const user = JSON.parse(storedUser);

      const response: any = await api.post("/threads", {
        question: formData.question,
        description: formData.description,
        subject: formData.subject,
        tags: formData.tags,
        userId: user._id,
        userName: user.name,
        voiceUrl: formData.voiceUrl,
      });

      toast.success("Thread created successfully!");
      router.push(`/dashboard/threads/${response.data._id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create thread");
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = () => {
    if (recording) {
      // Stop recording
      setRecording(false);
      toast.success("Recording stopped");
      // In production, this would process the audio
    } else {
      // Start recording
      setRecording(true);
      toast.success("Recording started");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-2xl">
          <Link href="/dashboard/threads">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-4xl font-cabinet font-bold">Ask a Question</h1>
          <p className="text-lg text-muted-foreground mt-1">
            Get help from the community
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Voice Recording Card */}
        <Card className="p-8 rounded-3xl border-0 bg-light-purple">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-cabinet font-bold text-xl mb-2">Voice Question (Optional)</h3>
              <p className="text-muted-foreground">
                Record your question with voice for better engagement
              </p>
            </div>
            <Button
              type="button"
              onClick={toggleRecording}
              className={`w-16 h-16 rounded-full ${
                recording 
                  ? "bg-red-600 hover:bg-red-700 animate-pulse" 
                  : "bg-purple-card hover:bg-[rgb(129,140,248)]"
              }`}
            >
              {recording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            </Button>
          </div>
          {recording && (
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white/50 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-[rgb(108,93,211)] w-1/3 animate-pulse" />
              </div>
              <span className="text-sm font-medium">0:15</span>
            </div>
          )}
        </Card>

        {/* Main Form */}
        <Card className="p-8 rounded-3xl border-0">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="question" className="text-lg font-cabinet font-bold">
                Question Title *
              </Label>
              <Input
                id="question"
                placeholder="What's your question?"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                required
                disabled={loading}
                className="h-14 rounded-2xl border-2 text-lg focus-visible:ring-[rgb(108,93,211)]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-lg font-cabinet font-bold">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Provide more details about your question..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={loading}
                className="min-h-32 rounded-2xl border-2 resize-none focus-visible:ring-[rgb(108,93,211)]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-lg font-cabinet font-bold">
                Subject *
              </Label>
              <Select
                value={formData.subject}
                onValueChange={(value) => setFormData({ ...formData, subject: value })}
                disabled={loading}
              >
                <SelectTrigger className="h-12 rounded-2xl border-2 focus:ring-[rgb(108,93,211)]">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-lg font-cabinet font-bold">Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  disabled={loading}
                  className="h-12 rounded-2xl border-2 focus-visible:ring-[rgb(108,93,211)]"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  disabled={loading || !tagInput.trim()}
                  className="h-12 px-6 rounded-2xl bg-purple-card hover:bg-[rgb(129,140,248)]"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="pl-3 pr-2 py-2 rounded-full bg-light-purple text-[rgb(108,93,211)] border-0 text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 hover:bg-white/50 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1 h-14 rounded-2xl font-semibold text-base"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 h-14 rounded-2xl bg-purple-card hover:bg-[rgb(129,140,248)] font-semibold text-base"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              "Post Question"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

