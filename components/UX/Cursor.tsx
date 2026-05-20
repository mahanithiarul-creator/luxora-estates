import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cursor() {
  const dot = useRef<HTMLDivElement | null>(null);
  const trail = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`;
      if (trail.current) {
        trail.current.style.left = `${x}px`;
        trail.current.style.top = `${y}px`;
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      <div ref={trail} className="cursor-trail" />
      <div ref={dot} className="cursor-dot" />
    </>
  );
}
