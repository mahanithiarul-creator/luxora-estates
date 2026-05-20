import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type ChatMessage = {
  speaker: 'assistant' | 'user';
  message: string;
};

type Props = {
  chatHistory: ChatMessage[];
  typing: boolean;
  suggestions: string[];
  onSelectSuggestion: (query: string) => void;
  onClose: () => void;
};

export default function ConciergePanel({ chatHistory, typing, suggestions, onSelectSuggestion, onClose }: Props) {
  const recentMessages = chatHistory.slice(-4);

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, x: 72 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 72 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="fixed right-6 top-28 z-50 hidden xl:flex w-[420px] flex-col gap-6"
      >
        <div className="glass rounded-[32px] border border-white/10 p-5 shadow-[0_32px_120px_rgba(0,0,0,0.35)] backdrop-blur-3xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">Luxury AI concierge</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Astra</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-2 text-xs uppercase tracking-[0.28em] text-cyan-100/90 transition hover:border-cyan-400/50"
            >
              Close
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {recentMessages.map((message, index) => (
              <div key={`${message.speaker}-${index}`} className={`rounded-3xl p-4 ${message.speaker === 'assistant' ? 'bg-slate-950/70 border border-cyan-400/10' : 'bg-white/5 border border-white/10'}`}>
                <p className="text-[0.86rem] uppercase tracking-[0.24em] text-cyan-200/80">{message.speaker === 'assistant' ? 'Astra' : 'You'}</p>
                <p className="mt-2 text-sm leading-6 text-slate-100">{message.message}</p>
              </div>
            ))}
            {typing && (
              <div className="rounded-3xl border border-cyan-300/20 bg-slate-950/75 p-4">
                <div className="h-9 rounded-full bg-slate-900/80 px-3 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '120ms' }} />
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '240ms' }} />
                  <span className="ml-3 text-xs uppercase tracking-[0.26em] text-cyan-200/70">Intelligent response synthesizing…</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6"> 
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Quick concierge prompts</p>
            <div className="mt-4 grid gap-3">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => onSelectSuggestion(suggestion)}
                  className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-100 transition hover:border-cyan-400/40 hover:bg-cyan-500/10"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-cyan-400/15 bg-gradient-to-b from-white/5 to-transparent p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Live aura</span>
              <span className="text-xs text-cyan-100/85">Ready</span>
            </div>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="h-2 rounded-full bg-cyan-400/30 animate-[pulse_1.4s_ease-in-out_infinite]"
                  style={{ animationDelay: `${index * 90}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
