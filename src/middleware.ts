import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const protectedPaths = [
  '/dashboard',
  '/admin',
  '/profile',
  '/tasks',
  '/lumens',
  '/notifications',
  '/screenplays',
  '/tokenization',
]

const adminPaths = ['/admin']

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role

  // Check if the path needs protection
  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )

  const isAdminRoute = adminPaths.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )

  // Redirect unauthenticated users to login
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL('/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect non-admins from admin routes
  if (isAdminRoute && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin))
  }

  return NextResponse.next()
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
