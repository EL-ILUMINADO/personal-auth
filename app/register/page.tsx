'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import Link from 'next/link';
import { registerUser } from '../../actions/auth';
import {
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  // CAPTCHA State — initialised asynchronously to avoid hydration mismatch
  // and to satisfy react-hooks/set-state-in-effect (setState must be in a
  // callback, not called synchronously in the effect body).
  const [captchaAuth, setCaptchaAuth] = useState({
    num1: 0,
    num2: 0,
    alpha: '',
    mounted: false,
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      const randomString = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

      setCaptchaAuth({
        num1: Math.floor(Math.random() * 10) + 1,
        num2: Math.floor(Math.random() * 10) + 1,
        alpha: randomString,
        mounted: true,
      });
    }, 0);

    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  // Real-time Password Rules
  const hasSpace = /\s/.test(passwordValue);
  const rules = [
    {
      id: 'length',
      text: 'At least 8 characters',
      passed: passwordValue.length >= 8,
    },
    {
      id: 'uppercase',
      text: 'One uppercase letter',
      passed: /[A-Z]/.test(passwordValue),
    },
    {
      id: 'symbol',
      text: 'One symbol (!@#$%…)',
      passed: /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue),
    },
    {
      id: 'noSpaces',
      text: 'No spaces',
      passed: !hasSpace,
    },
  ];

  const isPasswordValid =
    rules.every((r) => r.passed) && !hasSpace && passwordValue.length > 0;

  const clientAction = (formData: FormData) => {
    setError(null);

    // 1. Math CAPTCHA
    const mathAnswer = parseInt(formData.get('mathCaptcha') as string, 10);
    if (mathAnswer !== captchaAuth.num1 + captchaAuth.num2) {
      setError('Math verification failed. Please try again.');
      return;
    }

    // 2. Alphanumeric CAPTCHA
    const alphaAnswer = formData.get('alphaCaptcha') as string;
    if (alphaAnswer.toUpperCase() !== captchaAuth.alpha) {
      setError('Text verification failed. Please try again.');
      return;
    }

    // 3. Password sanity
    if (!isPasswordValid) {
      setError('Please resolve all password requirements first.');
      return;
    }

    startTransition(async () => {
      const result = await registerUser(formData);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--color-bg)' }}
    >
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
          className="rounded-2xl border p-8"
          style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            boxShadow:
              '0 0 0 1px var(--color-border), 0 24px 64px -12px rgba(0,0,0,0.6)',
          }}
        >
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-7">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{
                background: 'var(--color-accent-subtle)',
                border:
                  '1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)',
              }}
            >
              <ShieldCheckIcon
                className="w-6 h-6"
                style={{ color: 'var(--color-accent)' }}
              />
            </div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: 'var(--color-text)' }}
            >
              Join the Club
            </h1>
            <p
              className="text-sm mt-1.5"
              style={{ color: 'var(--color-muted)' }}
            >
              Create your secure account in seconds.
            </p>
          </div>

          {/* Form */}
          <form action={clientAction} className="space-y-5">
            {/* ── Email ─────────────────────────────────────────── */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium uppercase tracking-widest mb-2"
                style={{ color: 'var(--color-muted)' }}
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-2.5 rounded-lg border text-sm transition-colors outline-none"
                style={{
                  background: 'var(--color-surface-raised)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
                placeholder="you@example.com"
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = 'var(--color-accent)')
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = 'var(--color-border)')
                }
              />
            </div>

            {/* ── Password ──────────────────────────────────────── */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium uppercase tracking-widest mb-2"
                style={{ color: 'var(--color-muted)' }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  className="w-full px-4 py-2.5 pr-11 rounded-lg border text-sm transition-colors outline-none"
                  style={{
                    background: 'var(--color-surface-raised)',
                    borderColor: hasSpace
                      ? 'var(--color-error)'
                      : 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  placeholder="••••••••"
                  onFocus={(e) => {
                    if (!hasSpace)
                      e.currentTarget.style.borderColor = 'var(--color-accent)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = hasSpace
                      ? 'var(--color-error)'
                      : 'var(--color-border)';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--color-muted)' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-4.5 h-4.5" />
                  ) : (
                    <EyeIcon className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>

              {/* Password rules */}
              {passwordValue.length > 0 && (
                <div
                  className="mt-3 p-3 rounded-lg border space-y-1.5"
                  style={{
                    background: 'var(--color-bg)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  {rules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: rule.passed
                            ? 'var(--color-success-subtle)'
                            : 'color-mix(in srgb, var(--color-muted) 15%, transparent)',
                        }}
                      >
                        {rule.passed ? (
                          <CheckIcon
                            className="w-2.5 h-2.5"
                            style={{ color: 'var(--color-success)' }}
                          />
                        ) : (
                          <XMarkIcon
                            className="w-2.5 h-2.5"
                            style={{ color: 'var(--color-muted)' }}
                          />
                        )}
                      </span>
                      <span
                        style={{
                          color: rule.passed
                            ? 'var(--color-text)'
                            : 'var(--color-muted)',
                        }}
                      >
                        {rule.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Human Verification ────────────────────────────── */}
            {captchaAuth.mounted && (
              <div
                className="rounded-xl border overflow-hidden"
                style={{ borderColor: 'var(--color-border)' }}
              >
                {/* Header */}
                <div
                  className="px-4 py-2.5 border-b flex items-center gap-2"
                  style={{
                    background: 'var(--color-bg)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <ShieldCheckIcon
                    className="w-3.5 h-3.5"
                    style={{ color: 'var(--color-accent)' }}
                  />
                  <span
                    className="text-xs font-medium uppercase tracking-widest"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    Human Verification
                  </span>
                </div>

                <div className="p-4 space-y-4">
                  {/* Math challenge */}
                  <div>
                    <label
                      htmlFor="mathCaptcha"
                      className="block text-xs mb-2"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      What is{' '}
                      <span
                        className="font-mono font-bold px-1.5 py-0.5 rounded"
                        style={{
                          background: 'var(--color-accent-subtle)',
                          color: 'var(--color-accent)',
                        }}
                      >
                        {captchaAuth.num1} + {captchaAuth.num2}
                      </span>
                      ?
                    </label>
                    <input
                      id="mathCaptcha"
                      name="mathCaptcha"
                      type="number"
                      required
                      className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors"
                      style={{
                        background: 'var(--color-surface-raised)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor =
                          'var(--color-accent)')
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          'var(--color-border)')
                      }
                    />
                  </div>

                  {/* Alpha challenge */}
                  <div>
                    <label
                      htmlFor="alphaCaptcha"
                      className="block text-xs mb-2"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      Type the characters shown below:
                    </label>
                    {/* CAPTCHA display */}
                    <div
                      className="rounded-lg p-3 text-center mb-2 select-none relative overflow-hidden"
                      style={{
                        background: 'var(--color-bg)',
                        border: '1px dashed var(--color-border-muted)',
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                          backgroundImage:
                            'repeating-linear-gradient(45deg, var(--color-border) 0, var(--color-border) 1px, transparent 0, transparent 50%)',
                          backgroundSize: '8px 8px',
                        }}
                      />
                      <span
                        className="relative font-mono text-xl font-bold tracking-[0.35em] line-through"
                        style={{
                          color: 'var(--color-text)',
                          textDecorationColor: 'var(--color-muted)',
                        }}
                      >
                        {captchaAuth.alpha}
                      </span>
                    </div>
                    <input
                      id="alphaCaptcha"
                      name="alphaCaptcha"
                      type="text"
                      required
                      className="w-full px-3 py-2 rounded-lg border text-sm uppercase tracking-widest outline-none transition-colors"
                      style={{
                        background: 'var(--color-surface-raised)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor =
                          'var(--color-accent)')
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          'var(--color-border)')
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Error banner ──────────────────────────────────── */}
            {error && (
              <div
                className="flex items-start gap-3 p-3.5 rounded-lg border text-sm"
                style={{
                  background: 'var(--color-error-subtle)',
                  borderColor:
                    'color-mix(in srgb, var(--color-error) 30%, transparent)',
                  color: 'var(--color-error)',
                }}
                role="alert"
              >
                <XMarkIcon className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            {/* ── Submit ────────────────────────────────────────── */}
            <button
              type="submit"
              disabled={isPending || !captchaAuth.mounted || !isPasswordValid}
              className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: 'var(--color-accent)',
                color: '#fff',
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled)
                  e.currentTarget.style.background =
                    'var(--color-accent-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-accent)';
              }}
            >
              {isPending ? 'Securing your account…' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Link to home */}
        <p
          className="text-center text-xs mt-4"
          style={{ color: 'var(--color-muted)' }}
        >
          <Link
            href="/"
            style={{ color: 'var(--color-accent)' }}
            className="hover:underline"
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
