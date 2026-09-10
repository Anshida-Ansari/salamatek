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
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
