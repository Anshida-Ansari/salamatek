import type { Metadata } from 'next';
import './admin.css';
import { ToastProvider } from '@/components/admin/ToastProvider';

export const metadata: Metadata = {
  title: {
    default: 'Salamatek Admin',
    template: '%s | Salamatek Admin',
  },
  description: 'Salamatek Medical Centre — Admin Dashboard',
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root min-h-screen bg-slate-50 text-slate-900" dir="ltr">
      <ToastProvider>{children}</ToastProvider>
    </div>
  );
}
