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
  Package,
  Loader2,
  Star,
} from 'lucide-react';

interface HealthPackage {
  _id: string;
  title: { en: string; ar: string };
  slug: string;
  price?: string;
  active: boolean;
  featured: boolean;
  image?: string;
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
        <Package className="w-8 h-8 text-indigo-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-800 mb-1">
        {search ? 'No results found' : 'No packages yet'}
      </h3>
      <p className="text-sm text-gray-500 text-center max-w-xs mb-6">
        {search
          ? `No packages match "${search}".`
          : 'Create your first health package or offer.'}
      </p>
      {!search && (
        <Link
          href="/dashboard/health-packages/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Add First Package
        </Link>
      )}
    </div>
  );
}

export default function HealthPackagesPage() {
  const { toast } = useToast();
  const [packages, setPackages] = useState<HealthPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchApi(`/api/health-packages?limit=50&search=${encodeURIComponent(search)}`);
      setPackages(res.data ?? []);
      setTotal(res.pagination?.total ?? 0);
    } catch {
      toast('Failed to load packages.', 'error');
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
      await fetchApi(`/api/health-packages/${id}`, { method: 'DELETE' });
      toast(`"${title}" was deleted successfully.`, 'success');
      setPackages((prev) => prev.filter((p) => p._id !== id));
      setTotal((prev) => prev - 1);
    } catch {
      toast('Failed to delete package.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean, title: string) => {
    setTogglingId(id);
    try {
      await fetchApi(`/api/health-packages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !currentActive }),
      });
      toast(`"${title}" is now ${!currentActive ? 'active' : 'inactive'}.`, 'success');
      setPackages((prev) =>
        prev.map((p) => (p._id === id ? { ...p, active: !currentActive } : p))
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
          <h1 className="text-2xl font-bold text-gray-900">Health Packages</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isLoading ? 'Loading...' : `${total} package${total !== 1 ? 's' : ''} total`}
          </p>
        </div>
        <Link
          href="/dashboard/health-packages/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Package
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          className="block w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Search packages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <TableSkeleton />
        ) : packages.length === 0 ? (
          <EmptyState search={search} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Package</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5 hidden sm:table-cell">Price</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Status</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {packages.map((pkg) => (
                  <tr key={pkg._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {pkg.image ? (
                          <img
                            src={pkg.image}
                            alt={pkg.title.en}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-indigo-500" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-gray-900">{pkg.title.en}</p>
                            {pkg.featured && <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />}
                          </div>
                          <p className="text-xs text-gray-400">/{pkg.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-gray-700 font-medium">{pkg.price || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(pkg._id, pkg.active, pkg.title.en)}
                        disabled={togglingId === pkg._id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                          pkg.active
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } disabled:opacity-50`}
                      >
                        {togglingId === pkg._id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : pkg.active ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {pkg.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/health-packages/${pkg._id}/edit`}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(pkg._id, pkg.title.en)}
                          disabled={deletingId === pkg._id}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        >
                          {deletingId === pkg._id ? (
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
