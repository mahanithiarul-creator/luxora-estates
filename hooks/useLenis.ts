import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export default function useLenis() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });

    function raf(t: number) {
      lenis.raf(t);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      // no explicit destroy API; allow GC
    };
  }, []);
}
