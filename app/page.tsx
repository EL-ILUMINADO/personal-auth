import Link from 'next/link';
import {
  ShieldCheckIcon,
  BoltIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Secure by default',
    description:
      'End-to-end encrypted sessions with automatic expiry and HttpOnly cookies.',
  },
  {
    icon: BoltIcon,
    title: 'Lightning fast',
    description:
      'Optimised for performance — no bloat, no trackers, no unnecessary round-trips.',
  },
  {
    icon: LockClosedIcon,
    title: 'Private by design',
    description:
      'Your data stays yours. No third-party SDKs, no sharing, no selling.',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
        <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight text-text hover:text-accent transition-colors"
          >
            <ShieldCheckIcon className="w-5 h-5 text-accent" />
            personal-auth
          </Link>

          {/* Nav CTA */}
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium bg-accent hover:bg-accent-hover text-white transition-colors"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <main className="flex flex-col flex-1">
        <section className="flex flex-col items-center justify-center text-center px-6 pt-28 pb-24 relative">
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 60% 40% at 50% 0%, color-mix(in srgb, var(--color-accent) 8%, transparent), transparent)',
            }}
          />

          {/* Badge */}
          <div className="relative inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-8 border bg-accent-subtle border-accent/30 text-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Open source · Self-hosted · No vendor lock-in
          </div>

          {/* Headline */}
          <h1 className="relative text-5xl sm:text-6xl font-bold tracking-tight leading-tight max-w-2xl mb-6 text-text">
            The{' '}
            <span
              style={{
                background:
                  'linear-gradient(135deg, var(--color-accent), #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              secure
            </span>{' '}
            way to authenticate.
          </h1>

          {/* Subtext */}
          <p className="relative text-lg max-w-md mb-10 leading-relaxed text-muted">
            A minimal, privacy-first auth system built on Next.js&nbsp;16 and
            Prisma. No magic, no mystery — just clean code you own.
          </p>

          {/* CTAs */}
          <div className="relative flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold bg-accent hover:bg-accent-hover text-white transition-colors w-full sm:w-auto"
            >
              Get Started Free
            </Link>
            <span className="text-xs text-muted">No credit card required</span>
          </div>
        </section>

        {/* ── Features ──────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto w-full px-6 pb-28">
          {/* Divider */}
          <div
            className="w-full h-px mb-16"
            style={{
              background:
                'linear-gradient(to right, transparent, var(--color-border), transparent)',
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl p-6 border border-border bg-surface transition-colors hover:border-border-muted"
              >
                {/* Icon container */}
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-accent-subtle border border-accent/25">
                  <Icon className="w-5 h-5 text-accent" />
                </div>

                <h3 className="text-sm font-semibold mb-2 text-text">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-border py-6">
        <p className="text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} personal&#x2011;auth &mdash; Built
          with Next.js&nbsp;16.
        </p>
      </footer>
    </div>
  );
}
