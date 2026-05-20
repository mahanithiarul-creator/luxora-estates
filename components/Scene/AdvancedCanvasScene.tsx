import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Html, Float, Sparkles, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import AdaptiveDPR from './AdaptiveDPR';
import CameraRig from './CameraRig';
import LightingRig from './LightingRig';
import LODModel from './LODModel';
import ParticlesDense from './ParticlesDense';
import PostProcessingPipeline from './PostProcessingPipeline';
import ProgressiveLoader from './ProgressiveLoader';
import VolumetricFog from './VolumetricFog';
import { preloadGLTF } from '../../utils/three/loaders';

function AmbientAccent({ path, position, rotation, scale }: { path: string; position: [number, number, number]; rotation: [number, number, number]; scale: number }) {
  const { scene } = useGLTF(path) as any;

  return (
    <Float speed={0.9} rotationIntensity={0.6} floatIntensity={0.55}>
      <primitive object={scene.clone()} position={position} rotation={rotation} scale={scale} />
    </Float>
  );
}

function SceneRotator({ group }: { group: React.MutableRefObject<THREE.Group | null> }) {
  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.032;
    }
  });
  return null;
}

export default function AdvancedCanvasScene() {
  const sceneGroup = useRef<THREE.Group | null>(null);

  useEffect(() => {
    fetch('/asset-manifest.json')
      .then((r) => r.json())
      .then((m) => {
        const paths = m.assets.filter((a: any) => a.type === 'gltf').map((a: any) => a.path);
        paths.forEach((p: string) => preloadGLTF(p));
      })
      .catch(() => {
        preloadGLTF('/models/box_textured.glb');
        preloadGLTF('/models/lantern.glb');
        preloadGLTF('/models/avocado.glb');
      });
  }, []);

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 2.6, 6.2], fov: 32 }} shadows dpr={[1, 1.4]}>
        <ambientLight intensity={0.28} />
        <pointLight position={[-4.5, 3.8, -2.4]} intensity={0.95} color="#6ee7ff" />
        <spotLight position={[4.2, 7.3, 4.8]} angle={0.22} penumbra={0.45} intensity={1.4} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <LightingRig intensity={1.5} />

        <Suspense fallback={<ProgressiveLoader />}>
          <Environment files="/hdr/city.hdr" background={false} />
          <VolumetricFog density={0.048} color="#041924" />
          <ParticlesDense count={220} />
          <ContactShadows position={[0, -1.77, 0]} opacity={0.58} scale={17} blur={2.6} far={2.4} />

          <group ref={sceneGroup} position={[0, -1.75, 0]}>
            <LODModel urls={['/models/box_textured.glb']} scale={1.34} />
          </group>
          <SceneRotator group={sceneGroup} />

          <AmbientAccent path="/models/lantern.glb" position={[2.1, -1.2, -0.95]} rotation={[0, -1.1, 0]} scale={0.68} />
          <AmbientAccent path="/models/avocado.glb" position={[-1.85, -1.22, -0.55]} rotation={[0, 1.9, 0]} scale={0.92} />

          <Sparkles count={132} scale={20} size={0.42} color={'#4de2ff'} />

          <Html position={[0.1, 0.4, -1.95]} transform occlude distanceFactor={1.65} className="pointer-events-none">
            <div className="glass rounded-[30px] border border-white/10 p-5 backdrop-blur-3xl shadow-[0_28px_80px_rgba(0,0,0,0.32)]" style={{ minWidth: 320 }}>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Elevated architecture</p>
              <h3 className="mt-3 text-2xl font-semibold neon">The ultimate luxury stage</h3>
              <p className="mt-3 text-sm leading-6 opacity-75">A premium environment layered with light, reflections, and motion for an unforgettable launch impression.</p>
            </div>
          </Html>

          <PostProcessingPipeline />
          <AdaptiveDPR />
          <CameraRig target={[0, -1.4, 0]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
