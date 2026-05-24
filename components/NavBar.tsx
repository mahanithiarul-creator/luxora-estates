import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from './Auth/AuthContext';
import { useExperience } from './Experience/ExperienceContext';

const navLinks = [
  { href: '/properties', label: 'Properties' },
  { href: '/agents', label: 'Agents' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function NavBar() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { user, signOut } = useAuth();
  const { openDemoOverlay } = useExperience();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    function onScroll() {
      const current = window.scrollY;
      if (!ref.current) return;
      if (current > last && current > 90 && !menuOpen) {
        ref.current.style.transform = 'translateY(-130%)';
        ref.current.style.opacity = '0';
      } else {
        ref.current.style.transform = 'translateY(0)';
        ref.current.style.opacity = '1';
      }
      last = current;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [menuOpen]);

  return (
    <nav ref={ref} className="fixed left-0 right-0 top-4 z-50 mx-auto max-w-7xl px-4 transition-all duration-500 sm:top-6 sm:px-6">
      <div className="glass-luxury overflow-hidden rounded-[1.45rem] px-3 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="group flex items-center gap-3" onClick={() => setMenuOpen(false)}>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-sm font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
              LX
            </span>
            <span>
              <span className="block text-sm font-bold uppercase tracking-[0.28em] text-white">Luxora</span>
              <span className="hidden text-[0.62rem] uppercase tracking-[0.24em] text-cyan-100/56 sm:block">Estates atelier</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200/70 hover:bg-white/[0.06] hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={openDemoOverlay}
              className="btn-luxury-secondary rounded-full px-4 py-2 text-[0.64rem] font-bold uppercase tracking-[0.2em]"
            >
              Demo
            </button>
            <ThemeToggle />
            {user ? (
              <>
                <Link href="/dashboard" className="btn-luxury-secondary rounded-full px-4 py-2 text-[0.64rem] font-bold uppercase tracking-[0.2em]">
                  Dashboard
                </Link>
                <button type="button" onClick={signOut} className="btn-luxury-primary rounded-full px-4 py-2 text-[0.64rem] font-bold uppercase tracking-[0.2em]">
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/login" className="btn-luxury-primary rounded-full px-4 py-2 text-[0.64rem] font-bold uppercase tracking-[0.2em]">
                Sign in
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-xs font-bold uppercase tracking-[0.18em] text-white md:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            {menuOpen ? 'X' : 'II'}
          </button>
        </div>

        {menuOpen && (
          <div className="mt-3 border-t border-white/10 pt-3 md:hidden">
            <div className="grid gap-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-100/84">
                  {link.label}
                </Link>
              ))}
              <button type="button" onClick={openDemoOverlay} className="btn-luxury-secondary rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-[0.22em]">
                Demo mode
              </button>
              {user ? (
                <button type="button" onClick={signOut} className="btn-luxury-primary rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-[0.22em]">
                  Sign out
                </button>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-luxury-primary rounded-2xl px-4 py-3 text-center text-sm font-bold uppercase tracking-[0.22em]">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
