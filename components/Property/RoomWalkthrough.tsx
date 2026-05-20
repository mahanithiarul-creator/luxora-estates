import React from 'react';
import { motion } from 'framer-motion';

type Room = {
  id: 'entrance' | 'lounge' | 'terrace';
  title: string;
  description: string;
};

type Props = {
  rooms: Room[];
  activeRoom: Room['id'];
  setActiveRoom: (room: Room['id']) => void;
};

export default function RoomWalkthrough({ rooms, activeRoom, setActiveRoom }: Props) {
  const active = rooms.find((room) => room.id === activeRoom) || rooms[0];

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="glass rounded-[32px] border border-white/10 p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4 lg:max-w-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Walkthrough navigator</p>
          <h2 className="text-3xl font-semibold neon">Immersive room sequencing</h2>
          <p className="text-base leading-7 text-slate-200/85">Select any point in the private residence and watch the cinematic camera refocus to the next luxury environment.</p>
        </div>

        <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl lg:w-[360px]">
          {rooms.map((room) => (
            <button
              key={room.id}
              type="button"
              onClick={() => setActiveRoom(room.id)}
              className={`rounded-3xl px-4 py-3 text-left transition ${
                room.id === activeRoom ? 'border border-cyan-400/40 bg-cyan-500/10 text-white shadow-[0_18px_70px_rgba(18,84,133,0.18)]' : 'border border-white/10 bg-slate-950/70 text-slate-100 hover:border-cyan-400/30'
              }`}
            >
              <span className="text-sm uppercase tracking-[0.24em] text-cyan-200/65">{room.title}</span>
              <p className="mt-2 text-sm leading-6 text-slate-100 opacity-85">{room.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] bg-gradient-to-br from-slate-950/85 to-[#021126]/80 border border-white/10 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
          <div className="grid gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Current focus</p>
              <h3 className="mt-3 text-2xl font-semibold neon">{active.title}</h3>
            </div>
            <p className="text-sm leading-7 text-slate-200/85">{active.description}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm">
                <p className="uppercase tracking-[0.26em] text-cyan-200/75">Ambience</p>
                <p className="mt-2 font-semibold">Cinematic</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm">
                <p className="uppercase tracking-[0.26em] text-cyan-200/75">Lighting</p>
                <p className="mt-2 font-semibold">Mood-driven</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm">
                <p className="uppercase tracking-[0.26em] text-cyan-200/75">Narrative</p>
                <p className="mt-2 font-semibold">Luxury story</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/85 p-6 shadow-xl">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-500 opacity-80" />
          <div className="relative grid gap-2">
            <div className="text-sm uppercase tracking-[0.26em] text-cyan-200/70">Environmental pulse</div>
            <div className="grid gap-3 rounded-3xl border border-white/10 bg-slate-900/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-100">Atmospheric motion</span>
                <span className="text-sm text-cyan-300">Active</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="h-14 rounded-full bg-cyan-500/20 animate-pulse" />
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
              <p>Use the navigator above to glide through premium rooms, ramping up the cinematic focus for investor and recruiter presentations.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
