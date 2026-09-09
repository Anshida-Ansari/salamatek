'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/admin/api';
import { Users, Building2, Stethoscope, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  doctors: number;
  departments: number;
  services: number;
}

function StatSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl" />
        <div className="w-16 h-5 bg-gray-200 rounded" />
      </div>
      <div className="w-10 h-8 bg-gray-200 rounded mb-1" />
      <div className="w-24 h-4 bg-gray-200 rounded" />
    </div>
  );
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<Stats>({ doctors: 0, departments: 0, services: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadStats() {
      try {
        const [docsRes, depsRes, srvsRes] = await Promise.all([
          fetchApi('/api/doctors?limit=1'),
          fetchApi('/api/departments?limit=1'),
          fetchApi('/api/services?limit=1'),
        ]);
        setStats({
          doctors: docsRes.pagination?.total ?? 0,
          departments: depsRes.pagination?.total ?? 0,
          services: srvsRes.pagination?.total ?? 0,
        });
      } catch {
        setError('Failed to load statistics. Check the API connection.');
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const statCards = [
    {
      name: 'Total Doctors',
      value: stats.doctors,
      icon: Users,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      href: '/admin/dashboard/doctors',
      linkLabel: 'Manage doctors',
    },
    {
      name: 'Departments',
      value: stats.departments,
      icon: Building2,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      href: '/admin/dashboard/departments',
      linkLabel: 'Manage departments',
    },
    {
      name: 'Services',
      value: stats.services,
      icon: Stethoscope,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      href: '/admin/dashboard/services',
      linkLabel: 'Manage services',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Overview of Salamatek Medical Centre content.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg">
          <TrendingUp className="w-3.5 h-3.5" />
          Live data
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          ⚠ {error}
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {isLoading
          ? [1, 2, 3].map((i) => <StatSkeleton key={i} />)
          : statCards.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${item.lightColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${item.textColor}`} />
                    </div>
                    <span className={`text-3xl font-bold text-gray-900`}>
                      {item.value}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-3">{item.name}</p>
                  <Link
                    href={item.href}
                    className={`inline-flex items-center gap-1 text-xs font-semibold ${item.textColor} group-hover:gap-2 transition-all`}
                  >
                    {item.linkLabel}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Add Doctor', href: '/admin/dashboard/doctors/new', color: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50' },
            { label: 'Add Department', href: '/admin/dashboard/departments/new', color: 'border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50' },
            { label: 'Add Service', href: '/admin/dashboard/services/new', color: 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50' },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed text-sm font-semibold text-gray-600 transition-all ${action.color}`}
            >
              + {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
