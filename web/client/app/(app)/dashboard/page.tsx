'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  MessageSquare, 
  BookOpen, 
  Trophy, 
  Users, 
  TrendingUp, 
  Star, 
  Zap,
  Play,
  Heart,
  Bookmark,
  Clock,
  ArrowRight,
  Plus
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalThreads: 0,
    totalReplies: 0,
    score: 0,
    rank: 0,
    level: 1,
    xp: 0,
    nextLevelXp: 1000
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Mock stats for demo
    setStats({
      totalThreads: 12,
      totalReplies: 45,
      score: 1250,
      rank: 23,
      level: 3,
      xp: 750,
      nextLevelXp: 1000
    });
  }, []);

  const recentThreads = [
    {
      id: 1,
      title: "How to implement machine learning in web apps?",
      author: "Sarah Chen",
      replies: 8,
      time: "2h ago",
      category: "AI/ML",
      isHot: true
    },
    {
      id: 2,
      title: "Best practices for React state management",
      author: "Mike Johnson",
      replies: 12,
      time: "4h ago",
      category: "React",
      isHot: false
    },
    {
      id: 3,
      title: "Database optimization techniques",
      author: "Alex Kumar",
      replies: 6,
      time: "6h ago",
      category: "Database",
      isHot: true
    }
  ];

  const topLearners = [
    { name: "Emma Wilson", score: 2450, avatar: "", level: 5 },
    { name: "David Park", score: 2180, avatar: "", level: 4 },
    { name: "Lisa Zhang", score: 1890, avatar: "", level: 4 },
    { name: "John Smith", score: 1650, avatar: "", level: 3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, <span className="gradient-text">{user?.name || 'Learner'}</span>! 👋
        </h1>
          <p className="text-gray-600">Ready to continue your learning journey?</p>
      </div>

        {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* User Profile Card - Purple */}
          <Card className="bento-card-purple lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <Badge className="bg-white/20 text-white">Your Profile</Badge>
              <Star className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="w-16 h-16 border-2 border-white/20">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-white">
                <h3 className="text-xl font-bold">{user?.name || 'Anonymous Learner'}</h3>
                <p className="text-white/80">Level {stats.level} • Rank #{stats.rank}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge className="bg-white/20 text-white">
                    <Zap className="w-3 h-3 mr-1" />
                    {stats.score} pts
                  </Badge>
                  <Badge className="bg-white/20 text-white">
                    <Trophy className="w-3 h-3 mr-1" />
                    {stats.totalThreads} threads
                  </Badge>
                </div>
              </div>
      </div>

            <div className="space-y-2">
              <div className="flex justify-between text-white/80 text-sm">
                <span>Progress to Level {stats.level + 1}</span>
                <span>{stats.xp}/{stats.nextLevelXp} XP</span>
              </div>
              <Progress value={(stats.xp / stats.nextLevelXp) * 100} className="bg-white/20" />
            </div>
          </Card>

          {/* Quick Stats - Yellow */}
          <Card className="bento-card-yellow p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-gray-800" />
              <Badge className="bg-gray-800 text-yellow-400">This Week</Badge>
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-2">{stats.totalReplies}</h4>
            <p className="text-gray-700 font-medium">Replies Posted</p>
            <p className="text-gray-600 text-sm mt-1">+12 from last week</p>
          </Card>

          {/* AI Score - Purple Secondary */}
          <Card className="bento-card-purple-secondary p-6">
            <div className="flex items-center justify-between mb-4">
              <Brain className="w-8 h-8 text-white" />
              <Badge className="bg-white/20 text-white">AI Score</Badge>
            </div>
            <h4 className="text-2xl font-bold text-white mb-2">8.7</h4>
            <p className="text-white/90 font-medium">Avg Quality</p>
            <p className="text-white/70 text-sm mt-1">Excellent performance!</p>
          </Card>

          {/* Quick Actions - White */}
          <Card className="bento-card-white lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Quick Actions</h3>
              <Plus className="w-6 h-6 text-purple-600" />
          </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Link href="/dashboard/threads/new">
                <Button className="w-full bg-purple-gradient text-white hover:opacity-90 h-12">
                  <MessageSquare className="w-4 h-4 mr-2" />
                Ask Question
                </Button>
              </Link>
              
              <Link href="/dashboard/notebooks">
                <Button variant="outline" className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50 h-12">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Study Notes
                </Button>
              </Link>
              
              <Link href="/dashboard/search">
                <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 h-12">
                  <Zap className="w-4 h-4 mr-2" />
                  AI Search
                </Button>
              </Link>
              
              <Link href="/dashboard/leaderboard">
                <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 h-12">
                  <Trophy className="w-4 h-4 mr-2" />
                  Rankings
            </Button>
              </Link>
        </div>
      </Card>

          {/* Top Learners - Black */}
          <Card className="bento-card-black lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Top Learners</h3>
              <Users className="w-6 h-6 text-white" />
            </div>
            
            <div className="space-y-4">
              {topLearners.map((learner, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-white/20 text-white text-sm">
                        {learner.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white font-medium text-sm">{learner.name}</p>
                      <p className="text-white/70 text-xs">Level {learner.level}</p>
                    </div>
                  </div>
                  <Badge className="bg-white/20 text-white text-xs">
                    {learner.score} pts
                  </Badge>
                </div>
              ))}
            </div>
            
            <Link href="/dashboard/leaderboard">
              <Button variant="outline" className="w-full mt-4 border-white/20 text-white hover:bg-white/10">
                View Full Leaderboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Threads</h2>
            <Link href="/dashboard/threads">
              <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
              View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
        </div>

          <div className="space-y-4">
            {recentThreads.map((thread) => (
              <div key={thread.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
          </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900 hover:text-purple-600 cursor-pointer">
                        {thread.title}
                      </h3>
                      {thread.isHot && (
                        <Badge className="bg-red-100 text-red-700 text-xs">
                          🔥 Hot
                          </Badge>
                      )}
                      </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>by {thread.author}</span>
                      <span>•</span>
                      <span>{thread.replies} replies</span>
                      <span>•</span>
                      <span>{thread.time}</span>
                      <Badge variant="outline" className="text-xs">
                        {thread.category}
                      </Badge>
                    </div>
                  </div>
          </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4" />
              </Button>
                  <Button variant="ghost" size="sm">
                    <Bookmark className="w-4 h-4" />
              </Button>
            </div>
      </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}