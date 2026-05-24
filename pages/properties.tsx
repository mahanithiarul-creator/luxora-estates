import React from 'react';
import PropertiesSection from '../components/PropertiesSection';
import Footer from '../components/Footer';

export default function PropertiesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#02040a] text-white">
      <section className="relative px-6 pb-10 pt-36 sm:pt-44">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_0%,rgba(103,232,249,0.18),transparent_34%),radial-gradient(circle_at_78%_8%,rgba(216,183,106,0.12),transparent_28%),linear-gradient(180deg,#03050b,#02040a)]" />
        <div className="container relative z-10 mx-auto">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-cyan-100/62">Global residences</p>
          <h1 className="mt-5 max-w-5xl text-[clamp(3.2rem,8vw,7.5rem)] font-black uppercase leading-[0.9]">Curated cinematic inventory.</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200/66">A focused collection of high-signal luxury homes, staged for discovery, comparison, and private tour planning.</p>
        </div>
      </section>
      <PropertiesSection />
      <Footer />
    </main>
  );
}
