'use client';

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useUserStore } from "@/stores/user-store";
import api from "@/lib/api";
import { 
  User, Trophy, MessageSquare, BookOpen, Star, 
  TrendingUp, Calendar, Settings 
} from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const user = useUserStore((state) => state.user);
  const [stats, setStats] = useState({
    threadsCount: 0,
    repliesCount: 0,
    notebooksCount: 0,
    points: 0,
    rank: 0,
    avgScore: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      
      const userData = JSON.parse(storedUser);

      // Fetch user stats (in production, this would be from backend)
      setStats({
        threadsCount: 12,
        repliesCount: 48,
        notebooksCount: 7,
        points: userData.points || 250,
        rank: 42,
        avgScore: 8.5,
      });

      setRecentActivity([]);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <Card className="p-8 rounded-3xl border-0 bg-gradient-to-br from-purple-card to-[rgb(129,140,248)] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <Avatar className="w-32 h-32 border-4 border-white">
              <AvatarFallback className="bg-white/20 backdrop-blur text-white text-5xl font-cabinet font-bold">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-4xl font-cabinet font-bold mb-2">{user?.name || "User"}</h1>
                <p className="text-lg opacity-90">{user?.email}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Badge className="bg-white/20 hover:bg-white/30 border-0 rounded-full px-4 py-2">
                  <Trophy className="w-4 h-4 mr-2" />
                  Rank #{stats.rank}
                </Badge>
                <Badge className="bg-white/20 hover:bg-white/30 border-0 rounded-full px-4 py-2">
                  <Star className="w-4 h-4 mr-2" />
                  {stats.points} points
                </Badge>
                {user?.type && (
                  <Badge className="bg-white/20 hover:bg-white/30 border-0 rounded-full px-4 py-2">
                    {user.type} Learner
                  </Badge>
                )}
              </div>
            </div>

            <Button asChild variant="secondary" className="rounded-2xl h-12 px-8">
              <Link href="/dashboard/settings">
                <Settings className="w-5 h-5 mr-2" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { 
            label: "Threads", 
            value: stats.threadsCount, 
            icon: MessageSquare,
            color: "bg-light-purple text-[rgb(108,93,211)]"
          },
          { 
            label: "Replies", 
            value: stats.repliesCount, 
            icon: MessageSquare,
            color: "bg-light-yellow text-amber-600"
          },
          { 
            label: "Notebooks", 
            value: stats.notebooksCount, 
            icon: BookOpen,
            color: "bg-light-purple text-[rgb(108,93,211)]"
          },
          { 
            label: "Avg Score", 
            value: stats.avgScore.toFixed(1), 
            icon: Star,
            color: "bg-light-yellow text-amber-600"
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className={`p-6 rounded-3xl border-0 ${stat.color}`}>
              <stat.icon className="w-8 h-8 mb-4" />
              <div className="font-cabinet font-bold text-4xl mb-1">{stat.value}</div>
              <div className="text-sm font-medium opacity-70">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Activity Tabs */}
      <Tabs defaultValue="threads" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 h-12 rounded-2xl">
          <TabsTrigger value="threads" className="rounded-xl">Threads</TabsTrigger>
          <TabsTrigger value="replies" className="rounded-xl">Replies</TabsTrigger>
          <TabsTrigger value="notebooks" className="rounded-xl">Notebooks</TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="threads" className="mt-0">
            <Card className="p-12 rounded-3xl border-0 bg-muted/30 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-cabinet font-bold text-xl mb-2">No threads yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by asking your first question
              </p>
              <Button asChild className="bg-purple-card hover:bg-[rgb(129,140,248)] rounded-2xl">
                <Link href="/dashboard/threads/new">Ask Question</Link>
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="replies" className="mt-0">
            <Card className="p-12 rounded-3xl border-0 bg-muted/30 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-cabinet font-bold text-xl mb-2">No replies yet</h3>
              <p className="text-muted-foreground mb-6">
                Help others by answering their questions
              </p>
              <Button asChild className="bg-purple-card hover:bg-[rgb(129,140,248)] rounded-2xl">
                <Link href="/dashboard/threads">Browse Threads</Link>
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="notebooks" className="mt-0">
            <Card className="p-12 rounded-3xl border-0 bg-muted/30 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-cabinet font-bold text-xl mb-2">No notebooks yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first notebook to organize your learning
              </p>
              <Button asChild className="bg-purple-card hover:bg-[rgb(129,140,248)] rounded-2xl">
                <Link href="/dashboard/notebooks/new">Create Notebook</Link>
              </Button>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Learning Journey */}
      {user?.createdAt && (
        <Card className="p-8 rounded-3xl border-0 bg-light-purple">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center flex-shrink-0">
              <Calendar className="w-7 h-7 text-[rgb(108,93,211)]" />
            </div>
            <div>
              <h3 className="font-cabinet font-bold text-xl mb-2">Learning Journey</h3>
              <p className="text-muted-foreground">
                Member since {new Date(user.createdAt).toLocaleDateString()} • 
                {' '}{Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days of learning
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

