import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('@FinanceApp:token')?.value
  const path = request.nextUrl.pathname

  // Se estiver na home, redireciona para login ou dashboard
  if (path === '/') {
    return token 
      ? NextResponse.redirect(new URL('/dashboard', request.url))
      : NextResponse.redirect(new URL('/login', request.url))
  }

  // Se estiver em rotas de auth e tiver token, redireciona para dashboard
  if ((path === '/login' || path === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Se estiver em rotas protegidas e não tiver token, redireciona para login
  if (path.startsWith('/dashboard') && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard/:path*'
  ]
} 