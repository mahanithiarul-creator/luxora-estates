import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import AnimatedNumber from './AnimatedNumber';
import MagneticButton from './UX/MagneticButton';
import { useExperience } from './Experience/ExperienceContext';

const AdvancedCanvasScene = dynamic(() => import('./Scene/AdvancedCanvasScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 -z-10 bg-slate-950" />,
});

export default function Hero() {
  const { openBookingModal, openConciergeModal } = useExperience();

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <AdvancedCanvasScene />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(19,212,255,0.12),_transparent_24%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,7,22,0.25),rgba(2,4,10,0.8))]" />

      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl space-y-10">
            <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.95, ease: 'easeOut' }}>
              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-cyan-200/80 backdrop-blur-md">
                Exclusive Luxury Launch
              </span>
              <h1 className="mt-8 text-5xl md:text-7xl font-extrabold leading-tight tracking-[-0.04em] text-white drop-shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
                LUXORA ESTATES
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200/80">
                A cinematic luxury real-estate experience designed for visionary portfolios, premium launches, and immersive architectural storytelling.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.05, delay: 0.15, ease: 'easeOut' }} className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] items-center">
              <div className="flex flex-wrap gap-4">
                <MagneticButton
                  className="btn-glow rounded-full px-7 py-3 text-sm font-semibold"
                  type="button"
                  onClick={() => openBookingModal()}
                >
                  Book a viewing
                </MagneticButton>
                <MagneticButton
                  className="btn-ghost rounded-full px-7 py-3 text-sm font-semibold"
                  type="button"
                  onClick={() => openConciergeModal()}
                >
                  AI concierge
                </MagneticButton>
              </div>
              <div className="glass rounded-full border border-white/10 px-5 py-3 text-sm text-cyan-100/85 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                Premium design, cinematic motion, polished storytelling.
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.22, ease: 'easeOut' }} className="grid gap-4 sm:grid-cols-2">
              <div className="glass rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Properties</p>
                <AnimatedNumber value={1240} label="Available" />
              </div>
              <div className="glass rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Agents</p>
                <AnimatedNumber value={320} label="Curated Luxury" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center px-6">
        <div className="glass flex items-center gap-3 rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200/80 shadow-[0_22px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          Swipe, scroll, or tap to unlock the luxury preview.
        </div>
      </div>
    </section>
  );
}
