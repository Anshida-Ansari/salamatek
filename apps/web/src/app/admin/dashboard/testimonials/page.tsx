'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/admin/api';
import { useToast } from '@/components/admin/ToastProvider';
import { Pagination } from '@/components/admin/Pagination';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Loader2,
  Star
} from 'lucide-react';

interface Testimonial {
  _id: string;
  name: { en: string; ar: string };
  rating: number;
  text: { en: string; ar: string };
  date?: string;
  active: boolean;
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
      <div className="w-16 h-16 bg-surface-mint rounded-2xl flex items-center justify-center mb-4 text-brand-medium">
        <MessageSquare className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-text-base mb-1">
        {search ? 'No results found' : 'No testimonials yet'}
      </h3>
      <p className="text-sm text-text-muted text-center max-w-xs mb-6">
        {search
          ? `No testimonials match "${search}".`
          : 'Add your first testimonial to get started.'}
      </p>
      {!search && (
        <Link
          href="/admin/dashboard/testimonials/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-medium text-white text-sm font-semibold rounded-xl transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add First Testimonial
        </Link>
      )}
    </div>
  );
}

export default function TestimonialsPage() {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchApi(`/api/testimonials?limit=10&page=${page}&search=${encodeURIComponent(search)}`);
      setTestimonials(res.data ?? []);
      setTotal(res.pagination?.total ?? 0);
      setTotalPages(res.pagination?.totalPages ?? 1);
    } catch {
      toast('Failed to load testimonials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => loadData(), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?\n\nThis action cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await fetchApi(`/api/testimonials/${id}`, { method: 'DELETE' });
      toast(`"${name}" was deleted successfully.`, 'success');
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
      setTotal((prev) => prev - 1);
    } catch {
      toast('Failed to delete testimonial.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean, name: string) => {
    setTogglingId(id);
    try {
      await fetchApi(`/api/testimonials/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !currentActive }),
      });
      toast(`"${name}" is now ${!currentActive ? 'active' : 'inactive'}.`, 'success');
      setTestimonials((prev) =>
        prev.map((t) => (t._id === id ? { ...t, active: !currentActive } : t))
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
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark">Testimonials</h1>
          <p className="text-sm text-text-muted mt-1">
            {isLoading ? 'Loading...' : `${total} testimonial${total !== 1 ? 's' : ''} total`}
          </p>
        </div>
        <Link
          href="/admin/dashboard/testimonials/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand hover:bg-brand-medium text-white text-sm font-semibold rounded-xl transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
        <input
          type="text"
          className="block w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium"
          placeholder="Search testimonials..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <TableSkeleton />
        ) : testimonials.length === 0 ? (
          <EmptyState search={search} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">
                    Reviewer
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">
                    Rating
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5 hidden sm:table-cell">
                    Arabic Name
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">
                    Status
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {testimonials.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-700 font-bold">
                           {t.name.en.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">{t.name.en}</p>
                          <p className="text-xs text-gray-400 line-clamp-1">{t.text.en.substring(0, 30)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-900">{t.rating}</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-gray-700" dir="rtl">{t.name.ar || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(t._id, t.active, t.name.en)}
                        disabled={togglingId === t._id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                          t.active
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } disabled:opacity-50`}
                      >
                        {togglingId === t._id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : t.active ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {t.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/dashboard/testimonials/${t._id}/edit`}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(t._id, t.name.en)}
                          disabled={deletingId === t._id}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        >
                          {deletingId === t._id ? (
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
        
        {!isLoading && testimonials && testimonials.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
