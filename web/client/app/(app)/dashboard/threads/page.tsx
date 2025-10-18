'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Plus, 
  MessageSquare, 
  ArrowUp, 
  ArrowDown, 
  Heart, 
  Bookmark, 
  Clock,
  TrendingUp,
  Star,
  Users,
  Filter,
  SortDesc
} from 'lucide-react';
import Link from 'next/link';

interface Thread {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    reputation: number;
    level: number;
  };
  votes: number;
  replies: number;
  views: number;
  tags: string[];
  createdAt: string;
  isHot: boolean;
  isSolved: boolean;
  category: string;
}

export default function ThreadsPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Mock data - like Reddit/Stack Overflow style
  const mockThreads = [
    {
      id: 1,
      title: "How to implement machine learning algorithms in React applications?",
      content: "I'm working on a project that requires ML integration with React. What are the best practices and libraries to use?",
      author: {
        name: "Sarah Chen",
        avatar: "",
        reputation: 2450,
        level: 5
      },
      votes: 24,
      replies: 12,
      views: 156,
      tags: ["React", "Machine Learning", "JavaScript"],
      createdAt: "2 hours ago",
      isHot: true,
      isSolved: false,
      category: "AI/ML"
    },
    {
      id: 2,
      title: "Best practices for state management in large React applications",
      content: "Our React app is growing and state management is becoming complex. Should we use Redux, Zustand, or Context API?",
      author: {
        name: "Mike Johnson",
        avatar: "",
        reputation: 1890,
        level: 4
      },
      votes: 18,
      replies: 8,
      views: 234,
      tags: ["React", "State Management", "Redux"],
      createdAt: "4 hours ago",
      isHot: true,
      isSolved: true,
      category: "Frontend"
    },
    {
      id: 3,
      title: "Database optimization techniques for high-traffic applications",
      content: "Looking for advice on optimizing PostgreSQL queries and database design for applications with millions of users.",
      author: {
        name: "Alex Kumar",
        avatar: "",
        reputation: 3200,
        level: 6
      },
      votes: 31,
      replies: 15,
      views: 445,
      tags: ["Database", "PostgreSQL", "Performance"],
      createdAt: "6 hours ago",
      isHot: false,
      isSolved: false,
      category: "Backend"
    },
    {
      id: 4,
      title: "Understanding microservices architecture patterns",
      content: "Can someone explain the different patterns in microservices and when to use each one?",
      author: {
        name: "Emma Wilson",
        avatar: "",
        reputation: 1650,
        level: 3
      },
      votes: 12,
      replies: 6,
      views: 89,
      tags: ["Microservices", "Architecture", "Backend"],
      createdAt: "1 day ago",
      isHot: false,
      isSolved: true,
      category: "Architecture"
    },
    {
      id: 5,
      title: "CSS Grid vs Flexbox: When to use which?",
      content: "I'm confused about when to use CSS Grid versus Flexbox. Can someone provide clear examples?",
      author: {
        name: "David Park",
        avatar: "",
        reputation: 980,
        level: 2
      },
      votes: 8,
      replies: 4,
      views: 67,
      tags: ["CSS", "Layout", "Frontend"],
      createdAt: "2 days ago",
      isHot: false,
      isSolved: true,
      category: "Frontend"
    }
  ];

  useEffect(() => {
    loadThreads();
  }, []);

  const loadThreads = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/threads`);
      if (response.ok) {
        const data = await response.json();
        setThreads(data.data || []);
      } else {
        console.error('Failed to load threads');
        // Fallback to mock data if API fails
        setThreads(mockThreads);
      }
    } catch (error) {
      console.error('Error loading threads:', error);
      // Fallback to mock data if API fails
      setThreads(mockThreads);
    }
  };

  const getVoteColor = (votes: number) => {
    if (votes >= 20) return 'text-purple-secondary';
    if (votes >= 10) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'AI/ML': 'bg-purple-100 text-purple-700 border-purple-200',
      'Frontend': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Backend': 'bg-purple-100 text-purple-700 border-purple-200',
      'Architecture': 'bg-blue-100 text-blue-700 border-blue-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
        <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">
              <span className="gradient-text">Community</span> Threads
            </h1>
            <p className="text-gray-600 mt-1">Ask questions, share knowledge, and learn together</p>
        </div>
          
          <Link href="/dashboard/threads/new">
            <Button className="bg-purple-gradient text-white hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
            Ask Question
            </Button>
          </Link>
      </div>

        {/* Search and Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
            />
          </div>
        </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <SortDesc className="w-4 h-4 mr-2" />
                Sort
              </Button>
            </div>
              </div>
            </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              All Threads
            </TabsTrigger>
            <TabsTrigger value="hot" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-700">
              🔥 Hot
            </TabsTrigger>
            <TabsTrigger value="unanswered" className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700">
              Unanswered
            </TabsTrigger>
            <TabsTrigger value="solved" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              ✅ Solved
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {threads.map((thread: Thread) => (
              <Card key={thread.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex space-x-4">
                  {/* Vote Section */}
                  <div className="flex flex-col items-center space-y-2 min-w-[60px]">
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <span className={`font-bold text-lg ${getVoteColor(thread.votes)}`}>
                      {thread.votes}
                    </span>
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    </div>

                    {/* Content */}
                  <div className="flex-1 space-y-3">
                    {/* Title and Badges */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <Link href={`/dashboard/threads/${thread.id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600 cursor-pointer line-clamp-2">
                            {thread.title}
                        </h3>
                        </Link>
                        <div className="flex items-center space-x-2 ml-4">
                          {thread.isHot && (
                            <Badge className="bg-red-100 text-red-700 text-xs">
                              🔥 Hot
                            </Badge>
                          )}
                          {thread.isSolved && (
                            <Badge className="bg-lime-100 text-lime-700 text-xs">
                              ✅ Solved
                            </Badge>
                          )}
                          <Badge className={`text-xs ${getCategoryColor(thread.category)}`}>
                            {thread.category}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-gray-600 line-clamp-2">{thread.content}</p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {thread.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs hover:bg-purple-50 cursor-pointer">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                    {/* Author and Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-purple-100 text-purple-700 text-sm">
                            {thread.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">{thread.author.name}</span>
                          <div className="flex items-center space-x-2 text-gray-500">
                            <Badge className="bg-purple-100 text-purple-700 text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              {thread.author.reputation}
                            </Badge>
                            <span>Level {thread.author.level}</span>
                            <span>•</span>
                            <span>{thread.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{thread.replies}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{thread.views}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Sidebar - Top Contributors */}
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {/* Main content already rendered above */}
                    </div>

          <div className="space-y-6">
            {/* Top Contributors */}
            <Card className="bento-card-purple p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Top Contributors</h3>
                <TrendingUp className="w-5 h-5 text-white" />
                    </div>

              <div className="space-y-3">
                {[
                  { name: "Sarah Chen", points: 2450, level: 5 },
                  { name: "Alex Kumar", points: 3200, level: 6 },
                  { name: "Emma Wilson", points: 1650, level: 3 }
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{user.name}</p>
                        <p className="text-white/70 text-xs">Level {user.level}</p>
                      </div>
                    </div>
                    <Badge className="bg-white/20 text-white text-xs">
                      {user.points}
                    </Badge>
                  </div>
                ))}
                  </div>
                </Card>

            {/* Popular Tags */}
            <Card className="bento-card-yellow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'JavaScript', 'Python', 'AI/ML', 'Database', 'CSS'].map((tag) => (
                  <Badge key={tag} className="bg-gray-800 text-yellow-400 hover:bg-gray-700 cursor-pointer">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}