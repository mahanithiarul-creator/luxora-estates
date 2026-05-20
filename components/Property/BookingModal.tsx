import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../Auth/AuthContext';
import type { Property } from '../../../types';
import GlassModal from '../Modal/GlassModal';

type Props = {
  property: Property;
  open: boolean;
  onClose: () => void;
  onConfirmed?: () => void;
};

const experienceOptions = ['Private viewing', 'Investor briefing', 'Design walkthrough'];
const contactMethods = ['Phone call', 'Video chat', 'Email follow-up'];

export default function BookingModal({ property, open, onClose, onConfirmed }: Props) {
  const { user, session } = useAuth();
  const [step, setStep] = useState(1);
  const [experience, setExperience] = useState(experienceOptions[0]);
  const [datetime, setDatetime] = useState('');
  const [method, setMethod] = useState(contactMethods[0]);
  const [notes, setNotes] = useState('I would like a premium presentation with curated insights.');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const formattedDate = useMemo(() => {
    if (!datetime) return 'Select your preferred date';
    return new Date(datetime).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }, [datetime]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step < 2) {
      setStep(2);
      return;
    }

    setStatus('submitting');
    setError(null);

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({
        propertyId: property.id,
        name: user?.email ?? 'Private guest',
        email: user?.email ?? 'guest@luxora.com',
        phone: method === 'Phone call' ? 'Request phone callback' : '',
        date: datetime,
        message: `${experience} booked via premium concierge. ${notes}`,
      }),
    });

    if (!res.ok) {
      const payload = await res.json();
      setError(payload.error || 'Unable to confirm booking.');
      setStatus('error');
      return;
    }

    setStatus('success');
    onConfirmed?.();
  };

  const resetModal = () => {
    setStep(1);
    setExperience(experienceOptions[0]);
    setDatetime('');
    setMethod(contactMethods[0]);
    setNotes('I would like a premium presentation with curated insights.');
    setStatus('idle');
    setError(null);
    onClose();
  };

  return (
    <GlassModal open={open} onClose={resetModal} title="Schedule your private preview" subtitle="A cinematic booking flow for elite tours and investor showings.">
      <form onSubmit={handleSubmit} className="space-y-6">
        {status === 'success' ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-slate-950/80 p-7 text-center shadow-[0_32px_120px_rgba(4,19,36,0.55)]">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400/20 text-cyan-100">
              <span className="text-3xl">✓</span>
            </div>
            <h3 className="text-2xl font-semibold text-white">Booking confirmed</h3>
            <p className="mt-3 text-sm leading-6 text-slate-200/80">Your reservation is routed to our luxury concierge. We will contact you with a bespoke confirmation and property dossier.</p>
            <button type="button" onClick={resetModal} className="mt-6 rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:border-cyan-400/40">
              Close preview
            </button>
          </motion.div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-slate-200/85">
                Experience type
                <select value={experience} onChange={(e) => setExperience(e.target.value)} className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400">
                  {experienceOptions.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm text-slate-200/85">
                Preferred date & time
                <input type="datetime-local" required value={datetime} onChange={(e) => setDatetime(e.target.value)} className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400" />
              </label>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Experience summary</p>
              <p className="mt-3 text-sm text-slate-200/80">{property.title} · {property.location}</p>
              <p className="mt-1 text-sm text-cyan-100/90">{formattedDate}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-slate-200/85">
                Preferred contact
                <select value={method} onChange={(e) => setMethod(e.target.value)} className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400">
                  {contactMethods.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm text-slate-200/85">
                Notes for concierge
                <input value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400" />
              </label>
            </div>

            <div className="flex flex-col gap-3 rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-white/5 to-slate-950/80 p-5 text-sm text-slate-200 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="uppercase tracking-[0.24em] text-cyan-200/70">Luxury concierge</span>
                <span className="text-cyan-100">High-touch service</span>
              </div>
              <p className="mt-3 leading-6">Your request is routed directly to our private sales team and property specialist for a premium confirmation experience.</p>
            </div>

            {error && <p className="text-sm text-rose-300">{error}</p>}

            <button type="submit" disabled={status === 'submitting'} className="w-full rounded-3xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">
              {status === 'submitting' ? 'Confirming…' : step === 1 ? 'Continue to confirmation' : 'Confirm booking'}
            </button>
          </>
        )}
      </form>
    </GlassModal>
  );
}
