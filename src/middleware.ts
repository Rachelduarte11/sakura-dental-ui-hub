import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que requieren autenticación
const protectedRoutes = [
  '/home',
  '/patients',
  '/doctors',
  '/services',
  '/quotes',
  '/sales',
  '/inventory',
  '/finances',
  '/payments',
  '/agenda',
  '/settings',
];

// Rutas públicas
const publicRoutes = ['/login', '/register', '/welcome'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar si el usuario está autenticado
  const token = request.cookies.get('token')?.value;
  const isAuthenticated = !!token;

  // Si es una ruta protegida y no está autenticado
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si está autenticado y trata de acceder a rutas públicas
  if (publicRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 