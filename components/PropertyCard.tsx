import Link from 'next/link';
import React from 'react';
import { useExperience } from './Experience/ExperienceContext';
import FavoriteButton from './Property/FavoriteButton';
import { Property } from '../types';

export default function PropertyCard({ property }: { property: Property }) {
  const { openBookingModal } = useExperience();

  return (
    <div className="glass rounded-xl p-4 shadow-2xl transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_20px_80px_rgba(5,37,78,0.18)]">
      <div className="h-44 w-full bg-gradient-to-br from-[#051022] to-[#081122] rounded-lg overflow-hidden mb-3 flex items-end">
        <img src={property.image} alt={property.title} className="w-full h-full object-cover opacity-90" />
      </div>
      <div>
        <h3 className="font-semibold text-lg">{property.title}</h3>
        <p className="text-sm opacity-70">{property.location}</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="text-gold font-semibold">${property.price.toLocaleString()}</div>
          <Link href={`/property/${property.id}`} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-400/40 hover:bg-cyan-500/10">
            Preview
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={openBookingModal}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-cyan-100 transition hover:border-cyan-400/40 hover:bg-cyan-500/10"
          >
            Book a preview
          </button>
          <FavoriteButton propertyId={property.id} />
        </div>
      </div>
    </div>
  );
}
