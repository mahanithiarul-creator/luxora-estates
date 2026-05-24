import React from 'react';

export default function SearchBar() {
  return (
    <div className="glass-luxury relative overflow-hidden rounded-[1.75rem] p-4 sm:p-5">
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/70 to-transparent" />
      <div className="grid gap-3 lg:grid-cols-[1fr_0.52fr_0.34fr]">
        <input className="min-h-14 rounded-full border-white/10 bg-black/20 px-5 text-sm" placeholder="Search location, neighbourhood, architecture style" />
        <select className="min-h-14 rounded-full border-white/10 bg-black/20 px-5 text-sm">
          <option>All property types</option>
          <option>Villa</option>
          <option>Penthouse</option>
          <option>Waterfront estate</option>
        </select>
        <button className="btn-luxury-primary min-h-14 rounded-full px-6 text-xs font-bold uppercase tracking-[0.22em]">Search</button>
      </div>
    </div>
  );
}
