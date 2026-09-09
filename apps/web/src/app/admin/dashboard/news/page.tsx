'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/admin/api';
import { useToast } from '@/components/admin/ToastProvider';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  FileText,
  Loader2,
  Star,
} from 'lucide-react';

interface News {
  _id: string;
  title: { en: string; ar: string };
  category: { en: string; ar: string };
  slug: string;
  status: 'draft' | 'published';
  featured: boolean;
  image?: string;
  publishedDate: string;
}

function TableSkeleton() {
  return (
    <div className="divide-y divide-gray-100">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
          <div className="w-10 h-10 rounded-lg bg-gray-200 flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 bg-gray-200 rounded w-36" />
            <div className="h-3 bg-gray-200 rounded w-24" />
          </div>
          <div className="h-5 bg-gray-200 rounded-full w-16" />
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-gray-200 rounded-lg" />
            <div className="h-8 w-8 bg-gray-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ search }: { search: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
        <FileText className="w-8 h-8 text-indigo-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-800 mb-1">
        {search ? 'No results found' : 'No articles yet'}
      </h3>
      <p className="text-sm text-gray-500 text-center max-w-xs mb-6">
        {search
          ? `No articles match "${search}".`
          : 'Publish your first news or blog article.'}
      </p>
      {!search && (
        <Link
          href="/dashboard/news/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Create Article
        </Link>
      )}
    </div>
  );
}

export default function NewsPage() {
  const { toast } = useToast();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchApi(`/api/news?limit=50&search=${encodeURIComponent(search)}`);
      setNewsList(res.data ?? []);
      setTotal(res.pagination?.total ?? 0);
    } catch {
      toast('Failed to load news.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => loadData(), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    setDeletingId(id);
    try {
      await fetchApi(`/api/news/${id}`, { method: 'DELETE' });
      toast(`"${title}" was deleted successfully.`, 'success');
      setNewsList((prev) => prev.filter((n) => n._id !== id));
      setTotal((prev) => prev - 1);
    } catch {
      toast('Failed to delete article.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string, title: string) => {
    setTogglingId(id);
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await fetchApi(`/api/news/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      toast(`"${title}" is now ${newStatus}.`, 'success');
      setNewsList((prev) =>
        prev.map((n) => (n._id === id ? { ...n, status: newStatus } : n))
      );
    } catch {
      toast('Failed to update status.', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News & Blog</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isLoading ? 'Loading...' : `${total} article${total !== 1 ? 's' : ''} total`}
          </p>
        </div>
        <Link
          href="/dashboard/news/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Article
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          className="block w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <TableSkeleton />
        ) : newsList.length === 0 ? (
          <EmptyState search={search} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Article</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5 hidden sm:table-cell">Category</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Status</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {newsList.map((news) => (
                  <tr key={news._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {news.image ? (
                          <img
                            src={news.image}
                            alt={news.title.en}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-indigo-500" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-gray-900">{news.title.en}</p>
                            {news.featured && <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />}
                          </div>
                          <p className="text-xs text-gray-400">
                            {new Date(news.publishedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-gray-700 font-medium">{news.category?.en || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(news._id, news.status, news.title.en)}
                        disabled={togglingId === news._id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                          news.status === 'published'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        } disabled:opacity-50`}
                      >
                        {togglingId === news._id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : news.status === 'published' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span className="capitalize">{news.status}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/news/${news._id}/edit`}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(news._id, news.title.en)}
                          disabled={deletingId === news._id}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        >
                          {deletingId === news._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
