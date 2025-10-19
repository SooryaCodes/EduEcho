'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";
import WhisperVoiceInput from "@/components/shared/WhisperVoiceInput";
import { 
  ArrowLeft, Clock, MessageSquare, ThumbsUp, Mic, MicOff,
  Volume2, Brain, Loader2, Star, Trophy
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ThreadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [thread, setThread] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadThread();
      loadReplies();
    }
  }, [params.id]);

  const loadThread = async () => {
    try {
      const response: any = await api.get(`/threads/${params.id}`);
      setThread(response.data);
    } catch (error) {
      console.error("Failed to load thread:", error);
      toast.error("Thread not found");
      router.push("/dashboard/threads");
    }
  };

  const loadReplies = async () => {
    setLoading(true);
    try {
      const response: any = await api.get(`/replies/thread/${params.id}`);
      setReplies(response.data || []);
    } catch (error) {
      console.error("Failed to load replies:", error);
      setReplies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    setSubmitting(true);

    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        toast.error("Please log in again");
        router.push("/auth/login");
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user._id || user.id || user.userId || user.user_id;
      
      if (!userId) {
        toast.error("User ID not found. Please log in again.");
        localStorage.removeItem("user");
        router.push("/auth/login");
        return;
      }

      await api.post("/replies", {
        threadId: params.id,
        text: replyText,
        userId: userId,
        userName: user.name,
      });

      toast.success("Reply posted!");
      setReplyText("");
      loadReplies();
    } catch (error: any) {
      toast.error(error.message || "Failed to post reply");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle voice transcript
  const handleVoiceTranscript = (transcript: string) => {
    setReplyText(prev => prev + ' ' + transcript);
    toast.success("Voice transcribed!");
  };

  if (!thread) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-muted rounded w-3/4" />
          <div className="h-64 bg-muted rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-2xl">
          <Link href="/dashboard/threads">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {thread.subject && (
              <Badge className="rounded-full bg-light-purple text-[rgb(108,93,211)] border-0">
                {thread.subject}
              </Badge>
            )}
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(thread.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-4xl font-cabinet font-bold">{thread.question}</h1>
        </div>
      </div>

      {/* Thread Details */}
      <Card className="p-8 rounded-3xl border-0">
        <div className="flex items-start gap-6 mb-6">
          <Avatar className="w-14 h-14">
            <AvatarFallback className="bg-purple-card text-white text-lg font-cabinet font-bold">
              {thread.userName?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-semibold text-lg mb-1">{thread.userName || "Anonymous"}</div>
            <div className="text-sm text-muted-foreground">Asked {new Date(thread.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        {thread.description && (
          <p className="text-lg leading-relaxed mb-6">{thread.description}</p>
        )}

        {thread.voiceUrl && (
          <div className="bg-light-purple p-6 rounded-2xl mb-6">
            <div className="flex items-center gap-4">
              <Button size="icon" className="rounded-full bg-purple-card hover:bg-[rgb(129,140,248)]">
                <Volume2 className="w-5 h-5" />
              </Button>
              <div className="flex-1">
                <div className="text-sm font-medium mb-2">Voice Question</div>
                <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                  <div className="h-full bg-[rgb(108,93,211)] w-1/3" />
                </div>
              </div>
              <span className="text-sm font-medium">2:34</span>
            </div>
          </div>
        )}

        {thread.tags && thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {thread.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="rounded-full">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </Card>

      {/* Replies Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-cabinet font-bold">
            {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
          </h2>
        </div>

        {/* Reply Input */}
        <Card className="p-6 rounded-3xl border-0 bg-muted/30">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-5 h-5 text-[rgb(108,93,211)]" />
              <span className="font-cabinet font-bold text-lg">Your Reply</span>
            </div>
            
            <div className="space-y-4">
              <Textarea
                placeholder="Share your knowledge..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-32 rounded-2xl border-2 resize-none focus-visible:ring-[rgb(108,93,211)]"
                disabled={submitting}
              />

              <div className="flex items-center justify-between gap-3">
                <WhisperVoiceInput 
                  onTranscript={handleVoiceTranscript}
                  className="flex items-center"
                />

                <Button
                  onClick={handleSubmitReply}
                  disabled={submitting || !replyText.trim()}
                  className="bg-purple-card hover:bg-[rgb(129,140,248)] rounded-2xl h-11 px-8 font-semibold"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post Reply"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Replies List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i} className="p-6 rounded-3xl border-0 bg-muted/50 animate-pulse">
                <div className="h-6 bg-muted rounded w-1/4 mb-3" />
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </Card>
            ))}
          </div>
        ) : replies.length > 0 ? (
          <div className="space-y-4">
            {replies.map((reply, index) => (
              <motion.div
                key={reply._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="p-6 rounded-3xl border-0 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-6">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-light-purple text-[rgb(108,93,211)] font-cabinet font-bold">
                        {reply.userName?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold mb-1">{reply.userName || "Anonymous"}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        {reply.aiScore && (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-light-yellow">
                            <Star className="w-4 h-4 text-amber-600" />
                            <span className="font-bold text-amber-600">
                              {reply.aiScore.overallScore?.toFixed(1) || "8.5"}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-base leading-relaxed">{reply.text}</p>

                      {reply.aiSummary && (
                        <div className="bg-light-purple p-4 rounded-2xl">
                          <div className="flex items-start gap-3">
                            <Brain className="w-5 h-5 text-[rgb(108,93,211)] flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-[rgb(108,93,211)] mb-1">
                                AI Summary
                              </div>
                              <p className="text-sm">{reply.aiSummary}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {reply.voiceUrl && (
                        <div className="bg-muted/50 p-4 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <Button size="icon" variant="ghost" className="rounded-full">
                              <Volume2 className="w-5 h-5" />
                            </Button>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-[rgb(108,93,211)] w-1/2" />
                            </div>
                            <span className="text-xs font-medium">1:23</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="rounded-full">
                          <ThumbsUp className="w-4 h-4 mr-1.5" />
                          Helpful
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-16 rounded-3xl border-0 bg-muted/30 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-cabinet font-bold text-xl mb-2">No replies yet</h3>
            <p className="text-muted-foreground">Be the first to help!</p>
          </Card>
        )}
      </div>
    </div>
  );
}

