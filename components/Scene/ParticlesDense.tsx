import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticlesDense({ count = 200 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = Math.random() * 6 - 2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, [count]);

  const ref = React.useRef<any>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.0006;
  });

  return (
    <points ref={ref} frustumCulled>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={'#00e6ff'} size={0.06} sizeAttenuation={true} transparent opacity={0.8} />
    </points>
  );
}
