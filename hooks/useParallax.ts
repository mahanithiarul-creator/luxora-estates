import { useEffect } from 'react';

export default function useParallax(selector = '[data-parallax]') {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    function onMove(e: MouseEvent) {
      const items = document.querySelectorAll(selector);
      items.forEach((el) => {
        const speed = Number((el as HTMLElement).dataset.parallaxSpeed || 0.06);
        const x = (e.clientX - window.innerWidth / 2) * speed;
        const y = (e.clientY - window.innerHeight / 2) * speed;
        (el as HTMLElement).style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    }

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [selector]);
}
