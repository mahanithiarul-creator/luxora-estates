import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';

// Placeholder 3D scene with cinematic lighting. Replace models with GLTF/GLB assets.
export default function CanvasScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <group position={[0, -1, 0]}>
            {/* Rotating skyscraper placeholder */}
            <mesh position={[0, 0.6, 0]} rotation={[0, 0.2, 0]}>
              <boxGeometry args={[1.4, 3.6, 1.4]} />
              <meshStandardMaterial metalness={0.9} roughness={0.1} color={'#091423'} envMapIntensity={1} />
            </mesh>
          </group>
          <Environment preset="city" />
          <ContactShadows position={[0, -1.4, 0]} opacity={0.8} scale={10} blur={2} />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.2} />
      </Canvas>
    </div>
  );
}
