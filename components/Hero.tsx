import { motion, useReducedMotion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import AnimatedNumber from './AnimatedNumber';
import MagneticButton from './UX/MagneticButton';
import { useExperience } from './Experience/ExperienceContext';

const AdvancedCanvasScene = dynamic(() => import('./Scene/AdvancedCanvasScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_10%,rgba(46,196,255,0.2),transparent_42%),linear-gradient(180deg,#05070d,#070b13_54%,#02040a)]" />,
});

const particles = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${12 + ((index * 19) % 74)}%`,
  delay: index * 0.18,
  duration: 8 + (index % 5) * 1.4,
}));

const skylineBars = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  width: 34 + (index % 4) * 14,
  height: 70 + ((index * 43) % 190),
  opacity: 0.22 + (index % 5) * 0.05,
}));

export default function Hero() {
  const { openBookingModal, openConciergeModal } = useExperience();
  const [isLoaded, setIsLoaded] = useState(false);
  const reduceMotion = useReducedMotion();

  const container = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: reduceMotion ? 0.03 : 0.14,
          delayChildren: reduceMotion ? 0 : 0.24,
        },
      },
    }),
    [reduceMotion],
  );

  const item = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24, filter: reduceMotion ? 'blur(0px)' : 'blur(14px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative isolate flex min-h-screen w-full overflow-hidden bg-[#03050b]">
      <AdvancedCanvasScene />

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_22%,rgba(88,166,255,0.23),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(212,175,55,0.12),transparent_26%),linear-gradient(180deg,rgba(3,5,11,0.04),rgba(3,5,11,0.72)_58%,#03050b_100%)]" />
      <motion.div
        aria-hidden
        className="absolute inset-x-[-20%] top-[-32%] -z-10 h-[56rem] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(71,215,255,0.18),rgba(217,181,90,0.12),rgba(125,95,255,0.16),rgba(71,215,255,0.18))] blur-3xl"
        animate={reduceMotion ? undefined : { rotate: [0, 9, -5, 0], opacity: [0.55, 0.85, 0.62] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="cinematic-grain absolute inset-0 z-0 opacity-[0.13]" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:96px_96px] opacity-20 [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_68%,transparent)]" />

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute h-1 w-1 rounded-full bg-cyan-100/70 shadow-[0_0_18px_rgba(103,232,249,0.9)]"
            style={{ left: particle.left, top: particle.top }}
            animate={reduceMotion ? undefined : { y: [-8, -42, -8], opacity: [0, 0.8, 0], scale: [0.7, 1.35, 0.7] }}
            transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex h-[34vh] items-end justify-center gap-1 px-4 opacity-80 [mask-image:linear-gradient(to_top,black,transparent_88%)]">
        {skylineBars.map((bar) => (
          <motion.span
            key={bar.id}
            className="block rounded-t-sm border-t border-cyan-100/20 bg-gradient-to-t from-cyan-200/10 via-slate-300/5 to-white/10 shadow-[0_0_40px_rgba(56,189,248,0.08)]"
            style={{ width: bar.width, height: bar.height, opacity: bar.opacity }}
            animate={reduceMotion ? undefined : { opacity: [bar.opacity * 0.6, bar.opacity, bar.opacity * 0.72] }}
            transition={{ duration: 5 + (bar.id % 5), repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1480px] items-center px-5 pb-24 pt-28 sm:px-8 lg:px-12">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          onAnimationComplete={() => setIsLoaded(true)}
          className="grid w-full items-end gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.62fr)]"
        >
          <div className="max-w-5xl">
            <motion.div variants={item} className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.055] px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_18px_70px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d8b76a] shadow-[0_0_18px_rgba(216,183,106,0.8)]" />
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-slate-100/78">Private AI real estate atelier</span>
            </motion.div>

            <motion.h1 variants={item} className="max-w-6xl text-balance font-black uppercase leading-[0.9] tracking-[0.01em] text-white">
              <span className="block text-[clamp(4rem,13vw,12.5rem)]">Luxora</span>
              <span className="text-gradient-luxury block text-[clamp(3.45rem,11vw,10.5rem)]">Estates</span>
            </motion.h1>

            <motion.p variants={item} className="mt-7 max-w-2xl text-pretty text-base leading-8 text-slate-200/76 sm:text-lg lg:text-xl">
              Cinematic property intelligence for rare homes, private viewings, and global investment moments. Built for the clients who expect the search itself to feel exceptional.
            </motion.p>

            <motion.div variants={item} className="mt-9 flex flex-col gap-4 sm:flex-row">
              <MagneticButton
                className="btn-luxury-primary rounded-full px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] sm:px-9"
                type="button"
                onClick={() => openBookingModal()}
              >
                Schedule Private Viewing
              </MagneticButton>
              <MagneticButton
                className="btn-luxury-secondary rounded-full px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] sm:px-9"
                type="button"
                onClick={() => openConciergeModal()}
              >
                Open AI Concierge
              </MagneticButton>
            </motion.div>
          </div>

          <motion.aside variants={item} className="glass-luxury relative overflow-hidden rounded-[2rem] p-5 sm:p-6 lg:justify-self-end lg:self-end">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/70 to-transparent" />
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-cyan-100/70">Portfolio signal</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                <AnimatedNumber value={1240} label="Curated homes" />
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                <AnimatedNumber value={320} label="Market experts" />
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-5">
                <span className="text-xs uppercase tracking-[0.24em] text-slate-300/68">Live curation</span>
                <span className="rounded-full bg-emerald-300/12 px-3 py-1 text-xs font-semibold text-emerald-100">Active</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-200/72">AI-assisted matching across private listings, architectural styles, lifestyle signals, and investment criteria.</p>
            </div>
          </motion.aside>
        </motion.div>
      </div>

      {isLoaded && (
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduceMotion ? 0 : 0.7, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 text-slate-200/70 sm:flex"
        >
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.34em]">Explore</span>
          <span className="relative h-12 w-[1px] overflow-hidden bg-white/12">
            <motion.span className="absolute left-0 top-0 h-5 w-full bg-cyan-100" animate={reduceMotion ? undefined : { y: [-20, 48] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} />
          </span>
        </motion.div>
      )}
    </section>
  );
}
