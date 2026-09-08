import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

const ADMIN_SECTIONS = [
  { label: 'Homepage Content', icon: '🏠', phase: 1 },
  { label: 'About', icon: 'ℹ️', phase: 2 },
  { label: 'Departments', icon: '🏥', phase: 2 },
  { label: 'Services', icon: '⚕️', phase: 2 },
  { label: 'Doctors', icon: '👨‍⚕️', phase: 2 },
  { label: 'Doctor Schedules', icon: '📅', phase: 2 },
  { label: 'Health Packages', icon: '📦', phase: 2 },
  { label: 'Offers', icon: '🎁', phase: 2 },
  { label: 'SARC', icon: '🔬', phase: 2 },
  { label: 'Careers & Vacancies', icon: '💼', phase: 3 },
  { label: 'News & Blog', icon: '📰', phase: 3 },
  { label: 'Appointment Enquiries', icon: '📋', phase: 3 },
  { label: 'Contact Information', icon: '📞', phase: 3 },
  { label: 'Media & Images', icon: '🖼️', phase: 3 },
  { label: 'SEO Metadata', icon: '🔍', phase: 4 },
  { label: 'Website Settings', icon: '⚙️', phase: 4 },
] as const;

/**
 * Admin dashboard home — Phase 0 shell.
 * Full dashboard UI and authentication will be implemented in Phase 3.
 */
export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-950 to-brand-800 p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-brand-200 ring-1 ring-white/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            Phase 0 — Monorepo Foundation ✓
          </div>
          <h1 className="text-3xl font-bold text-white">
            Salamatek Admin Dashboard
          </h1>
          <p className="mt-2 text-brand-300">
            Content management for Salamatek Medical Centre
          </p>
        </div>

        {/* Status */}
        <div className="mb-8 rounded-xl bg-white/5 p-5 ring-1 ring-white/10">
          <p className="text-sm font-medium text-brand-300">
            ⚠️ Authentication and full dashboard UI will be implemented in Phase
            3. This is the Phase 0 shell.
          </p>
        </div>

        {/* Sections grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {ADMIN_SECTIONS.map((section) => (
            <div
              key={section.label}
              className="flex flex-col gap-2 rounded-xl bg-white/5 p-4 ring-1 ring-white/10"
            >
              <span className="text-2xl" role="img" aria-label={section.label}>
                {section.icon}
              </span>
              <p className="text-sm font-medium text-white">{section.label}</p>
              <p className="text-xs text-brand-400">Phase {section.phase}</p>
            </div>
          ))}
        </div>

        {/* API status */}
        <div className="mt-8 flex items-center justify-between rounded-xl bg-white/5 px-5 py-3 ring-1 ring-white/10">
          <span className="text-sm text-brand-300">API Endpoint</span>
          <code className="text-xs text-emerald-400">
            {process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000'}/api/v1/health
          </code>
        </div>
      </div>
    </main>
  );
}
