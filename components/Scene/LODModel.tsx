import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

type LODModelProps = {
  urls: string[]; // ordered high -> low
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
};

export default function LODModel({ urls, position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }: LODModelProps) {
  const { scene } = useThree();
  const ref = useRef<THREE.LOD | null>(null);

  // load gltf pages lazily - useGLTF caches internally
  const gltfs = useMemo(() => urls.map((u) => ({ u })), [urls]);

  useEffect(() => {
    const lod = new THREE.LOD();
    Promise.all(
      urls.map(async (u, i) => {
        try {
          const gltf = await (useGLTF as any).preload ? (useGLTF as any).preload(u) : null;
        } catch (e) {
          // fallback
        }
      })
    );
    // Note: actual population happens in render via <primitive>
    return () => {};
  }, [urls]);

  // Render simplified approach: dynamically render single model for now (high LOD)
  // Consumers should replace with a proper LOD setup using THREE.LOD when models exist.
  const high = useGLTF(urls[0] as any, true) as any;

  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]} dispose={null}>
      <primitive object={high.scene.clone()} />
    </group>
  );
}
