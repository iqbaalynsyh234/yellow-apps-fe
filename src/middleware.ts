import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token');
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');
  const isLogin = request.nextUrl.pathname === '/';

  // Jika sudah login dan akses halaman utama, redirect ke dashboard
  if (token && isLogin) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  if (!token && isDashboard) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
}; 