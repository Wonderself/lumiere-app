import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

/**
 * Middleware: protects dashboard/admin/profile routes.
 * Redirects unauthenticated users to login.
 * Redirects authenticated users away from auth pages.
 */
export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  // Protected routes requiring authentication
  const protectedPrefixes = ['/dashboard', '/admin', '/profile', '/tasks', '/tokenization']
  const isProtectedRoute = protectedPrefixes.some((p) => pathname.startsWith(p))

  // Auth pages (login, register, etc.)
  const authPrefixes = ['/login', '/register', '/forgot-password', '/reset-password']
  const isAuthPage = authPrefixes.some((p) => pathname.startsWith(p))

  // Admin-only routes
  const isAdminRoute = pathname.startsWith('/admin')

  // Redirect unauthenticated users to login
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', req.nextUrl)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  // Admin route protection (check role from JWT token)
  if (isAdminRoute && isLoggedIn) {
    const role = req.auth?.user?.role
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (API routes handle their own auth)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, images, fonts
     */
    '/((?!api|_next/static|_next/image|favicon\\.ico|images|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
