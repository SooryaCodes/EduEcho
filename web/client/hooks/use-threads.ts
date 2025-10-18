'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Thread, ApiResponse } from '@/types';
import { toast } from 'sonner';

interface UseThreadsOptions {
  page?: number;
  limit?: number;
  subject?: string;
  tags?: string[];
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export function useThreads(options: UseThreadsOptions = {}) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.subject) params.append('subject', options.subject);
      if (options.tags) params.append('tags', options.tags.join(','));
      if (options.sortBy) params.append('sortBy', options.sortBy);
      if (options.order) params.append('order', options.order);

      const response: ApiResponse<Thread[]> = await api.get(`/threads?${params}`);
      
      setThreads(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to fetch threads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [options.page, options.subject, options.sortBy]);

  return {
    threads,
    loading,
    error,
    pagination,
    refetch: fetchThreads,
  };
}

export function useThread(id: string) {
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        setLoading(true);
        const response: ApiResponse<Thread> = await api.get(`/threads/${id}`);
        setThread(response.data);
      } catch (err: any) {
        setError(err.message);
        toast.error('Failed to fetch thread');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchThread();
    }
  }, [id]);

  return { thread, loading, error };
}

