'use client';

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import api from "@/lib/api";
import { MessageSquare, Clock, Filter, Search, Plus, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const subjects = ["All", "Computer Science", "Mathematics", "Physics", "Chemistry", "Biology", "Other"];
const sortOptions = ["Latest", "Most Replies", "Trending"];

export default function ThreadsPage() {
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [sortBy, setSortBy] = useState("Latest");

  useEffect(() => {
    loadThreads();
  }, [selectedSubject, sortBy]);

  const loadThreads = async () => {
    setLoading(true);
    try {
      let query = "/threads?";
      if (selectedSubject !== "All") query += `subject=${selectedSubject}&`;
      query += "limit=20";
      
      const response: any = await api.get(query);
      setThreads(response.data || []);
    } catch (error) {
      console.error("Failed to load threads:", error);
      setThreads([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredThreads = threads.filter(thread =>
    thread.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-cabinet font-bold mb-2">All Threads</h1>
          <p className="text-lg text-muted-foreground">
            Browse questions and help the community
          </p>
        </div>
        <Button asChild className="bg-purple-card hover:bg-[rgb(129,140,248)] rounded-2xl h-12 px-8">
          <Link href="/dashboard/threads/new">
            <Plus className="w-5 h-5 mr-2" />
            Ask Question
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6 rounded-3xl border-0 bg-card">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-12 rounded-2xl border-2 focus-visible:ring-[rgb(108,93,211)]"
            />
          </div>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full lg:w-48 h-12 rounded-2xl border-2">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48 h-12 rounded-2xl border-2">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Threads List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="p-6 rounded-3xl border-0 bg-muted/50 animate-pulse">
              <div className="h-7 bg-muted rounded w-3/4 mb-4" />
              <div className="h-5 bg-muted rounded w-1/2 mb-4" />
              <div className="flex gap-2">
                <div className="h-6 bg-muted rounded w-20" />
                <div className="h-6 bg-muted rounded w-24" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredThreads.length > 0 ? (
        <div className="space-y-4">
          {filteredThreads.map((thread, index) => (
            <motion.div
              key={thread._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={`/dashboard/threads/${thread._id}`}>
                <Card className="p-6 rounded-3xl border-0 hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="flex items-start gap-6">
                    {/* Thread Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-light-purple flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-7 h-7 text-[rgb(108,93,211)]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="font-cabinet font-bold text-xl mb-2 hover:text-[rgb(108,93,211)] transition-colors">
                          {thread.question}
                        </h3>
                        {thread.description && (
                          <p className="text-muted-foreground line-clamp-2">
                            {thread.description}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {thread.subject && (
                          <Badge className="rounded-full bg-light-purple text-[rgb(108,93,211)] border-0">
                            {thread.subject}
                          </Badge>
                        )}
                        {thread.tags?.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="rounded-full">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          {thread.replyCount || 0} replies
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {new Date(thread.createdAt).toLocaleDateString()}
                        </span>
                        {thread.userName && (
                          <span>by {thread.userName}</span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <ArrowRight className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-16 rounded-3xl border-0 bg-muted/30 text-center">
          <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-cabinet font-bold text-2xl mb-2">No threads found</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {searchQuery 
              ? "Try adjusting your search or filters"
              : "Be the first to start a discussion!"
            }
          </p>
          <Button asChild className="bg-purple-card hover:bg-[rgb(129,140,248)] rounded-2xl h-12 px-8">
            <Link href="/dashboard/threads/new">
              <Plus className="w-5 h-5 mr-2" />
              Ask First Question
            </Link>
          </Button>
        </Card>
      )}
    </div>
  );
}

