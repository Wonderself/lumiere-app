import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  // If user is not authenticated, redirect to login with callbackUrl
  if (!req.auth) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Admin routes: check for ADMIN role
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const role = req.auth.user?.role
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/profile/:path*',
    '/tasks/:path*',
    '/lumens/:path*',
    '/notifications/:path*',
    '/screenplays/:path*',
    '/tokenization/:path*',
  ],
}
