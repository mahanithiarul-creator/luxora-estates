import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

type Props = {
  mouseFactor?: number;
  target?: [number, number, number];
};

export default function CameraRig({ mouseFactor = 0.8, target = [0, 0, 0] }: Props) {
  const { camera } = useThree();
  const v = useRef(new THREE.Vector3());
  useFrame((state, delta) => {
    const t = 1 - Math.pow(0.01, delta);
    const mx = (state.mouse.x * mouseFactor) / 2;
    const my = (state.mouse.y * mouseFactor) / 2;
    v.current.lerp(new THREE.Vector3(mx, my * -0.6, 0), t);
    camera.position.x += (v.current.x - camera.position.x) * 0.06;
    camera.position.y += (v.current.y - camera.position.y) * 0.06;
    camera.lookAt(target[0], target[1], target[2]);
  });
  return null;
}
