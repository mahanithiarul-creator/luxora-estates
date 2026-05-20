import React, { useEffect, useState } from 'react';
import GlassModal from '../Modal/GlassModal';
import { useExperience } from './ExperienceContext';
import { motion } from 'framer-motion';
import type { Property } from '../../types';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function GlobalBookingModal({ open, onClose }: Props) {
  const { showToast } = useExperience();
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyId, setPropertyId] = useState('');
  const [datetime, setDatetime] = useState('');
  const [contactMethod, setContactMethod] = useState('Phone call');
  const [notes, setNotes] = useState('Please guide me through a premium property preview.');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    async function loadFeatured() {
      try {
        const res = await fetch('/api/properties?featured=true');
        const payload = await res.json();
        if (res.ok && Array.isArray(payload.data)) {
          setProperties(payload.data);
          setPropertyId(payload.data[0]?.id || '');
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadFeatured();
  }, [open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!propertyId) {
      setError('Select a property to book.');
      setStatus('error');
      return;
    }
    setStatus('submitting');
    setError(null);

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyId,
        name: 'Luxury guest',
        email: 'guest@luxora.com',
        phone: contactMethod === 'Phone call' ? 'Premium callback requested' : '',
        date: datetime,
        message: `${notes} Preferred contact: ${contactMethod}.`, 
      }),
    });

    if (!res.ok) {
      const payload = await res.json();
      setError(payload.error || 'Unable to confirm booking.');
      setStatus('error');
      return;
    }

    setStatus('success');
    showToast({ type: 'success', title: 'Booking confirmed', message: 'Your luxury viewing request is live. Concierge confirmation is being prepared.' });
  };

  const handleClose = () => {
    setStatus('idle');
    setError(null);
    setDatetime('');
    setContactMethod('Phone call');
    setNotes('Please guide me through a premium property preview.');
    onClose();
  };

  return (
    <GlassModal open={open} onClose={handleClose} title="Premium booking experience" subtitle="Schedule a private viewing with concierge-level service.">
      {status === 'success' ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-cyan-400/10 bg-cyan-500/10 p-7 text-center text-white shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400/15 text-3xl">✓</div>
          <h3 className="text-2xl font-semibold">Your request is received</h3>
          <p className="mt-3 text-sm opacity-80">A private preview will be arranged by the luxury concierge team with exclusive details and arrival notes.</p>
          <button type="button" onClick={handleClose} className="mt-6 rounded-3xl border border-white/10 px-5 py-3 text-sm uppercase tracking-[0.18em] text-white transition hover:border-cyan-400/40">
            Close panel
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm text-slate-200/85">
            Select property
            <select value={propertyId} onChange={(e) => setPropertyId(e.target.value)} className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-cyan-400">
              {properties.map((property) => (
                <option key={property.id} value={property.id}>{property.title} — {property.location}</option>
              ))}
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-slate-200/85">
              Date & time
              <input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} required className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-cyan-400" />
            </label>
            <label className="block text-sm text-slate-200/85">
              Contact method
              <select value={contactMethod} onChange={(e) => setContactMethod(e.target.value)} className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-cyan-400">
                <option>Phone call</option>
                <option>Video chat</option>
                <option>Email follow-up</option>
              </select>
            </label>
          </div>
          <label className="block text-sm text-slate-200/85">
            Concierge note
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-cyan-400" />
          </label>
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <button type="submit" disabled={status === 'submitting'} className="w-full rounded-3xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">
            {status === 'submitting' ? 'Sending request…' : 'Confirm premium booking'}
          </button>
        </form>
      )}
    </GlassModal>
  );
}
