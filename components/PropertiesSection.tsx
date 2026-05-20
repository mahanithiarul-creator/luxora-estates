import React, { Suspense, useEffect, useState } from 'react';
import PropertyCard from './PropertyCard';
import sample from '../lib/sample-data';
import { Canvas } from '@react-three/fiber';
import PropertyCard3D from './Three/PropertyCard3D';
import { Property } from '../types';

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
        if (response.ok && Array.isArray(result.data)) {
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
    return (
      property.title.toLowerCase().includes(searchLower) ||
      property.location.toLowerCase().includes(searchLower) ||
      (property.category ?? '').toLowerCase().includes(searchLower)
    );
  });

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold neon">Featured Properties</h2>
            <p className="mt-2 max-w-2xl text-sm opacity-70">Live listings, curated design narratives, and premium discovery for every investor.</p>
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city, style, or suite"
            className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-950/75 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
          />
        </div>

        {!loading && curatedProperties.length > 0 && (
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {curatedProperties.map((property) => (
              <div key={property.id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-lg">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Curated collection</p>
                <p className="mt-3 text-lg font-semibold text-white">{property.title}</p>
                <p className="mt-2 text-sm opacity-70">{property.location}</p>
                <p className="mt-4 text-sm text-cyan-100">Live recommendation for premium buyers.</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {loading ? (
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-10 text-center text-slate-400">Loading premium listings...</div>
            ) : filteredProperties.length > 0 ? (
              filteredProperties.map((property) => <PropertyCard key={property.id} property={property} />)
            ) : (
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-10 text-center text-slate-400">No listings match your search. Explore the latest luxury homes.</div>
            )}
          </div>

          <div className="glass rounded-xl p-4 h-[480px]">
            <Canvas camera={{ position: [0, 0.6, 4], fov: 40 }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[3, 4, 2]} intensity={1} />
              <Suspense fallback={null}>
                <PropertyCard3D position={[-1.6, 0, 0]} data={sample.properties[0]} />
                <PropertyCard3D position={[0, 0, 0]} data={sample.properties[1]} />
                <PropertyCard3D position={[1.6, 0, 0]} data={sample.properties[2]} />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  );
}
