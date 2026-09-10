'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  Users,
  Building2,
  Stethoscope,
  Package,
  HeartHandshake,
  Briefcase,
  FileText,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Mail,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Doctors', href: '/admin/dashboard/doctors', icon: Users },
  { name: 'Departments', href: '/admin/dashboard/departments', icon: Building2 },
  { name: 'Services', href: '/admin/dashboard/services', icon: Stethoscope },
  { name: 'Packages & Offers', href: '/admin/dashboard/health-packages', icon: Package },
  { name: 'Careers', href: '/admin/dashboard/careers', icon: Briefcase },
  { name: 'News & Blog', href: '/admin/dashboard/news', icon: FileText },
  { name: 'SARC Enquiries', href: '/admin/dashboard/sarc-enquiries', icon: HeartHandshake },
  { name: 'Job Applications', href: '/admin/dashboard/job-applications', icon: FileText },
  { name: 'Contact Enquiries', href: '/admin/dashboard/contact-enquiries', icon: Mail },
  { name: 'Site Settings', href: '/admin/dashboard/site-settings', icon: Settings },
  { name: 'Appointments', href: '#', icon: Calendar, disabled: true },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminRole, setAdminRole] = useState('');
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('adminUser');
    const token = localStorage.getItem('adminToken');

    if (!token) {
      document.cookie = 'adminToken=; path=/; max-age=0; SameSite=Lax';
      setIsAuthorized(false);
      router.push('/admin/login');
    } else {
      if (user) {
        try {
          const parsed = JSON.parse(user);
          setAdminName(parsed.name || 'Admin');
          setAdminRole(parsed.role?.replace('_', ' ') || 'admin');
        } catch {
          setAdminName('Admin');
        }
      }
      setIsAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    document.cookie = 'adminToken=; path=/; max-age=0; SameSite=Lax';
    router.push('/admin/login');
  };

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-md border border-border flex items-center justify-center p-2 mb-4 animate-pulse">
          <Image src="/images/logo.png" alt="Salamatek" width={48} height={48} className="object-contain" />
        </div>
        <p className="text-sm font-medium text-text-muted">Loading administrative dashboard…</p>
      </div>
    );
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-brand-dark text-white border-r border-white/10">
      {/* Brand Logo Header */}
      <div className="flex items-center gap-3 h-16 px-5 bg-[#08231A] border-b border-white/10 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/10 p-1 border border-white/15 shadow-sm flex-shrink-0">
          <Image src="/images/logo.png" alt="Salamatek Logo" width={32} height={32} className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-base font-serif font-bold text-white tracking-tight leading-none">
            Salamatek
          </span>
          <span className="text-[11px] text-brand-pale font-medium mt-1">
            Admin Portal
          </span>
        </div>
        <button
          className="md:hidden ml-auto text-white/60 hover:text-white p-1"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {/* Active modules */}
        <p className="text-[10px] uppercase tracking-widest text-brand-pale/70 font-bold px-3 mb-2 mt-1">
          Management
        </p>
        {navigation.slice(0, 11).map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand text-white shadow-sm font-semibold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-brand-pale/80 group-hover:text-white'
                }`}
              />
              <span className="truncate">{item.name}</span>
              {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-70" />}
            </Link>
          );
        })}

        {/* Coming soon */}
        <p className="text-[10px] uppercase tracking-widest text-brand-pale/50 font-bold px-3 mb-2 mt-6">
          Upcoming
        </p>
        {navigation.slice(11).map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/30 cursor-not-allowed select-none"
            >
              <Icon className="h-[18px] w-[18px] flex-shrink-0 text-white/25" />
              <span>{item.name}</span>
              <span className="ml-auto text-[9px] uppercase tracking-wider font-bold text-white/50 bg-white/10 px-1.5 py-0.5 rounded">
                Soon
              </span>
            </div>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="flex-shrink-0 p-3 border-t border-white/10 bg-[#08231A]">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition group">
          <div className="w-8 h-8 rounded-full bg-brand-medium flex items-center justify-center flex-shrink-0 ring-1 ring-white/20">
            <span className="text-white text-xs font-bold">
              {adminName.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{adminName}</p>
            <p className="text-xs text-brand-pale capitalize truncate">{adminRole}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="text-white/50 hover:text-brand-red hover:bg-white/10 p-1.5 rounded-lg transition flex-shrink-0 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-[#F8FAF9]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-brand-dark/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-border flex-shrink-0 shadow-card">
          <div className="h-16 px-4 sm:px-6 flex items-center justify-between">
            {/* Left side / Mobile brand & menu */}
            <div className="flex items-center gap-3">
              <button
                className="md:hidden p-2 rounded-lg text-text-muted hover:bg-surface-mint hover:text-brand-dark transition"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 md:hidden">
                <Image src="/icon.png" alt="Salamatek" width={22} height={22} className="w-5 h-5 object-contain" />
                <span className="font-serif font-bold text-brand-dark text-sm">Salamatek</span>
              </div>
            </div>

            {/* Breadcrumb / page title area */}
            <div className="hidden md:flex items-center gap-2.5 text-sm">
              <Image src="/icon.png" alt="Salamatek" width={18} height={18} className="w-4.5 h-4.5 object-contain" />
              <span className="font-semibold text-text-base">Salamatek Medical Centre</span>
              <span className="text-text-muted">•</span>
              <span className="text-text-muted capitalize">{pathname.split('/')[3] || 'Dashboard'}</span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3 sm:gap-4 ml-auto">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-surface-mint text-brand-dark text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-brand-medium animate-pulse" />
                <span className="hidden sm:inline">{adminName || 'Admin'}</span>
                <span className="sm:hidden">{adminName.split(' ')[0] || 'Admin'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-brand-red hover:text-brand-red-dark font-semibold transition px-3 py-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[#F8FAF9]">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
