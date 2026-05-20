import { motion } from 'framer-motion';
import React, { useMemo, useState } from 'react';

export default function MortgageCalculator({ price }: { price: number }) {
  const [downPayment, setDownPayment] = useState(20);
  const [termYears, setTermYears] = useState(25);
  const interestRate = 3.45;

  const monthlyPayment = useMemo(() => {
    const principal = price * (1 - downPayment / 100);
    const monthlyRate = interestRate / 100 / 12;
    const months = termYears * 12;
    return principal * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -months)));
  }, [price, downPayment, termYears]);

  return (
    <div className="glass p-6 rounded-3xl border border-white/10 shadow-xl">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/75">Luxury financing</p>
        <h2 className="mt-3 text-2xl font-semibold neon">Mortgage preview</h2>
      </div>

      <div className="space-y-5">
        <div className="rounded-3xl bg-white/5 p-4">
          <p className="text-sm opacity-70">Price</p>
          <p className="mt-2 text-3xl font-semibold">${price.toLocaleString()}</p>
        </div>

        <div>
          <label className="block text-sm opacity-70">Down payment</label>
          <div className="mt-3 flex items-center gap-4">
            <input
              type="range"
              min="10"
              max="40"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <span className="w-16 text-right font-semibold">{downPayment}%</span>
          </div>
        </div>

        <div>
          <label className="block text-sm opacity-70">Term</label>
          <div className="mt-3 flex items-center gap-4">
            <input
              type="range"
              min="10"
              max="40"
              value={termYears}
              onChange={(e) => setTermYears(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <span className="w-16 text-right font-semibold">{termYears} yrs</span>
          </div>
        </div>

        <motion.div className="rounded-3xl bg-cyan-500/10 p-4 border border-cyan-400/10" whileHover={{ y: -2 }}>
          <p className="text-sm opacity-80">Estimated monthly</p>
          <p className="mt-2 text-3xl font-semibold">${Math.round(monthlyPayment).toLocaleString()}</p>
          <p className="mt-1 text-sm opacity-60">Based on {interestRate}% APR and a {termYears}-year term.</p>
        </motion.div>

        <button className="w-full rounded-3xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950 shadow-xl shadow-cyan-500/20">
          Reserve private tour
        </button>
      </div>
    </div>
  );
}
