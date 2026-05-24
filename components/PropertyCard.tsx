import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useExperience } from './Experience/ExperienceContext';
import FavoriteButton from './Property/FavoriteButton';
import { Property } from '../types';

const GRADIENT_FALLBACKS = [
  'from-cyan-400/18 via-slate-900/70 to-[#05070d]',
  'from-violet-300/16 via-slate-900/70 to-[#05070d]',
  'from-emerald-300/14 via-slate-900/70 to-[#05070d]',
  'from-rose-300/14 via-slate-900/70 to-[#05070d]',
  'from-[#d8b76a]/18 via-slate-900/70 to-[#05070d]',
];

function formatFeature(value: number | undefined, fallback: string) {
  return typeof value === 'number' && value > 0 ? value.toLocaleString() : fallback;
}

export default function PropertyCard({ property, index = 0 }: { property: Property; index?: number }) {
  const { openBookingModal } = useExperience();
  const [imageError, setImageError] = useState(false);
  const reduceMotion = useReducedMotion();
  const gradientClass = GRADIENT_FALLBACKS[index % GRADIENT_FALLBACKS.length];
  const price = `$${(property.price / 1000000).toFixed(1)}M`;

  return (
    <motion.article
      initial={{ opacity: 0, y: reduceMotion ? 0 : 28, filter: reduceMotion ? 'blur(0px)' : 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.72, delay: Math.min(index * 0.06, 0.24), ease: [0.16, 1, 0.3, 1] }}
      className="property-card group relative overflow-hidden rounded-[1.65rem] border border-white/10 bg-white/[0.045] p-3 shadow-cinematic backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100">
        <div className="absolute -inset-x-10 top-0 h-36 bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.18),transparent)] blur-xl motion-safe:group-hover:animate-shimmer" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_0%,rgba(80,218,255,0.18),transparent_34%),radial-gradient(circle_at_100%_20%,rgba(216,183,106,0.14),transparent_32%)]" />
      </div>

      <div className={`relative aspect-[1.18/1] overflow-hidden rounded-[1.25rem] bg-gradient-to-br ${gradientClass}`}>
        {!imageError ? (
          <Image
            src={property.image}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-[0.86] saturate-[0.92] transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-100 group-hover:saturate-110"
            onError={() => setImageError(true)}
            priority={index === 0}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(94,234,212,0.2),transparent_32%),linear-gradient(145deg,rgba(8,15,28,0.4),rgba(2,4,10,0.95))]" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.16)_48%,rgba(2,4,10,0.82))]" />
        <div className="absolute left-4 top-4 rounded-full border border-white/14 bg-black/24 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white/78 backdrop-blur-xl">
          Private listing
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-[0.64rem] font-semibold uppercase tracking-[0.28em] text-cyan-100/72">{property.location}</p>
            <p className="mt-2 text-2xl font-semibold tracking-normal text-white">{price}</p>
          </div>
          <div className="rounded-full border border-white/14 bg-white/10 px-3 py-2 text-xs font-semibold text-white/82 backdrop-blur-xl">
            {formatFeature(property.area, '4,800')} sqm
          </div>
        </div>
      </div>

      <div className="relative z-10 px-2 pb-2 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold leading-tight tracking-normal text-white transition duration-300 group-hover:text-cyan-50">{property.title}</h3>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-200/68">
              <span className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5">{formatFeature(property.bedrooms, '5')} beds</span>
              <span className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5">{formatFeature(property.bathrooms, '6')} baths</span>
              <span className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5">AI matched</span>
            </div>
          </div>
          <FavoriteButton propertyId={property.id} />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Link
            href={`/property/${property.id}`}
            className="btn-luxury-secondary flex-1 rounded-full px-5 py-3 text-center text-[0.68rem] font-bold uppercase tracking-[0.2em]"
          >
            View Details
          </Link>
          <button
            type="button"
            onClick={openBookingModal}
            className="btn-luxury-primary rounded-full px-5 py-3 text-[0.68rem] font-bold uppercase tracking-[0.2em]"
          >
            Tour
          </button>
        </div>
      </div>
    </motion.article>
  );
}
