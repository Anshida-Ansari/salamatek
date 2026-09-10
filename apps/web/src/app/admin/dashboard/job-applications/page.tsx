'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/admin/api';
import { useToast } from '@/components/admin/ToastProvider';
import {
  Search,
  Trash2,
  Users,
  Loader2,
  Mail,
  Phone,
  Briefcase,
  FileText,
} from 'lucide-react';

interface JobApplication {
  _id: string;
  careerId: {
    _id: string;
    title: { en: string; ar: string };
    slug: string;
  };
  fullName: string;
  email: string;
  phone: string;
  coverLetter?: string;
  resumeUrl: string;
  status: 'new' | 'reviewed' | 'rejected' | 'hired';
  createdAt: string;
}

function TableSkeleton() {
  return (
    <div className="divide-y divide-gray-100">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
          <div className="w-10 h-10 rounded-lg bg-gray-200 flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 bg-gray-200 rounded w-48" />
            <div className="h-3 bg-gray-200 rounded w-32" />
          </div>
          <div className="h-5 bg-gray-200 rounded-full w-24" />
          <div className="h-8 w-8 bg-gray-200 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export default function JobApplicationsPage() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchApi(`/api/job-applications?limit=50&search=${encodeURIComponent(search)}`);
      setApplications(res.data ?? []);
      setTotal(res.pagination?.total ?? 0);
    } catch {
      toast('Failed to load job applications.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => loadData(), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the application from "${name}"?`)) return;
    setDeletingId(id);
    try {
      await fetchApi(`/api/job-applications/${id}`, { method: 'DELETE' });
      toast(`Application deleted successfully.`, 'success');
      setApplications((prev) => prev.filter((a) => a._id !== id));
      setTotal((prev) => prev - 1);
    } catch {
      toast('Failed to delete application.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await fetchApi(`/api/job-applications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      toast(`Status updated to ${newStatus}.`, 'success');
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus as JobApplication['status'] } : a))
      );
    } catch {
      toast('Failed to update status.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark">Job Applications</h1>
          <p className="text-sm text-text-muted mt-1">
            {isLoading ? 'Loading...' : `${total} applicant${total !== 1 ? 's' : ''} total`}
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
        <input
          type="text"
          className="block w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <TableSkeleton />
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              {search ? 'No results found' : 'No applications yet'}
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-xs">
              {search
                ? `No applications match "${search}".`
                : 'When candidates apply for jobs, their applications will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Candidate Details</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5 hidden sm:table-cell">Job Applied</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Status</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="font-semibold text-gray-900">{app.fullName}</div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {app.email}</span>
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {app.phone}</span>
                        </div>
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-brand hover:text-brand-medium font-semibold mt-1 w-fit"
                        >
                          <FileText className="w-3 h-3" /> View Resume
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="flex flex-col gap-1 max-w-xs">
                        <span className="flex items-center gap-1.5 font-medium text-gray-800">
                          <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                          {app.careerId?.title?.en || 'Unknown Job'}
                        </span>
                        {app.coverLetter && <p className="text-xs text-gray-500 truncate mt-1">&quot;{app.coverLetter}&quot;</p>}
                        <span className="text-xs text-gray-400 mt-1">{new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {updatingId === app._id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-brand-medium" />
                        ) : (
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                            className={`text-xs font-semibold rounded-full px-2.5 py-1 border-0 ring-1 ring-inset focus:ring-2 focus:ring-brand-medium cursor-pointer ${
                              app.status === 'new'
                                ? 'bg-surface-mint text-brand-dark ring-brand-pale'
                                : app.status === 'reviewed'
                                ? 'bg-purple-50 text-purple-700 ring-purple-200'
                                : app.status === 'hired'
                                ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                                : 'bg-red-50 text-red-700 ring-red-200'
                            }`}
                          >
                            <option value="new">New</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="hired">Hired</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(app._id, app.fullName)}
                        disabled={deletingId === app._id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                      >
                        {deletingId === app._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
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
