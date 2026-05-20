import { motion } from 'framer-motion';
import GlassModal from '../Modal/GlassModal';
import { useExperience } from './ExperienceContext';
import React from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
};

const suggestions = [
  'Curate a bespoke investor property collection.',
  'Recommend premium residences with skyline views.',
  'Create a portfolio-ready luxury tour sequence.',
];

export default function GlobalConciergeModal({ open, onClose }: Props) {
  const { showToast } = useExperience();

  const requestPlan = () => {
    showToast({
      type: 'info',
      title: 'AI concierge activated',
      message: 'A curated property sequence is being assembled just for you.',
    });
    onClose();
  };

  return (
    <GlassModal open={open} onClose={onClose} title="AI concierge" subtitle="Ask Astra to tailor the next luxury property collection.">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <p className="text-sm text-slate-300">Your private concierge can refine your search, recommend investor suites, and prepare a VIP showing brief.</p>
        <div className="grid gap-3">
          {suggestions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                showToast({ type: 'info', title: 'Recommendation queued', message: item });
              }}
              className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-100 transition hover:border-cyan-400/30 hover:bg-cyan-500/10"
            >
              {item}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={requestPlan}
          className="w-full rounded-3xl bg-gradient-to-r from-[#0ec0ff] via-[#46a7ff] to-[#0778d2] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:-translate-y-0.5"
        >
          Request curated sequence
        </button>
      </motion.div>
    </GlassModal>
  );
}
