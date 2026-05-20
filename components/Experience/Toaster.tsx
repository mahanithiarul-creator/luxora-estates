import { AnimatePresence, motion } from 'framer-motion';

type ToastItem = {
  id: number;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
};

type Props = {
  items: ToastItem[];
};

const toastColors = {
  success: 'from-cyan-500/20 to-slate-900/80 border-cyan-400/20 text-cyan-100',
  error: 'from-rose-500/20 to-slate-900/80 border-rose-400/20 text-rose-100',
  info: 'from-slate-700/80 to-slate-900/90 border-white/10 text-slate-100',
};

export default function Toaster({ items }: Props) {
  return (
    <div className="fixed right-6 top-6 z-50 flex flex-col gap-4">
      <AnimatePresence initial={false}>
        {items.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`w-[320px] rounded-3xl border p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-3xl bg-gradient-to-br ${toastColors[toast.type]}`}
          >
            <p className="text-xs uppercase tracking-[0.28em] opacity-80">{toast.title}</p>
            <p className="mt-2 text-sm leading-6">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
