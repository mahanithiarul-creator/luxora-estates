import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

export default function VolumetricFog({ density = 0.04, color = '#071426' }: { density?: number; color?: string }) {
  const { scene } = useThree();
  useMemo(() => {
    scene.fog = new THREE.FogExp2(color, density);
    return () => {
      scene.fog = null as any;
    };
  }, [scene, density, color]);
  return null;
}
