import React, { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 900);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-2xl">
      <div className="flex flex-col items-center gap-4 rounded-[32px] border border-white/10 bg-slate-950/80 px-8 py-10 shadow-[0_40px_120px_rgba(0,0,0,0.65)]">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-slate-900/60 shadow-[0_0_50px_rgba(56,189,248,0.25)]">
          <div className="absolute inset-0 rounded-full border border-cyan-300/15 animate-pulse" />
          <div className="relative h-10 w-10 rounded-full bg-white/90" />
        </div>
        <div className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">LUXORA — Loading immersive assets</div>
      </div>
    </div>
  );
}
