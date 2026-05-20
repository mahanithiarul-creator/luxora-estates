import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import React, { useEffect, useRef } from 'react';
import { useAuth } from './Auth/AuthContext';
import { useExperience } from './Experience/ExperienceContext';

export default function NavBar() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { user, signOut } = useAuth();
  const { openDemoOverlay } = useExperience();

  useEffect(() => {
    let last = window.scrollY;
    function onScroll() {
      const current = window.scrollY;
      if (!ref.current) return;
      if (current > last && current > 80) {
        ref.current.style.transform = 'translateY(-120%)';
        ref.current.style.opacity = '0';
      } else {
        ref.current.style.transform = 'translateY(0)';
        ref.current.style.opacity = '1';
      }
      last = current;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav ref={ref} className="fixed top-6 left-0 right-0 z-50 mx-auto max-w-7xl px-6 transition-transform duration-300">
      <div className="flex items-center justify-between glass py-3 px-4 rounded-xl shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/">
            <a className="font-semibold text-lg tracking-wider neon">LUXORA</a>
          </Link>
          <div className="hidden md:flex gap-4 text-sm opacity-80">
            <Link href="/properties"><a>Properties</a></Link>
            <Link href="/agents"><a>Agents</a></Link>
            <Link href="/about"><a>About</a></Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openDemoOverlay}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.14em] text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-400/10"
          >
            Demo mode
          </button>
          <ThemeToggle />
          {user ? (
            <>
              <Link href="/dashboard">
                <a className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.18em] text-cyan-100 transition hover:border-cyan-400/40">
                  Dashboard
                </a>
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="rounded-full border border-white/10 bg-gradient-to-r from-[#062232] to-[#0b1220] px-4 py-2 text-sm uppercase tracking-[0.18em] text-cyan-100 transition hover:scale-105"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/login">
              <a className="rounded-full border border-white/10 bg-gradient-to-r from-[#062232] to-[#0b1220] px-4 py-2 text-sm uppercase tracking-[0.18em] text-cyan-100 transition hover:scale-105">
                Sign in
              </a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
