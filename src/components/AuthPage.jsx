import { useState } from 'react';

/**
 * Login / Signup page.
 * Toggling between modes with a single form.
 */
export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    const result = mode === 'login'
      ? await onAuth.signIn(email.trim(), password)
      : await onAuth.signUp(email.trim(), password);

    setLoading(false);

    if (!result.success) {
      setError(result.error);
    } else if (result.needsConfirmation) {
      setInfo('Check your email to confirm your account, then log in.');
      setMode('login');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-md">
      <div className="w-full max-w-[400px] animate-fade-in">
        {/* Brand */}
        <div className="text-center mb-xl">
          <h1
            className="font-display text-[36px] font-bold tracking-[-0.02em]"
            style={{ color: 'var(--color-primary)' }}
          >
            HomeBase
          </h1>
          <p className="text-sm mt-xs" style={{ color: 'var(--color-muted)' }}>
            Your home&apos;s command center
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-[20px] p-lg"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <h2
            className="text-[18px] font-semibold mb-lg text-center"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-md">
            {/* Email */}
            <div>
              <label
                className="block text-[12px] font-medium uppercase tracking-wider mb-[6px]"
                style={{ color: 'var(--color-muted)' }}
                htmlFor="auth-email"
              >
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-[12px] text-sm rounded-[10px] outline-none"
                style={{ border: '1.5px solid var(--color-border)' }}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-[12px] font-medium uppercase tracking-wider mb-[6px]"
                style={{ color: 'var(--color-muted)' }}
                htmlFor="auth-password"
              >
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-[12px] text-sm rounded-[10px] outline-none"
                style={{ border: '1.5px solid var(--color-border)' }}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {/* Error / Info */}
            {error && (
              <p className="text-sm text-center" style={{ color: 'var(--color-danger)' }}>
                {error}
              </p>
            )}
            {info && (
              <p className="text-sm text-center" style={{ color: 'var(--color-success)' }}>
                {info}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              id="btn-auth-submit"
              className="w-full py-[12px] text-sm font-semibold rounded-[10px] cursor-pointer
                transition-all duration-200"
              style={{
                backgroundColor: loading ? '#333333' : 'var(--color-primary)',
                color: '#FFFFFF',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
                : (mode === 'login' ? 'Sign In' : 'Create Account')
              }
            </button>
          </form>

          {/* Toggle mode */}
          <p className="text-sm text-center mt-lg" style={{ color: 'var(--color-muted)' }}>
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setInfo(''); }}
              className="font-semibold cursor-pointer underline"
              style={{ color: 'var(--color-primary)' }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
