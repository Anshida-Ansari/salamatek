'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Trash2, Eye, CheckCircle, Clock, Archive, Inbox } from 'lucide-react';
import { fetchApi } from '@/lib/admin/api';

type EnquiryStatus = 'new' | 'in_progress' | 'resolved' | 'archived';

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
}

const statusColors: Record<EnquiryStatus, { bg: string, text: string, icon: any }> = {
  new: { bg: 'bg-surface-mint', text: 'text-brand-dark', icon: Inbox },
  in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
  resolved: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle },
  archived: { bg: 'bg-gray-100', text: 'text-gray-700', icon: Archive },
};

export default function ContactEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus | 'all'>('all');
  
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const fetchEnquiries = async () => {
    try {
      setIsLoading(true);
      
      const query = new URLSearchParams();
      if (statusFilter !== 'all') query.append('status', statusFilter);
      if (searchTerm) query.append('search', searchTerm);

      const data = await fetchApi(`/api/contact-enquiries?${query.toString()}`);
      
      if (data.success) {
        setEnquiries(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch enquiries');
      }
    } catch (err: any) {
      console.error(err.message || 'Failed to fetch enquiries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: EnquiryStatus) => {
    try {
      const data = await fetchApi(`/api/contact-enquiries/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      if (data.success) {
        setEnquiries(prev => prev.map(e => e._id === id ? { ...e, status: newStatus } : e));
        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
        }
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    
    try {
      const data = await fetchApi(`/api/contact-enquiries/${id}`, {
        method: 'DELETE',
      });
      if (data.success) {
        setEnquiries(prev => prev.filter(e => e._id !== id));
        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry(null);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete enquiry');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark">Contact Enquiries</h1>
          <p className="text-sm text-text-muted mt-1">
            Manage form submissions from the website contact page.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-card">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search by name, email or subject..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchEnquiries()}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                className="border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#8E2829]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 font-semibold text-gray-700">Subject</th>
                  <th className="px-6 py-3 font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 font-semibold text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading enquiries...</td>
                  </tr>
                ) : enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No enquiries found.</td>
                  </tr>
                ) : (
                  enquiries.map((enq) => {
                    const StatusIcon = statusColors[enq.status].icon;
                    return (
                      <tr key={enq._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {new Date(enq.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{enq.name}</div>
                          <div className="text-gray-500 text-xs">{enq.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-[200px] truncate" title={enq.subject}>{enq.subject}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[enq.status].bg} ${statusColors[enq.status].text}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {enq.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setSelectedEnquiry(enq)}
                            className="p-1.5 text-gray-500 hover:text-[#8E2829] bg-gray-100 hover:bg-gray-200 rounded transition mr-2"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(enq._id)}
                            className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Enquiry Details Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Enquiry Details</h2>
                <p className="text-sm text-gray-500">Submitted on {new Date(selectedEnquiry.createdAt).toLocaleString()}</p>
              </div>
              <button 
                onClick={() => setSelectedEnquiry(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Name</label>
                  <p className="mt-1 text-gray-900">{selectedEnquiry.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Status</label>
                  <select 
                    className="mt-1 block w-full border rounded-md px-3 py-1.5 text-sm"
                    value={selectedEnquiry.status}
                    onChange={(e) => handleUpdateStatus(selectedEnquiry._id, e.target.value as EnquiryStatus)}
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Email</label>
                  <a href={`mailto:${selectedEnquiry.email}`} className="mt-1 text-[#8E2829] hover:underline block truncate">{selectedEnquiry.email}</a>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Phone</label>
                  <a href={`tel:${selectedEnquiry.phone}`} className="mt-1 text-[#8E2829] hover:underline block">{selectedEnquiry.phone}</a>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Subject</label>
                <p className="mt-1 text-gray-900 font-medium">{selectedEnquiry.subject}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Message</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg text-gray-700 whitespace-pre-wrap border border-gray-100">
                  {selectedEnquiry.message}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <button 
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 bg-white border rounded-md font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
