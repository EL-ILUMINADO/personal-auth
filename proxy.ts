import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ── Allowed HTTP methods ──────────────────────────────────────────
// Only GET/POST/HEAD/OPTIONS are needed: GET for navigation,
// POST for Server Actions and form submissions, HEAD for health
// checks, OPTIONS for CORS preflight.
const ALLOWED_METHODS = new Set(['GET', 'POST', 'HEAD', 'OPTIONS']);

// ── Content Security Policy ───────────────────────────────────────
// next/font self-hosts Geist, so fonts are served from 'self'.
// 'unsafe-inline' is required by Tailwind v4 and Next.js internals.
// 'unsafe-eval' is only added in development (needed for HMR).
function buildCSP(): string {
  const isDev = process.env.NODE_ENV !== 'production';

  const directives: Record<string, string> = {
    'default-src': "'self'",
    'script-src': isDev
      ? "'self' 'unsafe-inline' 'unsafe-eval'"
      : "'self' 'unsafe-inline'",
    'style-src': "'self' 'unsafe-inline'",
    'img-src': "'self' data: blob:",
    'font-src': "'self'",
    'connect-src': "'self'",
    'form-action': "'self'",
    'frame-ancestors': "'none'",
    'base-uri': "'self'",
    'object-src': "'none'",
    'upgrade-insecure-requests': '',
  };

  return Object.entries(directives)
    .map(([key, value]) => (value ? `${key} ${value}` : key))
    .join('; ');
}

// ── Security headers applied to every response ────────────────────
function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('Content-Security-Policy', buildCSP());
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );
  return response;
}

// ── Proxy ─────────────────────────────────────────────────────────
export function proxy(request: NextRequest) {
  // 1. Block disallowed HTTP methods (prevents method-based attacks)
  if (!ALLOWED_METHODS.has(request.method)) {
    return applySecurityHeaders(
      new NextResponse(null, {
        status: 405,
        headers: { Allow: [...ALLOWED_METHODS].join(', ') },
      })
    );
  }

  // 2. Auth guard — protect /welcome from unauthenticated access
  if (request.nextUrl.pathname.startsWith('/welcome')) {
    const sessionId = request.cookies.get('session_id')?.value;
    if (!sessionId) {
      return applySecurityHeaders(
        NextResponse.redirect(new URL('/', request.url))
      );
    }
  }

  // 3. Attach security headers to all passing responses
  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  // Run on all routes so security headers and method checks apply globally.
  // Excludes Next.js internals and static assets.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
