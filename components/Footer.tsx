import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#02040a]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(103,232,249,0.14),transparent_32%),radial-gradient(circle_at_80%_15%,rgba(216,183,106,0.12),transparent_30%)]" />
      <div className="cinematic-grain absolute inset-0 opacity-[0.11]" />
      <div className="container relative z-10 mx-auto px-6 py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr_0.75fr]">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-cyan-100/62">Luxora Estates</p>
            <h2 className="mt-5 max-w-3xl text-4xl font-black uppercase leading-none sm:text-6xl">
              Private property intelligence for the next era of luxury.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-200/64">
              Cinematic discovery, white-glove curation, and immersive real estate storytelling for exceptional homes and exceptional buyers.
            </p>
          </div>

          <div className="glass-luxury rounded-[1.5rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100/62">Explore</p>
            <div className="mt-5 grid gap-3 text-sm text-slate-100/76">
              <Link href="/properties" className="hover:text-white">Properties</Link>
              <Link href="/agents" className="hover:text-white">Agents</Link>
              <Link href="/about" className="hover:text-white">About</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
            </div>
          </div>

          <div className="glass-luxury rounded-[1.5rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100/62">Concierge</p>
            <p className="mt-5 text-sm leading-7 text-slate-100/70">hello@luxora.example</p>
            <p className="mt-3 text-sm leading-7 text-slate-100/70">Private viewings, investment curation, and launch presentations.</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.22em] text-slate-300/48 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Luxora Estates</span>
          <span>Investor-grade cinematic real estate platform</span>
        </div>
      </div>
    </footer>
  );
}
