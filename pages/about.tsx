import React from 'react';
import Footer from '../components/Footer';

const principles = [
  ['Cinematic first', 'Every listing is treated like a launch film, with mood, pacing, and context.'],
  ['Private by design', 'The experience favors calm curation over noisy marketplace behavior.'],
  ['Investor ready', 'Signal, service, and storytelling stay aligned for serious decisions.'],
];

export default function About() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#02040a] text-white">
      <section className="relative px-6 pb-20 pt-36 sm:pt-44">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(103,232,249,0.18),transparent_34%),radial-gradient(circle_at_82%_10%,rgba(216,183,106,0.12),transparent_28%),linear-gradient(180deg,#03050b,#02040a)]" />
        <div className="cinematic-grain absolute inset-0 opacity-[0.1]" />
        <div className="container relative z-10 mx-auto">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-cyan-100/62">About Luxora</p>
          <h1 className="mt-5 max-w-5xl text-[clamp(3.2rem,8vw,7.5rem)] font-black uppercase leading-[0.9]">Luxury real estate, staged for attention.</h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-200/68">Luxora blends architectural storytelling, AI curation, and white-glove workflows into a quieter, more cinematic way to discover rare homes.</p>
        </div>
      </section>

      <section className="container mx-auto grid gap-5 px-6 pb-24 md:grid-cols-3">
        {principles.map(([title, body]) => (
          <div key={title} className="glass-luxury rounded-[1.5rem] p-6">
            <p className="text-xl font-semibold text-white">{title}</p>
            <p className="mt-4 text-sm leading-7 text-slate-200/62">{body}</p>
          </div>
        ))}
      </section>
      <Footer />
    </main>
  );
}
