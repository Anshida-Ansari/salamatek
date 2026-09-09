'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Activity,
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
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Doctors', href: '/dashboard/doctors', icon: Users },
  { name: 'Departments', href: '/dashboard/departments', icon: Building2 },
  { name: 'Services', href: '/dashboard/services', icon: Stethoscope },
  { name: 'Packages & Offers', href: '/dashboard/health-packages', icon: Package },
  { name: 'Careers', href: '/dashboard/careers', icon: Briefcase },
  { name: 'News & Blog', href: '/dashboard/news', icon: FileText },
  { name: 'SARC Enquiries', href: '/dashboard/sarc-enquiries', icon: HeartHandshake },
  { name: 'Job Applications', href: '/dashboard/job-applications', icon: FileText },
  { name: 'Contact Enquiries', href: '/dashboard/contact-enquiries', icon: Mail },
  { name: 'Appointments', href: '#', icon: Calendar, disabled: true },
  { name: 'Settings', href: '#', icon: Settings, disabled: true },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminRole, setAdminRole] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('adminUser');
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/login');
    } else if (user) {
      const parsed = JSON.parse(user);
      setAdminName(parsed.name || 'Admin');
      setAdminRole(parsed.role?.replace('_', ' ') || 'admin');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/login');
  };

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-5 bg-slate-950 border-b border-slate-800 flex-shrink-0">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Activity className="w-4 h-4 text-white" />
        </div>
        <span className="text-base font-bold text-white tracking-tight">Salamatek</span>
        <span className="text-xs text-slate-500 font-medium ml-0.5 mt-0.5">Admin</span>
        <button
          className="md:hidden ml-auto text-slate-400 hover:text-white"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {/* Active modules */}
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold px-3 mb-2 mt-1">
          Management
        </p>
        {navigation.slice(0, 9).map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              {item.name}
              {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-60" />}
            </Link>
          );
        })}

        {/* Coming soon */}
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold px-3 mb-2 mt-5">
          Coming Soon
        </p>
        {navigation.slice(9).map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 cursor-not-allowed select-none"
            >
              <Icon className="h-[18px] w-[18px] flex-shrink-0 text-slate-700" />
              {item.name}
              <span className="ml-auto text-[9px] uppercase tracking-wider font-bold text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded">
                Soon
              </span>
            </div>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="flex-shrink-0 p-3 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-800 transition group">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {adminName.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{adminName}</p>
            <p className="text-xs text-slate-500 capitalize truncate">{adminRole}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-slate-500 hover:text-red-400 transition flex-shrink-0"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
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
        <header className="bg-white border-b border-gray-200 flex-shrink-0">
          <div className="h-16 px-4 sm:px-6 flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb / page title area */}
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-500">
                Salamatek Medical Centre
              </p>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4 ml-auto">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {adminName.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {adminName || 'Admin'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium transition px-3 py-1.5 rounded-lg hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
