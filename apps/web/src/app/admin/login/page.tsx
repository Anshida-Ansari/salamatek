'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import Image from 'next/image';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const token = data.data.token;
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(data.data));
        
        // Set cookie with 30-day expiry for Next.js middleware
        const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
        document.cookie = `adminToken=${token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax${isSecure ? '; Secure' : ''}`;
        
        router.push(redirectTarget);
      } else {
        setError(data.message || 'Invalid email or password. Please try again.');
      }
    } catch {
      setError('Network error — is the API server running on port 5000?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-border/80 p-8 sm:p-10">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-base">Sign in to your account</h2>
        <p className="text-text-muted text-sm mt-1">
          Enter your administrative credentials to continue
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleLogin}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2.5">
            <span className="mt-0.5 text-red-500 font-bold">⚠</span>
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
              <Mail className="h-4.5 w-4.5" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 bg-surface-light border border-border rounded-xl text-sm text-text-base placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium transition"
              placeholder="admin@salamatek.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
              <Lock className="h-4.5 w-4.5" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 bg-surface-light border border-border rounded-xl text-sm text-text-base placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium transition"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 bg-brand hover:bg-brand-medium disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-medium focus:ring-offset-2 flex items-center justify-center gap-2 group cursor-pointer"
        >
          {isLoading && (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          <span>{isLoading ? 'Signing in…' : 'Sign in to Dashboard'}</span>
          {!isLoading && (
            <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
          )}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-dark via-[#0C3528] to-[#08221A] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle ambient light circles matching public brand */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-brand-light/10 blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-8 flex flex-col items-center text-center relative z-10">
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-xl border border-white/20 p-2">
          <Image
            src="/images/logo.png"
            alt="Salamatek Logo"
            width={72}
            height={72}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
          Salamatek Admin
        </h1>
        <p className="text-white/70 text-sm mt-1">
          Salamatek Medical Centre Management Portal
        </p>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full flex justify-center">
        <Suspense fallback={<div className="w-full max-w-md h-80 bg-white/90 rounded-3xl animate-pulse" />}>
          <LoginForm />
        </Suspense>
      </div>

      <p className="relative z-10 text-white/40 text-xs mt-8">
        Salamatek Medical Centre • Authorized Personnel Only
      </p>
    </div>
  );
}
