'use client';

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import api from "@/lib/api";
import { BookOpen, Plus, Search, Clock, Sparkles, ArrowRight, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function NotebooksPage() {
  const [notebooks, setNotebooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadNotebooks();
  }, []);

  const loadNotebooks = async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      
      const user = JSON.parse(storedUser);
      const response: any = await api.get(`/notebooks?userId=${user._id}`);
      setNotebooks(response.data || []);
    } catch (error) {
      console.error("Failed to load notebooks:", error);
      setNotebooks([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotebooks = notebooks.filter(notebook =>
    notebook.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-cabinet font-bold mb-2">My Notebooks</h1>
          <p className="text-lg text-muted-foreground">
            Your personal collection of knowledge
          </p>
        </div>
        <Button asChild className="bg-purple-card hover:bg-[rgb(129,140,248)] rounded-2xl h-12 px-8">
          <Link href="/dashboard/notebooks/new">
            <Plus className="w-5 h-5 mr-2" />
            New Notebook
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card className="p-6 rounded-3xl border-0">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search notebooks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 pl-12 rounded-2xl border-2 focus-visible:ring-[rgb(108,93,211)]"
          />
        </div>
      </Card>

      {/* Notebooks Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-6 rounded-3xl border-0 bg-muted/50 animate-pulse">
              <div className="h-6 bg-muted rounded w-3/4 mb-4" />
              <div className="h-4 bg-muted rounded w-1/2 mb-4" />
              <div className="h-4 bg-muted rounded w-full" />
            </Card>
          ))}
        </div>
      ) : filteredNotebooks.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotebooks.map((notebook, index) => (
            <motion.div
              key={notebook._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={`/dashboard/notebooks/${notebook._id}`}>
                <Card className="p-6 rounded-3xl border-0 h-full hover:shadow-xl transition-all hover:-translate-y-1 bg-light-purple">
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center">
                      <BookOpen className="w-7 h-7 text-[rgb(108,93,211)]" />
                    </div>

                    <div>
                      <h3 className="font-cabinet font-bold text-xl mb-2">{notebook.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notebook.description || "No description"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {notebook.notes?.length || 0} notes
                        </span>
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-4 h-4" />
                          {notebook.flashcardsCount || 0} cards
                        </span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[rgb(108,93,211)]" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-16 rounded-3xl border-0 bg-muted/30 text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-cabinet font-bold text-2xl mb-2">No notebooks yet</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {searchQuery
              ? "No notebooks match your search"
              : "Create your first notebook to start organizing your learning"}
          </p>
          <Button asChild className="bg-purple-card hover:bg-[rgb(129,140,248)] rounded-2xl h-12 px-8">
            <Link href="/dashboard/notebooks/new">
              <Plus className="w-5 h-5 mr-2" />
              Create Notebook
            </Link>
          </Button>
        </Card>
      )}
    </div>
  );
}

