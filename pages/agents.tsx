import React from 'react';
import Footer from '../components/Footer';

const agents = [
  ['Mira Vale', 'Ultra-prime waterfront portfolios', 'Dubai, Monaco'],
  ['Julian Cross', 'Penthouses and private negotiations', 'New York, London'],
  ['Amara Stone', 'Architectural estates and retreats', 'California, Bali'],
];

export default function Agents() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#02040a] text-white">
      <section className="relative px-6 pb-20 pt-36 sm:pt-44">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(103,232,249,0.17),transparent_34%),radial-gradient(circle_at_82%_8%,rgba(216,183,106,0.12),transparent_28%),linear-gradient(180deg,#03050b,#02040a)]" />
        <div className="container relative z-10 mx-auto">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-cyan-100/62">Private advisors</p>
          <h1 className="mt-5 max-w-5xl text-[clamp(3.2rem,8vw,7.5rem)] font-black uppercase leading-[0.9]">Elite agents for rare decisions.</h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-200/68">A focused advisory layer for private showings, discreet negotiations, and investor-grade property narratives.</p>
        </div>
      </section>

      <section className="container mx-auto grid gap-5 px-6 pb-24 md:grid-cols-3">
        {agents.map(([name, focus, region]) => (
          <div key={name} className="glass-luxury rounded-[1.5rem] p-6">
            <div className="mb-6 h-20 w-20 rounded-full border border-white/12 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.24),rgba(103,232,249,0.11),rgba(2,4,10,0.8))]" />
            <p className="text-2xl font-semibold text-white">{name}</p>
            <p className="mt-3 text-sm leading-7 text-slate-200/66">{focus}</p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.26em] text-cyan-100/58">{region}</p>
          </div>
        ))}
      </section>
      <Footer />
    </main>
  );
}
