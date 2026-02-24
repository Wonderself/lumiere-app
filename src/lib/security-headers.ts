/**
 * Security headers for the Lumière platform.
 * Applied via proxy.ts on every response.
 */

export const securityHeaders: Record<string, string> = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Enable HSTS (1 year, include subdomains)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',

  // Prevent XSS (legacy browsers)
  'X-XSS-Protection': '1; mode=block',

  // DNS prefetch control
  'X-DNS-Prefetch-Control': 'on',

  // Permissions Policy (disable unnecessary browser features)
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',

  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-inline/eval
    "style-src 'self' 'unsafe-inline'", // Tailwind injects styles
    "img-src 'self' data: blob: https://images.unsplash.com https://lh3.googleusercontent.com https://avatars.githubusercontent.com",
    "font-src 'self' data:",
    "connect-src 'self' https://api.resend.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
}

/**
 * Apply security headers to a Response or NextResponse
 */
export function applySecurityHeaders(response: Response): Response {
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value)
  }
  return response
}
