import { NextRequest, NextResponse } from 'next/server';
import { LOCALES, DEFAULT_LOCALE } from './i18n/config';

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = LOCALES.some(
    (locale) =>
      pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  // Exclude API routes and upload files from locale redirection
  if (pathname.startsWith('/api') || pathname.startsWith('/uploads')) {
    return NextResponse.next();
  }

  // Admin route protection & session handling
  if (pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get('adminToken')?.value;

    if (pathname === '/admin' || pathname === '/admin/') {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = adminToken ? '/admin/dashboard' : '/admin/login';
      return NextResponse.redirect(redirectUrl);
    }

    if (pathname === '/admin/login') {
      if (adminToken) {
        const dashboardUrl = request.nextUrl.clone();
        dashboardUrl.pathname = '/admin/dashboard';
        return NextResponse.redirect(dashboardUrl);
      }
      return NextResponse.next();
    }

    if (pathname.startsWith('/admin/dashboard')) {
      if (!adminToken) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/admin/login';
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.next();
    }

    return NextResponse.next();
  }

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
};
