import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { securityHeaders } from '@/lib/security-headers'

// Next.js 16: proxy.ts replaces middleware.ts (nodejs runtime, no edge restrictions)
export async function proxy(req: NextRequest) {
  const { nextUrl } = req

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  })

  const isLoggedIn = !!token
  const isAdmin = token?.role === 'ADMIN'

  const protectedPaths = ['/dashboard', '/tasks', '/profile', '/lumens', '/notifications', '/screenplays', '/tokenization']
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
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value)
  }
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)'],
}
