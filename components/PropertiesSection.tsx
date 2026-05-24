import React, { Suspense, useEffect, useState } from 'react';
import PropertyCard from './PropertyCard';
import sample from '../lib/sample-data';
import { Canvas } from '@react-three/fiber';
import PropertyCard3D from './Three/PropertyCard3D';
import { Property } from '../types';

function ListingSkeleton() {
  return (
    <div className="glass-luxury overflow-hidden rounded-[1.65rem] p-3">
      <div className="h-72 animate-pulse rounded-[1.25rem] bg-gradient-to-br from-white/12 via-white/[0.045] to-cyan-100/10" />
      <div className="space-y-3 px-2 pb-2 pt-5">
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-white/12" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/8" />
        <div className="flex gap-2 pt-2">
          <div className="h-8 w-20 animate-pulse rounded-full bg-white/8" />
          <div className="h-8 w-20 animate-pulse rounded-full bg-white/8" />
          <div className="h-8 w-24 animate-pulse rounded-full bg-white/8" />
        </div>
      </div>
    </div>
  );
}

export default function PropertiesSection() {
  const [properties, setProperties] = useState<Property[]>(sample.properties);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProperties() {
      setLoading(true);
      try {
        const response = await fetch('/api/properties');
        const result = await response.json();
        if (response.ok && Array.isArray(result.data) && result.data.length) {
          setProperties(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch properties', error);
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
  }, []);

  const curatedProperties = properties.slice(0, 3);
  const filteredProperties = properties.filter((property) => {
    const searchLower = query.toLowerCase();
    return property.title.toLowerCase().includes(searchLower) || property.location.toLowerCase().includes(searchLower);
  });

  return (
    <section className="section-cinematic relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(103,232,249,0.12),transparent_30%),radial-gradient(circle_at_80%_22%,rgba(216,183,106,0.1),transparent_28%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent" />
      <div className="container relative z-10 mx-auto px-6">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_0.42fr] lg:items-end">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-cyan-100/62">Private inventory</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-none sm:text-6xl">Homes staged like cinematic launches.</h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200/66">Curated architecture, immersive previews, and concise investment signals arranged for fast, high-confidence decisions.</p>
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city, residence, or mood"
            className="min-h-14 w-full rounded-full border-white/10 bg-black/20 px-5 text-sm"
          />
        </div>

        {!loading && curatedProperties.length > 0 && (
          <div className="mb-8 grid gap-3 sm:grid-cols-3">
            {curatedProperties.map((property, index) => (
              <div key={property.id} className="glass-luxury rounded-[1.25rem] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-cyan-100/58">Scene {index + 1}</p>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d8b76a] shadow-[0_0_18px_rgba(216,183,106,0.75)]" />
                </div>
                <p className="mt-3 text-base font-semibold text-white">{property.title}</p>
                <p className="mt-1 text-sm text-slate-200/58">{property.location}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)]">
          <div className="grid gap-6 md:grid-cols-2">
            {loading ? (
              <>
                <ListingSkeleton />
                <ListingSkeleton />
                <ListingSkeleton />
              </>
            ) : filteredProperties.length > 0 ? (
              filteredProperties.map((property, index) => <PropertyCard key={property.id} property={property} index={index} />)
            ) : (
              <div className="glass-luxury rounded-[1.65rem] p-10 text-center text-slate-300/70 md:col-span-2">No listings match your search. Refine the brief and the atelier will recalibrate.</div>
            )}
          </div>

          <div className="sticky top-28 hidden h-[620px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#02040a] shadow-cinematic xl:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(103,232,249,0.14),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
            <div className="absolute left-6 right-6 top-6 z-10">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-cyan-100/58">Spatial preview</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-normal text-white">Portfolio constellation</h3>
            </div>
            <Canvas camera={{ position: [0, 0.7, 4.2], fov: 38 }} dpr={[0.75, 1.35]}>
              <ambientLight intensity={0.58} />
              <pointLight position={[-3, 4, 2]} intensity={1.1} color="#67e8f9" />
              <directionalLight position={[3, 4, 2]} intensity={1.05} />
              <Suspense fallback={null}>
                <PropertyCard3D position={[-1.6, -0.2, 0]} data={sample.properties[0]} />
                <PropertyCard3D position={[0, 0.05, -0.2]} data={sample.properties[1]} />
                <PropertyCard3D position={[1.6, -0.2, 0]} data={sample.properties[2]} />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  );
}
