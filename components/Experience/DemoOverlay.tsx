'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type DemoOverlayProps = {
  open: boolean;
  onClose: () => void;
};

const steps = [
  {
    title: 'Welcome to Luxora Estates',
    subtitle: 'A cinematic luxury property experience crafted for visionary launch stories.',
  },
  {
    title: 'Live bookings • AI concierge • premium analytics',
    subtitle: 'Every interaction is polished, intentional, and worthy of recruitment showreels.',
  },
  {
    title: 'Scroll to unlock the portfolio',
    subtitle: 'Reveal immersive listings, designer previews, and the world-class luxury journey.',
  },
];

export default function DemoOverlay({ open, onClose }: DemoOverlayProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    setStepIndex(0);

    const timers = [
      window.setTimeout(() => setStepIndex(1), 3600),
      window.setTimeout(() => setStepIndex(2), 7600),
      window.setTimeout(() => onClose(), 11800),
    ];

    return () => timers.forEach(clearTimeout);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 0.8, 0.3, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-6 py-10"
      >
        <motion.div
          initial={{ y: 32, opacity: 0.85 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -24, opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 0.8, 0.3, 1] }}
          className="relative max-w-3xl rounded-[32px] border border-white/10 bg-slate-950/95 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-3xl"
        >
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-cyan-400/10 via-transparent to-violet-300/5" />
          <div className="relative space-y-6 text-center">
            <div className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-200/80 backdrop-blur-md">
              Demo mode engaged
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.04em] text-white">
              {steps[stepIndex].title}
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-200/80">
              {steps[stepIndex].subtitle}
            </p>

            <div className="mx-auto flex max-w-xs items-center justify-center gap-3">
              {steps.map((_, index) => (
                <span
                  key={index}
                  className={`h-2.5 w-10 rounded-full transition-all duration-300 ${
                    index === stepIndex ? 'bg-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.28)]' : 'bg-white/15'
                  }`}
                />
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:border-cyan-300/40 hover:bg-cyan-400/10"
              >
                Explore now
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-slate-900/95 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-200 transition hover:bg-slate-800"
              >
                Skip intro
              </button>
            </div>

            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">
              Use the demo overlay to pitch the platform as a luxury launch and recruiter-worthy product.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
