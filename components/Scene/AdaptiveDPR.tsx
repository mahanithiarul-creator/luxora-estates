import { useFrame, useThree } from '@react-three/fiber';
import React, { useRef } from 'react';

// Adaptive DPR: reduces pixel ratio when frame delta increases to maintain FPS
export default function AdaptiveDPR({ min = 0.6, max = 1.5 } = { min: 0.6, max: 1.5 }) {
  const { gl } = useThree();
  const frame = useRef({ last: performance.now(), drops: 0 });

  useFrame(({ clock, delta }) => {
    const now = performance.now();
    const fps = 1 / delta;
    // if fps drops below 45, reduce DPR slightly
    if (fps < 45) {
      const next = Math.max(min, gl.getPixelRatio() - 0.05);
      gl.setPixelRatio(next);
    } else if (fps > 50) {
      const next = Math.min(max, gl.getPixelRatio() + 0.02);
      gl.setPixelRatio(next);
    }
  });

  return null;
}
