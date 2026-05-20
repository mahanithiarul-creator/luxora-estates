import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export default function PropertyCard3D({ position = [0, 0, 0], data }: any) {
  const ref = useRef<THREE.Mesh | null>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.006;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
  });

  return (
    <group position={position as unknown as [number, number, number]}>
      <mesh ref={ref} castShadow>
        <boxGeometry args={[1.8, 1.2, 0.12]} />
        <meshStandardMaterial color={'#061426'} metalness={0.8} roughness={0.15} />
      </mesh>
      <Html distanceFactor={8} position={[0, 0, 0.12]} center>
        <div className="glass p-3 rounded-xl w-64">
          <h4 className="font-semibold">{data.title}</h4>
          <p className="text-sm opacity-70">{data.location}</p>
        </div>
      </Html>
    </group>
  );
}
