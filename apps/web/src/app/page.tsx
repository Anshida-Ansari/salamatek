import type { Metadata } from 'next';
import { SITE_NAME } from '@salamatek/config';

export const metadata: Metadata = {
  title: SITE_NAME.en,
};

/**
 * Home page — Phase 0 shell.
 * Full homepage UI will be implemented in Phase 1.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 px-4 text-white">
      <div className="max-w-2xl text-center">
        {/* Logo placeholder */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-10 w-10 text-white"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M11.25 3.75a.75.75 0 0 1 1.5 0v.938a7.502 7.502 0 0 1 6.562 6.562H20.25a.75.75 0 0 1 0 1.5h-.938a7.502 7.502 0 0 1-6.562 6.562v.938a.75.75 0 0 1-1.5 0v-.938a7.502 7.502 0 0 1-6.562-6.562H3.75a.75.75 0 0 1 0-1.5h.938A7.502 7.502 0 0 1 11.25 4.688V3.75Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Salamatek Medical Centre
        </h1>
        <p className="mb-2 text-xl text-brand-200">
          مركز سلامتك الطبي
        </p>
        <p className="mb-10 text-brand-300">
          Your trusted healthcare partner — شريكك الموثوق في الرعاية الصحية
        </p>

        {/* Phase badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium ring-1 ring-white/20 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          Phase 0 — Monorepo Foundation ✓
        </div>

        {/* Status grid */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: 'Public Website', status: 'Running', port: '3000' },
            { label: 'Admin Dashboard', status: 'Running', port: '3001' },
            { label: 'API Server', status: 'Running', port: '4000' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-sm"
            >
              <p className="text-xs font-medium uppercase tracking-widest text-brand-300">
                {item.label}
              </p>
              <p className="mt-1 text-lg font-semibold">:{item.port}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                {item.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
