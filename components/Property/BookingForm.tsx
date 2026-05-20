import React, { useState } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useExperience } from '../Experience/ExperienceContext';

type Props = {
  propertyId: string;
};

export default function BookingForm({ propertyId }: Props) {
  const { user, session } = useAuth();
  const [name, setName] = useState(user?.email ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [contactMethod, setContactMethod] = useState('Phone');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useExperience();

  const submitBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setError(null);

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({
        propertyId,
        name: name || 'Guest',
        email,
        phone,
        date,
        message: `Preferred contact via ${contactMethod}. ${message}`,
      }),
    });

    if (!res.ok) {
      const payload = await res.json();
      setError(payload.error || 'Unable to submit booking.');
      setStatus('error');
      showToast({ type: 'error', title: 'Booking failed', message: payload.error || 'Please try again.' });
      return;
    }

    setStatus('success');
    showToast({ type: 'success', title: 'Booking sent', message: 'Your private viewing request is underway.' });
    setName(user?.email ?? '');
    setPhone('');
    setDate('');
    setMessage('I am interested in a private viewing and concierge tour.');
  };

  return (
    <div className="glass rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Live booking</p>
          <h2 className="mt-2 text-2xl font-semibold neon">Schedule a private preview</h2>
        </div>
        <span className="text-sm text-cyan-300">{user ? 'Signed in' : 'Guest mode'}</span>
      </div>

      <form onSubmit={submitBooking} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-200/85">
            Name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            />
          </label>
          <label className="block text-sm text-slate-200/85">
            Email
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
            Phone
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Optional contact number"
              className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            />
          </label>
          <label className="block text-sm text-slate-200/85">
            Contact method
            <select
              value={contactMethod}
              onChange={(e) => setContactMethod(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            >
              <option>Phone</option>
              <option>Video call</option>
              <option>Email</option>
            </select>
          </label>
        </div>

        <label className="block text-sm text-slate-200/85">
          Preferred date
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          />
        </label>

        <label className="block text-sm text-slate-200/85">
          Message
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          />
        </label>

        {error && <p className="text-sm text-rose-300">{error}</p>}
        {status === 'success' && <p className="text-sm text-cyan-300">Booking request submitted. Our concierge will confirm within minutes.</p>}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full rounded-3xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'submitting' ? 'Sending request…' : 'Book a private preview'}
        </button>
      </form>
    </div>
  );
}
