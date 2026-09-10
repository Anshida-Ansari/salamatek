'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchApi } from '@/lib/admin/api';
import { useToast } from '@/components/admin/ToastProvider';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Users,
  Loader2,
} from 'lucide-react';

interface Doctor {
  _id: string;
  name: { en: string; ar: string };
  designation?: { en: string };
  departmentId?: { name?: { en: string } };
  experienceYears?: number;
  active: boolean;
  image?: string;
}

interface Pagination {
  total: number;
  totalPages: number;
  page: number;
}

function TableSkeleton() {
  return (
    <div className="divide-y divide-gray-100">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 bg-gray-200 rounded w-40" />
            <div className="h-3 bg-gray-200 rounded w-28" />
          </div>
          <div className="hidden sm:block h-3 bg-gray-200 rounded w-24" />
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
        <Users className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-text-base mb-1">
        {search ? 'No results found' : 'No doctors yet'}
      </h3>
      <p className="text-sm text-text-muted text-center max-w-xs mb-6">
        {search
          ? `No doctors match "${search}". Try a different search term.`
          : 'Add your first doctor to display them on the public website.'}
      </p>
      {!search && (
        <Link
          href="/admin/dashboard/doctors/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-medium text-white text-sm font-semibold rounded-xl transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add First Doctor
        </Link>
      )}
    </div>
  );
}

export default function DoctorsPage() {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, totalPages: 1, page: 1 });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadDoctors = async (reset = false) => {
    setIsLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const res = await fetchApi(`/api/doctors?page=${currentPage}&limit=10&search=${encodeURIComponent(search)}`);
      setDoctors(res.data ?? []);
      setPagination(res.pagination ?? { total: 0, totalPages: 1, page: 1 });
    } catch {
      toast('Failed to load doctors. Check your API connection.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadDoctors(true);
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    loadDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?\n\nThis action cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await fetchApi(`/api/doctors/${id}`, { method: 'DELETE' });
      toast(`"${name}" was deleted successfully.`, 'success');
      loadDoctors();
    } catch {
      toast('Failed to delete doctor. Please try again.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean, name: string) => {
    setTogglingId(id);
    try {
      await fetchApi(`/api/doctors/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !currentActive }),
      });
      toast(`"${name}" is now ${!currentActive ? 'active' : 'inactive'}.`, 'success');
      setDoctors((prev) =>
        prev.map((d) => (d._id === id ? { ...d, active: !currentActive } : d))
      );
    } catch {
      toast('Failed to update status. Please try again.', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark">Doctors</h1>
          <p className="text-sm text-text-muted mt-1">
            {isLoading ? 'Loading...' : `${pagination.total} doctor${pagination.total !== 1 ? 's' : ''} total`}
          </p>
        </div>
        <Link
          href="/admin/dashboard/doctors/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand hover:bg-brand-medium text-white text-sm font-semibold rounded-xl transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Doctor
        </Link>
      </div>

      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
        <input
          type="text"
          className="block w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm text-text-base placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <TableSkeleton />
        ) : doctors.length === 0 ? (
          <EmptyState search={search} />
        ) : (
          <>
            {/* Desktop table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">
                      Doctor
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5 hidden sm:table-cell">
                      Department
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5 hidden md:table-cell">
                      Exp.
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
                  {doctors.map((doctor) => (
                    <tr key={doctor._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 flex-shrink-0">
                            {doctor.image ? (
                              <Image
                                src={doctor.image}
                                alt={doctor.name.en}
                                fill
                                sizes="40px"
                                className="rounded-full object-cover border border-gray-200"
                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                                <span className="text-blue-600 font-semibold text-sm">
                                  {doctor.name.en.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{doctor.name.en}</p>
                            <p className="text-xs text-gray-500 truncate">
                              {doctor.designation?.en || 'No designation'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="text-gray-700">
                          {doctor.departmentId?.name?.en || (
                            <span className="text-gray-400 italic">No department</span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-gray-700">
                          {doctor.experienceYears ? `${doctor.experienceYears} yrs` : '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleActive(doctor._id, doctor.active, doctor.name.en)}
                          disabled={togglingId === doctor._id}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                            doctor.active
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          } disabled:opacity-50`}
                        >
                          {togglingId === doctor._id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : doctor.active ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {doctor.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/dashboard/doctors/${doctor._id}/edit`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(doctor._id, doctor.name.en)}
                            disabled={deletingId === doctor._id}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === doctor._id ? (
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

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.totalPages} · {pagination.total} total
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
