'use client';

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/api";
import { Trophy, TrendingUp, Star, Award, Medal, Crown } from "lucide-react";
import { motion } from "framer-motion";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("all");

  useEffect(() => {
    loadLeaderboard();
  }, [timeframe]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const response: any = await api.get(`/leaderboard?timeframe=${timeframe}`);
      setLeaderboard(response.data || mockLeaderboard);
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
      setLeaderboard(mockLeaderboard);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return null;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
    if (rank === 3) return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
    return "bg-muted text-foreground";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-3xl bg-purple-card mx-auto flex items-center justify-center mb-4">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl font-cabinet font-bold">Leaderboard</h1>
        <p className="text-lg text-muted-foreground">
          Top contributors in the community
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={timeframe} onValueChange={setTimeframe} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 h-12 rounded-2xl">
          <TabsTrigger value="week" className="rounded-xl">This Week</TabsTrigger>
          <TabsTrigger value="month" className="rounded-xl">This Month</TabsTrigger>
          <TabsTrigger value="all" className="rounded-xl">All Time</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Top 3 */}
      {!loading && leaderboard.length >= 3 && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Rank 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="md:order-1"
          >
            <Card className="p-6 rounded-3xl border-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-center md:mt-12">
              <div className="relative inline-block mb-4">
                <Avatar className="w-20 h-20 border-4 border-white">
                  <AvatarFallback className="bg-gray-400 text-white text-2xl font-cabinet font-bold">
                    {leaderboard[1]?.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
              </div>
              <h3 className="font-cabinet font-bold text-xl mb-1">{leaderboard[1]?.name}</h3>
              <div className="flex items-center justify-center gap-2 mb-3">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-bold text-2xl">{leaderboard[1]?.points}</span>
              </div>
              <Badge variant="secondary" className="rounded-full">
                {leaderboard[1]?.repliesCount || 0} replies
              </Badge>
            </Card>
          </motion.div>

          {/* Rank 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="md:order-2"
          >
            <Card className="p-8 rounded-3xl border-0 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
              <div className="relative z-10">
                <div className="relative inline-block mb-6">
                  <Avatar className="w-24 h-24 border-4 border-white">
                    <AvatarFallback className="bg-yellow-500 text-white text-3xl font-cabinet font-bold">
                      {leaderboard[0]?.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <Crown className="w-6 h-6 text-yellow-500" />
                  </div>
                </div>
                <h3 className="font-cabinet font-bold text-2xl mb-2">{leaderboard[0]?.name}</h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Star className="w-5 h-5" />
                  <span className="font-bold text-3xl">{leaderboard[0]?.points}</span>
                </div>
                <Badge className="bg-white/20 hover:bg-white/30 border-0 rounded-full">
                  {leaderboard[0]?.repliesCount || 0} replies
                </Badge>
              </div>
            </Card>
          </motion.div>

          {/* Rank 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="md:order-3"
          >
            <Card className="p-6 rounded-3xl border-0 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-950 text-center md:mt-12">
              <div className="relative inline-block mb-4">
                <Avatar className="w-20 h-20 border-4 border-white">
                  <AvatarFallback className="bg-amber-600 text-white text-2xl font-cabinet font-bold">
                    {leaderboard[2]?.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
              </div>
              <h3 className="font-cabinet font-bold text-xl mb-1">{leaderboard[2]?.name}</h3>
              <div className="flex items-center justify-center gap-2 mb-3">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-bold text-2xl">{leaderboard[2]?.points}</span>
              </div>
              <Badge variant="secondary" className="rounded-full">
                {leaderboard[2]?.repliesCount || 0} replies
              </Badge>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Rest of Leaderboard */}
      <Card className="rounded-3xl border-0 overflow-hidden">
        <div className="divide-y">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="p-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-full" />
                  <div className="flex-1">
                    <div className="h-5 bg-muted rounded w-1/3 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))
          ) : leaderboard.slice(3).length > 0 ? (
            leaderboard.slice(3).map((user, index) => {
              const rank = index + 4;
              return (
                <motion.div
                  key={user._id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="p-6 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center font-cabinet font-bold text-xl">
                      {rank}
                    </div>

                    <Avatar className="w-14 h-14">
                      <AvatarFallback className="bg-purple-card text-white text-lg font-cabinet font-bold">
                        {user.name?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{user.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{user.repliesCount || 0} replies</span>
                        <span>{user.threadsCount || 0} threads</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="font-cabinet font-bold text-2xl">{user.points}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="p-16 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No more users to display</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// Mock data for development
const mockLeaderboard = [
  { _id: "1", name: "Alex Johnson", points: 1250, repliesCount: 85, threadsCount: 23 },
  { _id: "2", name: "Sarah Chen", points: 1100, repliesCount: 72, threadsCount: 19 },
  { _id: "3", name: "Mike Davis", points: 950, repliesCount: 61, threadsCount: 15 },
  { _id: "4", name: "Emma Wilson", points: 820, repliesCount: 54, threadsCount: 12 },
  { _id: "5", name: "James Brown", points: 780, repliesCount: 49, threadsCount: 11 },
  { _id: "6", name: "Sophia Martinez", points: 720, repliesCount: 45, threadsCount: 10 },
  { _id: "7", name: "Oliver Taylor", points: 680, repliesCount: 42, threadsCount: 9 },
  { _id: "8", name: "Ava Anderson", points: 640, repliesCount: 38, threadsCount: 8 },
  { _id: "9", name: "Liam Thomas", points: 590, repliesCount: 35, threadsCount: 7 },
  { _id: "10", name: "Mia Garcia", points: 550, repliesCount: 32, threadsCount: 6 },
];

