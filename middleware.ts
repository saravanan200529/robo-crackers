import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionToken =
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value ||
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value;

  // Protect /api/admin/* endpoints with 401 JSON
  if (pathname.startsWith('/api/admin')) {
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized — Admin session required' }, { status: 401 });
    }
  }

  // Protect /admin/* web routes except login page
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!sessionToken) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

