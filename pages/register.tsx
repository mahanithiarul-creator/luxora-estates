import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../components/Auth/AuthContext';

export default function Register() {
  const router = useRouter();
  const { user, loading, signUpWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const { error } = await signUpWithEmail(email, password);
    if (error) {
      setError(error);
      setSuccess(false);
    } else {
      setSuccess(true);
    }
  };

  return (
    <main className="min-h-screen pt-28 container mx-auto px-6 flex items-center justify-center">
      <div className="glass p-8 rounded-2xl w-full max-w-md shadow-2xl backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/70">Private registration</p>
        <h1 className="mt-4 text-4xl font-semibold neon">Create your Luxora account</h1>
        <p className="mt-3 text-sm leading-6 opacity-75">Register to save listings, manage bookings, and access premium concierge recommendations.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm text-slate-200/85">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </label>

          <label className="block text-sm text-slate-200/85">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </label>

          {error && <p className="text-sm text-rose-300">{error}</p>}
          {success && <p className="text-sm text-cyan-300">Account created. Check email for confirmation and continue to your dashboard.</p>}

          <button className="w-full rounded-3xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:-translate-y-0.5">
            Create account
          </button>
        </form>

        <div className="mt-6 text-center text-sm opacity-70">or</div>

        <button
          type="button"
          onClick={signInWithGoogle}
          className="mt-4 flex w-full items-center justify-center gap-3 rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:border-cyan-400"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm opacity-70">
          Already have an account? <a href="/login" className="text-cyan-300 underline">Sign in</a>
        </p>
      </div>
    </main>
  );
}
