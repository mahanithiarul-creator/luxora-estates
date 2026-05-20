import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode };

export default function MagneticButton({ children, className = '', ...rest }: Props) {
  const ref = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function onMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.11, y: y * 0.07, scale: 1.03, duration: 0.35, ease: 'power3.out' });
    }
    function onLeave() {
      gsap.to(el, { x: 0, y: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1,0.6)' });
    }
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <button
      ref={ref}
      className={`${className} relative overflow-hidden transition-all duration-300 ease-out hover:shadow-[0_24px_80px_rgba(56,189,248,0.22)]`}
      {...rest}
    >
      {children}
      <span className="absolute inset-0 pointer-events-none" />
    </button>
  );
}
