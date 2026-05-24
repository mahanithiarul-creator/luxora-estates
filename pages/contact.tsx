import React from 'react';
import Footer from '../components/Footer';

export default function Contact() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#02040a] text-white">
      <section className="relative px-6 pb-20 pt-36 sm:pt-44">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(103,232,249,0.18),transparent_34%),radial-gradient(circle_at_80%_8%,rgba(216,183,106,0.12),transparent_28%),linear-gradient(180deg,#03050b,#02040a)]" />
        <div className="container relative z-10 mx-auto grid gap-10 lg:grid-cols-[1fr_0.52fr] lg:items-end">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-cyan-100/62">Concierge desk</p>
            <h1 className="mt-5 max-w-5xl text-[clamp(3.2rem,8vw,7.5rem)] font-black uppercase leading-[0.9]">Plan the private showing.</h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-200/68">Send the brief, desired market, and viewing window. Luxora will shape the sequence into a polished private experience.</p>
          </div>
          <div className="glass-luxury rounded-[1.75rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100/58">Direct line</p>
            <p className="mt-5 text-2xl font-semibold text-white">hello@luxora.example</p>
            <p className="mt-4 text-sm leading-7 text-slate-200/62">Private showings, investor walkthroughs, architecture-led curation, and launch presentations.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
