import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/Auth/AuthContext';

type Overview = {
  bookings: number;
  inquiries: number;
  properties: number;
  favorites: number;
  recentInquiries: Array<{ id: string; name: string; email: string; property_id: string; created_at: string }>;
  recentBookings: Array<{ id: string; name: string; email: string; property_id: string; booking_date: string; status: string }>;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOverview = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/overview');
        if (!res.ok) {
          const payload = await res.json();
          setError(payload.error || 'Unable to load admin metrics.');
          return;
        }
        const data = await res.json();
        setOverview(data);
      } catch {
        setError('Unable to load admin metrics.');
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  return (
    <main className="min-h-screen pt-28 container mx-auto px-6 pb-20">
      <div className="space-y-8">
        <section className="glass rounded-[32px] border border-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/75">Administrative console</p>
          <h1 className="mt-3 text-4xl font-semibold neon">Executive dashboard</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200/85">Manage saved residences, review AI-led recommendations, and monitor premium guest interest from a secure product control center.</p>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="glass rounded-[32px] border border-white/10 p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.26em] text-cyan-200/75">Conversion insights</p>
                <h2 className="mt-2 text-3xl font-semibold neon">Live lead metrics</h2>
              </div>
              <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-200">{user ? 'Welcome back' : 'Guest mode'}</span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {loading ? (
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 text-center text-slate-300">Loading metrics…</div>
              ) : error ? (
                <div className="rounded-3xl border border-rose-400/20 bg-rose-500/5 p-6 text-sm text-rose-200">{error}</div>
              ) : (
                [
                  { label: 'Bookings', value: overview?.bookings ?? 0 },
                  { label: 'Inquiries', value: overview?.inquiries ?? 0 },
                  { label: 'Favorites', value: overview?.favorites ?? 0 },
                  { label: 'Properties', value: overview?.properties ?? 0 },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-lg">
                    <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/70">{item.label}</p>
                    <p className="mt-4 text-4xl font-semibold neon">{item.value}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="glass rounded-[32px] border border-white/10 p-8 shadow-2xl backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.26em] text-cyan-200/75">AI recommendations</p>
            <h2 className="mt-2 text-3xl font-semibold neon">Latest concierge insights</h2>
            <div className="mt-6 space-y-4">
              {[
                'Launch a signature lounge tour for investor visits.',
                'Schedule a sunset terrace reveal with premium lighting.',
                'Package the open-concept suite for editorial storytelling.',
              ].map((suggestion) => (
                <div key={suggestion} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                  {suggestion}
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="glass rounded-[32px] border border-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.26em] text-cyan-200/75">Recent activity</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <h3 className="text-xl font-semibold neon">Recent bookings</h3>
              <div className="mt-4 space-y-3">
                {overview?.recentBookings?.length ? (
                  overview.recentBookings.map((booking) => (
                    <div key={booking.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <p className="font-semibold">{booking.name}</p>
                      <p className="text-sm opacity-70">{booking.property_id} · {booking.booking_date}</p>
                      <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">{booking.status}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm opacity-70">No recent bookings yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <h3 className="text-xl font-semibold neon">Recent inquiries</h3>
              <div className="mt-4 space-y-3">
                {overview?.recentInquiries?.length ? (
                  overview.recentInquiries.map((inquiry) => (
                    <div key={inquiry.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <p className="font-semibold">{inquiry.name}</p>
                      <p className="text-sm opacity-70">{inquiry.property_id} · {new Date(inquiry.created_at).toLocaleDateString()}</p>
                      <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">{inquiry.email}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm opacity-70">No recent inquiries yet.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
