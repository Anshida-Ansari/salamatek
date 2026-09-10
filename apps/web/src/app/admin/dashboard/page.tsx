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
    <div className="bg-white rounded-2xl border border-border p-6 shadow-card animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-surface-mint rounded-xl" />
        <div className="w-16 h-8 bg-surface-mint rounded" />
      </div>
      <div className="w-24 h-4 bg-surface-mint rounded" />
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
      href: '/admin/dashboard/doctors',
      linkLabel: 'Manage doctors',
    },
    {
      name: 'Departments',
      value: stats.departments,
      icon: Building2,
      href: '/admin/dashboard/departments',
      linkLabel: 'Manage departments',
    },
    {
      name: 'Services',
      value: stats.services,
      icon: Stethoscope,
      href: '/admin/dashboard/services',
      linkLabel: 'Manage services',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark">Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">
            Overview of Salamatek Medical Centre content and active records.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-brand-dark bg-surface-mint border border-brand-pale/40 px-3.5 py-2 rounded-xl">
          <TrendingUp className="w-3.5 h-3.5 text-brand-medium" />
          Live system data
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <span className="font-bold">⚠</span> {error}
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
                  className="bg-white rounded-2xl border border-border p-6 hover:border-brand-pale hover:shadow-card-md transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-surface-mint flex items-center justify-center text-brand-medium group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-serif font-bold text-brand-dark">
                      {item.value}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-text-base mb-3">{item.name}</p>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:text-brand-medium group-hover:gap-2 transition-all uppercase tracking-wider"
                  >
                    <span>{item.linkLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-base font-bold text-text-base mb-4 uppercase tracking-wider text-xs">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Add Doctor', href: '/admin/dashboard/doctors/new' },
            { label: 'Add Department', href: '/admin/dashboard/departments/new' },
            { label: 'Add Service', href: '/admin/dashboard/services/new' },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl border-2 border-dashed border-border hover:border-brand-medium hover:bg-surface-mint text-sm font-semibold text-brand-dark transition-all duration-200 group"
            >
              <span className="text-brand-medium group-hover:scale-125 transition-transform font-bold">+</span>
              <span>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
