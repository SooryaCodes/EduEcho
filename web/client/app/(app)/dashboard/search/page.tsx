'use client';

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import api from "@/lib/api";
import { Search, Sparkles, MessageSquare, BookOpen, Clock, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>({ threads: [], notebooks: [] });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      // Semantic search using AI embeddings
      const response: any = await api.post("/search/semantic", {
        query: query,
        limit: 20,
      });

      setResults(response.data || { threads: [], notebooks: [] });
    } catch (error) {
      console.error("Search failed:", error);
      setResults({ threads: [], notebooks: [] });
    } finally {
      setLoading(false);
    }
  };

  const totalResults = (results.threads?.length || 0) + (results.notebooks?.length || 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-purple-card mx-auto flex items-center justify-center mb-4">
          <Search className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl font-cabinet font-bold">Semantic Search</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          AI-powered search that understands meaning, not just keywords
        </p>
      </div>

      {/* Search Bar */}
      <Card className="p-8 rounded-3xl border-0 bg-light-purple">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Sparkles className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[rgb(108,93,211)]" />
            <Input
              placeholder="Ask anything... (e.g., 'How do binary trees work?')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-16 pl-14 pr-6 rounded-2xl border-2 text-lg font-medium bg-white focus-visible:ring-[rgb(108,93,211)]"
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !query.trim()}
            className="h-16 px-10 rounded-2xl bg-purple-card hover:bg-[rgb(129,140,248)] text-lg font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-6 w-6" />
                Search
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Results */}
      {searched && (
        <div className="space-y-6">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-cabinet font-bold">
              {loading ? (
                "Searching..."
              ) : totalResults > 0 ? (
                `Found ${totalResults} ${totalResults === 1 ? "result" : "results"}`
              ) : (
                "No results found"
              )}
            </h2>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 rounded-3xl border-0 bg-muted/50 animate-pulse">
                  <div className="h-7 bg-muted rounded w-3/4 mb-4" />
                  <div className="h-5 bg-muted rounded w-full mb-2" />
                  <div className="h-5 bg-muted rounded w-2/3" />
                </Card>
              ))}
            </div>
          ) : totalResults > 0 ? (
            <div className="space-y-8">
              {/* Threads */}
              {results.threads && results.threads.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-cabinet font-bold flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-[rgb(108,93,211)]" />
                    Threads ({results.threads.length})
                  </h3>
                  <div className="space-y-4">
                    {results.threads.map((thread: any, index: number) => (
                      <motion.div
                        key={thread._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Link href={`/dashboard/threads/${thread._id}`}>
                          <Card className="p-6 rounded-3xl border-0 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="flex items-start gap-6">
                              <div className="w-14 h-14 rounded-2xl bg-light-purple flex items-center justify-center flex-shrink-0">
                                <MessageSquare className="w-7 h-7 text-[rgb(108,93,211)]" />
                              </div>

                              <div className="flex-1 space-y-3">
                                <div>
                                  <h4 className="font-cabinet font-bold text-xl mb-2 hover:text-[rgb(108,93,211)] transition-colors">
                                    {thread.question}
                                  </h4>
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
                                  {thread.tags?.slice(0, 2).map((tag: string) => (
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

                              <ArrowRight className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notebooks */}
              {results.notebooks && results.notebooks.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-cabinet font-bold flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-[rgb(108,93,211)]" />
                    Notebooks ({results.notebooks.length})
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {results.notebooks.map((notebook: any, index: number) => (
                      <motion.div
                        key={notebook._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Link href={`/dashboard/notebooks/${notebook._id}`}>
                          <Card className="p-6 rounded-3xl border-0 bg-light-yellow hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-6 h-6 text-amber-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-cabinet font-bold text-lg mb-2">
                                  {notebook.title}
                                </h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {notebook.description || "No description"}
                                </p>
                              </div>
                              <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Card className="p-16 rounded-3xl border-0 bg-muted/30 text-center">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-cabinet font-bold text-2xl mb-2">No results found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Try adjusting your search query or browse existing threads
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Suggestions */}
      {!searched && (
        <Card className="p-8 rounded-3xl border-0 bg-muted/30">
          <h3 className="font-cabinet font-bold text-xl mb-6">Try searching for:</h3>
          <div className="flex flex-wrap gap-3">
            {[
              "How do binary trees work?",
              "Explain recursion simply",
              "Best way to learn algorithms",
              "Database normalization",
              "React hooks tutorial",
            ].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                onClick={() => {
                  setQuery(suggestion);
                  setTimeout(() => handleSearch(), 100);
                }}
                className="rounded-2xl"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

