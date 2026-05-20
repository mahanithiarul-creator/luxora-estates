import React from 'react';
import { Html, useProgress } from '@react-three/drei';

export default function ProgressiveLoader() {
  const { progress, active } = useProgress();
  return (
    <Html center>
      <div className="glass p-4 rounded-lg text-center">
        <div className="text-sm opacity-80">Loading 3D assets</div>
        <div className="mt-2 font-bold">{Math.round(progress)}%</div>
      </div>
    </Html>
  );
}
