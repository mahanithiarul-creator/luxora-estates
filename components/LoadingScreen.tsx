import React, { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 900);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#02040a]/86 backdrop-blur-2xl">
      <div className="glass-luxury relative overflow-hidden rounded-[2rem] px-8 py-10 text-center shadow-cinematic">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/70 to-transparent" />
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/[0.045]">
          <div className="h-12 w-12 animate-pulse rounded-full bg-[radial-gradient(circle_at_35%_25%,#ffffff,#9defff_45%,#d8b76a)] shadow-[0_0_60px_rgba(103,232,249,0.26)]" />
        </div>
        <p className="mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-cyan-100/70">Luxora immersive assets</p>
        <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-2/3 animate-shimmer rounded-full bg-gradient-to-r from-cyan-200 via-white to-[#d8b76a]" />
        </div>
      </div>
    </div>
  );
}
