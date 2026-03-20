import { redirect } from 'next/navigation';
import { getSession } from '../../lib/session';
import {
  CheckBadgeIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import LogoutButton from './LogoutButton';

export default async function WelcomePage() {
  const session = await getSession();

  if (!session) {
    redirect('/');
  }

  const joinedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(session.createdAt));

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg">
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, color-mix(in srgb, var(--color-accent) 8%, transparent), transparent)',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div
          className="rounded-2xl border border-border p-8 bg-surface"
          style={{
            boxShadow:
              '0 0 0 1px var(--color-border), 0 24px 64px -12px rgba(0,0,0,0.6)',
          }}
        >
          {/* Check badge icon */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-accent-subtle border border-accent/30">
              <CheckBadgeIcon className="w-8 h-8 text-accent" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight mb-1 text-text">
              You&apos;re in.
            </h1>
            <p className="text-sm text-muted">
              Your account is active and secure.
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px mb-6 bg-border" />

          {/* User info */}
          <div className="space-y-4 mb-8">
            {/* Email row */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-surface-raised border border-border">
                <EnvelopeIcon className="w-4 h-4 text-muted" />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-widest mb-0.5 text-muted">
                  Email
                </p>
                <p className="text-sm font-medium truncate text-text">
                  {session.email}
                </p>
              </div>
            </div>

            {/* Joined row */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-surface-raised border border-border">
                <CalendarDaysIcon className="w-4 h-4 text-muted" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest mb-0.5 text-muted">
                  Member since
                </p>
                <p className="text-sm font-medium text-text">{joinedDate}</p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <LogoutButton />
        </div>

        {/* Bottom hint */}
        <p className="text-center text-xs mt-4 text-muted">
          Session expires in 7 days.
        </p>
      </div>
    </div>
  );
}
