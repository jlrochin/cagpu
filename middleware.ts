import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir el acceso directo a /login, documentación y solo a las APIs de autenticación
  if (pathname.startsWith('/login') || 
      pathname.startsWith('/documentacion') ||
      pathname.startsWith('/api/auth') || 
      pathname.startsWith('/api/ping')) {
    return NextResponse.next();
  }

  // Validar cookie 'auth' como JWT
  const authCookie = request.cookies.get('auth');
  if (!authCookie) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(authCookie.value, new TextEncoder().encode(JWT_SECRET));
  } catch (e) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|static|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.gif|api/auth/login|api/auth/crearusuario|api/auth/logout).*)',
  ],
}; 