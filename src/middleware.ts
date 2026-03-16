import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public paths — never block
  const publicPaths = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/api/auth',
    '/api/health',
    '/api/infra/health',
    '/api/v1',
    '/api/stripe/webhook',
    '/api/autopilot/telegram/webhook',
    '/api/cron',
    '/_next',
    '/favicon',
    '/manifest.json',
    '/sw.js',
    '/robots.txt',
    '/sitemap.xml',
  ]

  // Check if path is public
  const isPublic = publicPaths.some(p => pathname === p || pathname.startsWith(p + '/'))
  // Public route groups
  const isPublicGroup = pathname.startsWith('/films') || pathname.startsWith('/tv') ||
    pathname.startsWith('/streaming') || pathname.startsWith('/community') ||
    pathname.startsWith('/actors') || pathname.startsWith('/invest') ||
    pathname.startsWith('/produce') || pathname.startsWith('/work') ||
    pathname.startsWith('/act') || pathname.startsWith('/watch') ||
    pathname.startsWith('/pricing') || pathname.startsWith('/about') ||
    pathname.startsWith('/roadmap') || pathname.startsWith('/leaderboard') ||
    pathname.startsWith('/blog') || pathname.startsWith('/vs-alternatives') ||
    pathname.startsWith('/api-pricing') || pathname.startsWith('/fonctionnalites') ||
    pathname.startsWith('/cas') || pathname.startsWith('/create') ||
    pathname.startsWith('/studio') || pathname.startsWith('/poster-maker') ||
    pathname.startsWith('/trailer-maker') || pathname.startsWith('/discussions') ||
    pathname.startsWith('/rewards') || pathname.startsWith('/referral') ||
    pathname.startsWith('/points') || pathname.startsWith('/agents') ||
    pathname.startsWith('/film-knowledge') || pathname.startsWith('/community-hub') ||
    pathname.startsWith('/agent-builder') || pathname.startsWith('/marketing') ||
    pathname.startsWith('/developers') || pathname.startsWith('/home') ||
    pathname.startsWith('/maintenance') || pathname.startsWith('/auto-admin') ||
    pathname.startsWith('/auto-user') || pathname.startsWith('/cinema')

  if (isPublic || isPublicGroup) return NextResponse.next()

  // Protected routes — require auth
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Admin routes — require ADMIN role
  // Next.js route groups like (dashboard) don't appear in URLs
  // Admin pages are at /admin/* in the URL
  if (pathname.startsWith('/admin') || pathname.includes('/admin')) {
    if (token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$).*)',
  ],
}
