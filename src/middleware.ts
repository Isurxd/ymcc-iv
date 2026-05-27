import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

const PROTECTED_ROUTES = {
  MERCH_CART: '/cart',
  ADMIN: '/admin',
  OPERATOR: '/operator',
  FUNDRAISING: '/fundraising',
  SUPERADMIN: '/superadmin'
};

const PUBLIC_ROUTES = ['/login', '/register', '/about', '/events', '/contact', '/merch', '/status', '/api/auth/login', '/api/auth/register', '/api/auth/logout', '/api/participant-count'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Lewati file statis Next.js
  if (path.startsWith('/_next') || path.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/)) {
    return NextResponse.next();
  }

  // Izinkan public routes & root home page
  if (path === '/' || PUBLIC_ROUTES.some(r => path.startsWith(r))) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get('session_token')?.value;

  if (!sessionToken) {
    // Jika akses private dan belum login, lempar ke /login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verifikasi dan dekripsi JWT Custom (Edge Runtime safe via jose)
  const payload = await decrypt(sessionToken);

  if (!payload) {
    // Token tidak valid atau kedaluwarsa
    const res = NextResponse.redirect(new URL('/login', request.url));
    res.cookies.delete('session_token');
    return res;
  }

  // Terapkan Role-Based Access Control (RBAC)
  const role = payload.role as string;
  
  // Proteksi rute (Frontend & API)
  const isAdminPath = path.startsWith('/admin') || path.startsWith('/api/admin');
  const isOperatorPath = path.startsWith('/operator') || path.startsWith('/api/operator');
  const isFundraisingPath = path.startsWith('/fundraising') || path.startsWith('/api/fundraising');
  const isSuperAdminPath = path.startsWith('/superadmin') || path.startsWith('/api/superadmin');
  const isCartPath = path.startsWith('/cart');

  if (isSuperAdminPath && role !== 'SUPERADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isAdminPath && role !== 'ADMIN' && role !== 'SUPERADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  if (isOperatorPath && role !== 'OPERATOR' && role !== 'SUPERADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  if (isFundraisingPath && role !== 'FUNDRAISING' && role !== 'SUPERADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  if (isCartPath && role !== 'USER') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
