'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  TrendingUp, 
  Users, 
  Crown,
  Medal,
  Award,
  Zap,
  Calendar,
  Target
} from 'lucide-react';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('overall');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const topLearners = [
    {
      id: 1,
      name: "Sarah Chen",
      avatar: "",
      score: 4250,
      level: 8,
      rank: 1,
      badge: "AI Expert",
      streak: 45,
      threadsCreated: 89,
      repliesPosted: 234,
      helpfulAnswers: 156,
      change: "+2"
    },
    {
      id: 2,
      name: "Alex Kumar",
      avatar: "",
      score: 3890,
      level: 7,
      rank: 2,
      badge: "Database Guru",
      streak: 32,
      threadsCreated: 67,
      repliesPosted: 189,
      helpfulAnswers: 134,
      change: "0"
    },
    {
      id: 3,
      name: "Emma Wilson",
      avatar: "",
      score: 3650,
      level: 7,
      rank: 3,
      badge: "Frontend Master",
      streak: 28,
      threadsCreated: 78,
      repliesPosted: 201,
      helpfulAnswers: 145,
      change: "+1"
    },
    {
      id: 4,
      name: "Mike Johnson",
      avatar: "",
      score: 3420,
      level: 6,
      rank: 4,
      badge: "React Specialist",
      streak: 21,
      threadsCreated: 56,
      repliesPosted: 167,
      helpfulAnswers: 98,
      change: "-1"
    },
    {
      id: 5,
      name: "Lisa Zhang",
      avatar: "",
      score: 3180,
      level: 6,
      rank: 5,
      badge: "Python Expert",
      streak: 19,
      threadsCreated: 45,
      repliesPosted: 145,
      helpfulAnswers: 87,
      change: "+3"
    }
  ];

  const weeklyTop = [
    { name: "David Park", score: 450, change: "+12" },
    { name: "Anna Smith", score: 380, change: "+8" },
    { name: "John Doe", score: 320, change: "+15" }
  ];

  const categories = [
    { name: "AI/ML", leader: "Sarah Chen", score: 1250 },
    { name: "Frontend", leader: "Emma Wilson", score: 980 },
    { name: "Backend", leader: "Alex Kumar", score: 1150 },
    { name: "Mobile", leader: "Mike Johnson", score: 750 }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">{rank}</div>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-purple-gradient';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="gradient-text">Community</span> Leaderboard 🏆
          </h1>
          <p className="text-gray-600">Celebrate our top contributors and learning champions</p>
        </div>

        {/* Current User Stats */}
        {currentUser && (
          <Card className="bento-card-purple p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16 border-2 border-white/20">
                  <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                    {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-white">
                  <h3 className="text-xl font-bold">{currentUser.name}</h3>
                  <p className="text-white/80">Your Current Ranking</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge className="bg-white/20 text-white">
                      Rank #23
                    </Badge>
                    <Badge className="bg-white/20 text-white">
                      1,250 points
                    </Badge>
                    <Badge className="bg-white/20 text-white">
                      Level 3
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right text-white">
                <div className="text-2xl font-bold">1,250</div>
                <div className="text-white/80">Total Points</div>
                <div className="text-purple-300 text-sm mt-1">+45 this week</div>
              </div>
            </div>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overall" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              Overall
            </TabsTrigger>
            <TabsTrigger value="weekly" className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700">
              This Week
            </TabsTrigger>
            <TabsTrigger value="monthly" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              This Month
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Categories
            </TabsTrigger>
          </TabsList>

          {/* Overall Leaderboard */}
          <TabsContent value="overall" className="space-y-4">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Top 3 Podium */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
                    Top Contributors
                  </h2>
                  
                  {/* Podium */}
                  <div className="flex items-end justify-center space-x-4 mb-8">
                    {/* 2nd Place */}
                    <div className="text-center">
                      <div className="w-20 h-16 bg-gradient-to-t from-gray-300 to-gray-500 rounded-t-lg flex items-center justify-center mb-2">
                        <span className="text-white font-bold text-lg">2</span>
                      </div>
                      <Avatar className="w-12 h-12 mx-auto mb-2 border-2 border-gray-400">
                        <AvatarFallback className="bg-gray-100 text-gray-700">
                          {topLearners[1].name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium text-sm">{topLearners[1].name}</p>
                      <p className="text-gray-500 text-xs">{topLearners[1].score} pts</p>
                    </div>

                    {/* 1st Place */}
                    <div className="text-center">
                      <div className="w-24 h-20 bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-t-lg flex items-center justify-center mb-2">
                        <Crown className="w-8 h-8 text-white" />
                      </div>
                      <Avatar className="w-16 h-16 mx-auto mb-2 border-2 border-yellow-400">
                        <AvatarFallback className="bg-yellow-100 text-yellow-700">
                          {topLearners[0].name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-bold">{topLearners[0].name}</p>
                      <p className="text-yellow-600 font-medium">{topLearners[0].score} pts</p>
                      <Badge className="bg-yellow-100 text-yellow-700 text-xs mt-1">
                        {topLearners[0].badge}
                      </Badge>
                    </div>

                    {/* 3rd Place */}
                    <div className="text-center">
                      <div className="w-20 h-12 bg-gradient-to-t from-amber-400 to-amber-600 rounded-t-lg flex items-center justify-center mb-2">
                        <span className="text-white font-bold text-lg">3</span>
                      </div>
                      <Avatar className="w-12 h-12 mx-auto mb-2 border-2 border-amber-400">
                        <AvatarFallback className="bg-amber-100 text-amber-700">
                          {topLearners[2].name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium text-sm">{topLearners[2].name}</p>
                      <p className="text-gray-500 text-xs">{topLearners[2].score} pts</p>
                    </div>
                  </div>

                  {/* Full Rankings */}
                  <div className="space-y-3">
                    {topLearners.map((learner) => (
                      <div key={learner.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          {getRankIcon(learner.rank)}
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-purple-100 text-purple-700">
                              {learner.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-gray-900">{learner.name}</h3>
                              <Badge className="bg-purple-100 text-purple-700 text-xs">
                                {learner.badge}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Level {learner.level}</span>
                              <span>•</span>
                              <span>{learner.streak} day streak</span>
                              <span>•</span>
                              <span>{learner.helpfulAnswers} helpful answers</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold text-lg text-gray-900">{learner.score}</div>
                          <div className="text-gray-500 text-sm">points</div>
                          <div className={`text-xs ${learner.change.startsWith('+') ? 'text-purple-600' : learner.change === '0' ? 'text-gray-500' : 'text-red-600'}`}>
                            {learner.change !== '0' && learner.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Sidebar Stats */}
              <div className="space-y-6">
                {/* Weekly Leaders */}
                <Card className="bento-card-yellow p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Weekly Rising Stars
                  </h3>
                  <div className="space-y-3">
                    {weeklyTop.map((user, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-gray-800 text-yellow-400 flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <span className="font-medium text-gray-800">{user.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-800">{user.score}</div>
                          <div className="text-purple-600 text-xs">{user.change}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Achievement Stats */}
                <Card className="bento-card-purple-secondary p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Community Stats
                  </h3>
                  <div className="space-y-3 text-white">
                    <div className="flex justify-between">
                      <span className="text-white/80">Total Members</span>
                      <span className="font-bold">12,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Active This Week</span>
                      <span className="font-bold">3,240</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Questions Answered</span>
                      <span className="font-bold">45,670</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Avg Response Time</span>
                      <span className="font-bold">12 min</span>
                    </div>
                  </div>
                </Card>

                {/* Your Progress */}
                <Card className="bento-card-black p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Your Progress
                  </h3>
                  <div className="space-y-4 text-white">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Next Level</span>
                        <span>750/1000 XP</span>
                      </div>
                      <Progress value={75} className="bg-white/20" />
                    </div>
                    <div className="text-sm text-white/80">
                      <p>• Answer 5 more questions to reach Level 4</p>
                      <p>• Maintain your 12-day streak</p>
                      <p>• Get 3 more helpful votes</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Category Leaders */}
          <TabsContent value="categories" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {categories.map((category, index) => (
                <Card key={category.name} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                    <Badge className="bg-purple-100 text-purple-700">
                      Category Leader
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-purple-100 text-purple-700">
                        {category.leader.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{category.leader}</p>
                      <p className="text-gray-500">{category.score} points in {category.name}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}