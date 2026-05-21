import { useEffect } from 'react';

// Lightweight visualizer: updates CSS variables based on mouse movement or optional audio input
export default function useAudioVisual() {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    function onMove(e: MouseEvent) {
      const intensity = Math.min(1, Math.hypot(e.movementX, e.movementY) / 40);
      document.documentElement.style.setProperty('--visual-intensity', String(intensity));
    }

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
}
