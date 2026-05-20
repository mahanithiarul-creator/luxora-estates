import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function LightingRig({ intensity = 1.4 }: { intensity?: number }) {
  const pulse = useRef(0);
  const direction = useRef(1);

  useFrame((state) => {
    pulse.current = Math.sin(state.clock.elapsedTime * 0.55) * 0.5 + 0.6;
    direction.current = Math.sin(state.clock.elapsedTime * 0.18);
  });

  return (
    <group>
      {/* Cinematic directional key light */}
      <directionalLight
        castShadow
        position={[10, 12, 6]}
        intensity={intensity}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        color={new THREE.Color(0.82, 0.92, 1)}
      />

      {/* subtle top accent light sweep */}
      <rectAreaLight
        args={[0x7ce4ff, 0.48 + pulse.current * 0.18, 7.5, 2.1]}
        position={[-6 + direction.current * 0.8, 6, -3]}
        rotation={[0, Math.PI / 4, 0]}
      />
    </group>
  );
}
