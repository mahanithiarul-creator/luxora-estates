import React, { useState } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useExperience } from '../Experience/ExperienceContext';

type Props = {
  propertyId: string;
};

export default function InquiryForm({ propertyId }: Props) {
  const { session } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Investment review');
  const [urgency, setUrgency] = useState('Within 24 hours');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useExperience();

  const sendInquiry = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setError(null);

    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({
        propertyId,
        name,
        email,
        phone,
        message: `[${category}] [${urgency}] ${message}`,
      }),
    });

    if (!res.ok) {
      const payload = await res.json();
      setError(payload.error || 'Unable to submit inquiry.');
      setStatus('error');
      showToast({ type: 'error', title: 'Inquiry failed', message: payload.error || 'Please try again.' });
      return;
    }

    setStatus('success');
    showToast({ type: 'success', title: 'Inquiry received', message: 'Your request has been sent to the luxury concierge team.' });
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="glass rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Luxury inquiry</p>
          <h2 className="mt-2 text-2xl font-semibold neon">Instant property concierge</h2>
        </div>
        <span className="text-sm text-cyan-300">Live support</span>
      </div>

      <form onSubmit={sendInquiry} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-200/85">
            Full name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            />
          </label>
          <label className="block text-sm text-slate-200/85">
            Email address
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-200/85">
            Inquiry category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            >
              <option>Investment review</option>
              <option>Design concierge</option>
              <option>Agent introduction</option>
              <option>Portfolio acquisition</option>
            </select>
          </label>
          <label className="block text-sm text-slate-200/85">
            Urgency
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            >
              <option>Within 24 hours</option>
              <option>Next 3 days</option>
              <option>Next 7 days</option>
              <option>Flexible timing</option>
            </select>
          </label>
        </div>

        <label className="block text-sm text-slate-200/85">
          Phone number
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Optional contact number"
            className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          />
        </label>

        <label className="block text-sm text-slate-200/85">
          Message
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          />
        </label>

        {error && <p className="text-sm text-rose-300">{error}</p>}
        {status === 'success' && <p className="text-sm text-cyan-300">Inquiry submitted. Our luxury concierge will follow up in under 30 minutes.</p>}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full rounded-3xl bg-gradient-to-r from-[#091825] via-[#05102d] to-[#031019] border border-cyan-400/20 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-xl shadow-cyan-500/10 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'submitting' ? 'Submitting…' : 'Send inquiry'}
        </button>
      </form>
    </div>
  );
}
