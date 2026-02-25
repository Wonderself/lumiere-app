import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Next.js 16: proxy.ts replaces middleware.ts (nodejs runtime, no edge restrictions)
export async function proxy(req: NextRequest) {
  const { nextUrl } = req

  // Try multiple cookie name strategies for maximum reliability
  let token = null
  try {
    token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
    })
  } catch {
    // Token extraction failed — treat as unauthenticated
  }

  // Fallback: try with explicit cookie name if first attempt failed
  if (!token) {
    try {
      const cookieName = nextUrl.protocol === 'https:'
        ? '__Secure-authjs.session-token'
        : 'authjs.session-token'
      token = await getToken({
        req,
        secret: process.env.AUTH_SECRET,
        cookieName,
      })
    } catch {
      // Still failed — treat as unauthenticated
    }
  }

  const isLoggedIn = !!token
  const isAdmin = token?.role === 'ADMIN'

  const protectedPaths = ['/dashboard', '/tasks', '/profile', '/lumens', '/notifications', '/screenplays', '/tokenization', '/trailer-studio', '/credits']
  const adminPaths = ['/admin']
  const authPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email']

  const isProtected = protectedPaths.some((p) => nextUrl.pathname.startsWith(p))
  const isAdminPath = adminPaths.some((p) => nextUrl.pathname.startsWith(p))
  const isAuthPath = authPaths.some((p) => nextUrl.pathname.startsWith(p))

  // Auth redirects
  if (isAdminPath) {
    if (!isLoggedIn) {
      return addSecurityHeaders(NextResponse.redirect(new URL('/login?callbackUrl=' + encodeURIComponent(nextUrl.pathname), nextUrl)))
    }
    if (!isAdmin) {
      return addSecurityHeaders(NextResponse.redirect(new URL('/dashboard', nextUrl)))
    }
  }

  if (isProtected && !isLoggedIn) {
    return addSecurityHeaders(NextResponse.redirect(new URL('/login?callbackUrl=' + encodeURIComponent(nextUrl.pathname), nextUrl)))
  }

  if (isAuthPath && isLoggedIn) {
    return addSecurityHeaders(NextResponse.redirect(new URL('/dashboard', nextUrl)))
  }

  // Apply security headers to all responses
  return addSecurityHeaders(NextResponse.next())
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  const isDev = process.env.NODE_ENV !== 'production'

  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()')

  // HSTS only in production — on localhost it causes persistent HTTPS enforcement
  if (!isDev) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://images.unsplash.com https://lh3.googleusercontent.com https://avatars.githubusercontent.com",
    "font-src 'self' data:",
    "connect-src 'self' https://api.resend.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')
  response.headers.set('Content-Security-Policy', csp)

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)'],
}
