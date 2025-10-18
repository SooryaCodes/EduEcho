'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, TrendingUp, Clock, Mic, Sparkles, Users, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { toast } from "sonner";
import { formatDistance } from "date-fns";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      const response: any = await api.get("/threads?limit=10&sortBy=createdAt&order=desc");
      setThreads(response.data || []);
    } catch (error: any) {
      toast.error("Failed to fetch threads");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Welcome back, <span className="text-primary">{user?.name?.split(" ")[0]}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to continue your learning journey?
          </p>
        </div>
        <Button size="lg" asChild className="bg-gradient-to-r from-primary to-primary/80">
          <Link href="/dashboard/threads/new">
            <Plus className="w-5 h-5 mr-2" />
            Ask Question
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Points</CardTitle>
            <Sparkles className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.points || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 20)} from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contributions</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.contributionCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Questions & replies
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upvotes</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.upvotesReceived || 0}</div>
            <p className="text-xs text-muted-foreground">
              From community
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notebooks</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.notebooksSaved || 0}</div>
            <p className="text-xs text-muted-foreground">
              Saved notes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Threads */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Threads</CardTitle>
              <CardDescription>Latest questions from the community</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard/threads">
                View All
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="trending" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="trending">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="recent">
                <Clock className="w-4 h-4 mr-2" />
                Recent
              </TabsTrigger>
              <TabsTrigger value="voice">
                <Mic className="w-4 h-4 mr-2" />
                Voice
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trending" className="space-y-4">
              {loading ? (
                <>
                  {[1, 2, 3].map(i => (
                    <Card key={i} className="p-4">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-full mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </Card>
                  ))}
                </>
              ) : threads.length > 0 ? (
                threads.slice(0, 5).map((thread) => (
                  <Link href={`/dashboard/threads/${thread._id}`} key={thread._id}>
                    <Card className="p-4 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10">
                            {typeof thread.userId === 'object' 
                              ? thread.userId.name?.substring(0, 2).toUpperCase()
                              : "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <h4 className="font-semibold text-lg hover:text-primary transition-colors">
                            {thread.question}
                          </h4>
                          {thread.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {thread.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {thread.tags?.map((tag: string) => (
                              <Badge key={tag} variant="secondary">{tag}</Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {thread.replyCount || 0} replies
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {thread.upvotes || 0} upvotes
                            </span>
                            <span>
                              {formatDistance(new Date(thread.createdAt), new Date(), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No threads yet. Be the first to ask a question!</p>
                  <Button className="mt-4" asChild>
                    <Link href="/dashboard/threads/new">Ask Question</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recent">
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Recent threads will appear here</p>
              </div>
            </TabsContent>

            <TabsContent value="voice">
              <div className="text-center py-12 text-muted-foreground">
                <Mic className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Voice threads will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

