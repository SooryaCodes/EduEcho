'use client';

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useUserStore } from "@/stores/user-store";
import api from "@/lib/api";
import { 
  TrendingUp, MessageSquare, Trophy, BookOpen, 
  Clock, ThumbsUp, Mic, ArrowRight, Sparkles 
} from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const user = useUserStore((state) => state.user);
  const [stats, setStats] = useState({
    threadsCount: 0,
    repliesCount: 0,
    points: 0,
    rank: 0,
  });
  const [recentThreads, setRecentThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      
      const userData = JSON.parse(storedUser);

      // Fetch user threads
      const threadsRes: any = await api.get(`/threads?userId=${userData._id}&limit=5`);
      setRecentThreads(threadsRes.data || []);

      // Calculate stats (in production, this would come from the backend)
      setStats({
        threadsCount: 12,
        repliesCount: 48,
        points: userData.points || 250,
        rank: 42,
      });
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-cabinet font-bold">
          Welcome back{user?.name ? `, ${user.name}` : ""}! 👋
        </h1>
        <p className="text-lg text-muted-foreground">
          Here's what's happening with your learning today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: "Threads Created", 
            value: stats.threadsCount, 
            icon: MessageSquare,
            bgClass: "bg-light-purple",
            iconColor: "text-[rgb(108,93,211)]"
          },
          { 
            label: "Replies Given", 
            value: stats.repliesCount, 
            icon: Mic,
            bgClass: "bg-light-yellow",
            iconColor: "text-amber-600"
          },
          { 
            label: "Total Points", 
            value: stats.points, 
            icon: Trophy,
            bgClass: "bg-light-purple",
            iconColor: "text-[rgb(108,93,211)]"
          },
          { 
            label: "Rank", 
            value: `#${stats.rank}`, 
            icon: TrendingUp,
            bgClass: "bg-light-yellow",
            iconColor: "text-amber-600"
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className={`p-6 rounded-3xl border-0 ${stat.bgClass}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="font-cabinet font-bold text-4xl mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-8 rounded-3xl border-0 bg-purple-card text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-2xl font-cabinet font-bold">Start Learning Today</h3>
            </div>
            <p className="text-lg opacity-90">
              Ask a question or help others by answering theirs
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="secondary" className="h-12 px-6 rounded-2xl font-semibold">
              <Link href="/dashboard/threads/new">
                Ask Question
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent Threads */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-cabinet font-bold">Recent Threads</h2>
          <Button variant="ghost" asChild>
            <Link href="/dashboard/threads">
              View All
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 rounded-3xl border-0 bg-muted/50 animate-pulse">
                <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </Card>
            ))}
          </div>
        ) : recentThreads.length > 0 ? (
          <div className="space-y-4">
            {recentThreads.map((thread: any) => (
              <Link key={thread._id} href={`/dashboard/threads/${thread._id}`}>
                <Card className="p-6 rounded-3xl border-0 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <h3 className="font-cabinet font-bold text-xl">{thread.question}</h3>
                      <div className="flex flex-wrap items-center gap-3">
                        {thread.tags?.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="rounded-full">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {thread.replyCount || 0} replies
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(thread.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-12 rounded-3xl border-0 bg-muted/30 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-cabinet font-bold text-xl mb-2">No threads yet</h3>
            <p className="text-muted-foreground mb-6">
              Start by asking your first question or browse existing threads
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild className="bg-purple-card hover:bg-[rgb(129,140,248)] rounded-2xl">
                <Link href="/dashboard/threads/new">Ask Question</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-2xl">
                <Link href="/dashboard/threads">Browse Threads</Link>
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Learning Type Info */}
      {user?.type && (
        <Card className="p-8 rounded-3xl border-0 bg-light-purple">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-[rgb(108,93,211)]" />
            </div>
            <div>
              <h3 className="font-cabinet font-bold text-xl mb-2">
                Your Learning Type: {user.type}
              </h3>
              <p className="text-muted-foreground">
                Content is personalized based on your learning preferences. 
                You can change this anytime in settings.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
