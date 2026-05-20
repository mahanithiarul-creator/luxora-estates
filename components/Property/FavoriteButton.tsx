import React, { useEffect, useState } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useExperience } from '../Experience/ExperienceContext';

type Props = {
  propertyId: string;
};

export default function FavoriteButton({ propertyId }: Props) {
  const { user, session } = useAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !session?.access_token) {
      setSaved(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await fetch('/api/user/favorites', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) return;
        const payload = await res.json();
        setSaved(Array.isArray(payload.data) && payload.data.some((item: any) => item.property_id === propertyId));
      } catch (error) {
        console.error(error);
      }
    };

    fetchFavorites();
  }, [user, session, propertyId]);

  const { showToast } = useExperience();

  const handleClick = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const method = saved ? 'DELETE' : 'POST';
      const res = await fetch('/api/user/favorites', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ propertyId }),
      });

      if (!res.ok) {
        const payload = await res.json();
        const message = payload.error || 'Unable to update favorites.';
        setFeedback(message);
        showToast({ type: 'error', title: 'Favorites update failed', message });
      } else {
        const nextSaved = !saved;
        setSaved(nextSaved);
        const message = nextSaved ? 'Saved to your premium collection.' : 'Removed from saved homes.';
        setFeedback(message);
        showToast({ type: 'success', title: nextSaved ? 'Saved' : 'Removed', message });
      }
    } catch (error) {
      console.error(error);
      setFeedback('Unable to update save status.');
      showToast({ type: 'error', title: 'Favorites error', message: 'Unable to update save status.' });
    } finally {
      setLoading(false);
      window.setTimeout(() => setFeedback(null), 3200);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] transition ${
          saved
            ? 'border-cyan-400/50 bg-cyan-500/10 text-cyan-100 shadow-[0_12px_30px_rgba(56,189,248,0.18)]'
            : 'border-white/10 bg-white/5 text-white hover:border-cyan-400/40 hover:bg-cyan-500/10'
        } ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
      >
        <span className="text-base">{saved ? '★' : '☆'}</span>
        {saved ? 'Saved' : 'Save Property'}
      </button>
      {feedback && <p className="text-xs text-cyan-200/80">{feedback}</p>}
    </div>
  );
}
