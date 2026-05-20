import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type GlassModalProps = {
  open: boolean;
  title?: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function GlassModal({ open, title, subtitle, onClose, children }: GlassModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/95 shadow-[0_40px_120px_rgba(0,0,0,0.65)] backdrop-blur-3xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                {title && <h2 className="text-2xl font-semibold neon">{title}</h2>}
                {subtitle && <p className="mt-2 text-sm opacity-75">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.24em] text-cyan-100 transition hover:border-cyan-400/40"
              >
                Close
              </button>
            </div>
            <div className="max-h-[76vh] overflow-y-auto p-6">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
