import React, { useEffect, useRef } from 'react';

type Props = { value: number; label?: string };

export default function AnimatedNumber({ value, label }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    function frame(now: number) {
      const t = Math.min(1, (now - startTime) / duration);
      const current = Math.floor(t * value);
      if (ref.current) ref.current.textContent = current.toString();
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }, [value]);

  return (
    <div className="flex flex-col">
      <span ref={ref} className="text-2xl font-bold neon">0</span>
      {label && <span className="text-xs opacity-60">{label}</span>}
    </div>
  );
}
