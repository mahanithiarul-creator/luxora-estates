import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Float, Html, MeshReflectorMaterial, OrbitControls, Sparkles, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import ProgressiveLoader from '../Scene/ProgressiveLoader';
import AdaptiveDPR from '../Scene/AdaptiveDPR';
import CameraRig from '../Scene/CameraRig';

type RoomKey = 'entrance' | 'lounge' | 'terrace';

const roomViews: Record<RoomKey, { position: [number, number, number]; target: [number, number, number]; label: string }> = {
  entrance: {
    position: [0, 1.35, 5.2],
    target: [0, -1.18, 0],
    label: 'arrival sequence',
  },
  lounge: {
    position: [0.35, 1.45, 4.55],
    target: [0, -1.02, -0.08],
    label: 'residence lounge',
  },
  terrace: {
    position: [0.95, 1.66, 4.05],
    target: [0.08, -1.16, -0.5],
    label: 'sky terrace',
  },
};

class SceneErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('PropertyScene rendering fallback after WebGL/asset failure.', error);
  }

  render() {
    if (this.state.hasError) {
      return <LuxurySceneFallback label="static preview" />;
    }

    return this.props.children;
  }
}

function useWebGLAvailable() {
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setAvailable(Boolean(gl));
    } catch {
      setAvailable(false);
    }
  }, []);

  return available;
}

function LuxurySceneFallback({ label }: { label: string }) {
  return (
    <div className="relative flex h-full min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#04070d] shadow-cinematic">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(79,209,255,0.22),transparent_34%),radial-gradient(circle_at_75%_15%,rgba(216,183,106,0.16),transparent_28%),linear-gradient(145deg,#05070d,#0b101b_58%,#02030a)]" />
      <div className="cinematic-grain absolute inset-0 opacity-[0.16]" />
      <div className="absolute inset-x-10 bottom-0 h-52 bg-[linear-gradient(to_top,rgba(93,213,255,0.18),transparent)] blur-2xl" />
      <div className="relative z-10 m-auto max-w-sm px-8 text-center">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-cyan-100/70">{label}</p>
        <h3 className="mt-4 text-3xl font-semibold tracking-normal text-white">Cinematic residence preview</h3>
        <p className="mt-4 text-sm leading-6 text-slate-200/68">A stable luxury fallback is shown while immersive rendering is unavailable on this device.</p>
      </div>
    </div>
  );
}

function ModelStage({ model }: { model: string }) {
  const group = useRef<THREE.Group | null>(null);
  const { scene } = useGLTF(model as any, true) as any;
  const clone = useMemo(() => scene.clone(true), [scene]);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.06;
    group.current.position.y = -1.42 + Math.sin(clock.elapsedTime * 0.55) * 0.025;
  });

  return (
    <Float speed={0.72} rotationIntensity={0.12} floatIntensity={0.18}>
      <group ref={group}>
        <primitive object={clone} position={[0, 0, 0]} rotation={[0, Math.PI * 0.035, 0]} scale={0.92} dispose={null} />
      </group>
    </Float>
  );
}

function ReflectiveStage() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.72, 0]} receiveShadow>
      <planeGeometry args={[14, 14]} />
      <MeshReflectorMaterial
        blur={[420, 120]}
        resolution={768}
        mixBlur={1}
        mixStrength={0.62}
        roughness={0.58}
        depthScale={0.72}
        minDepthThreshold={0.35}
        maxDepthThreshold={1.2}
        color="#050913"
        metalness={0.28}
      />
    </mesh>
  );
}

function VolumetricVeil() {
  return (
    <group>
      <mesh position={[-1.8, 0.4, -2.6]}>
        <sphereGeometry args={[1.6, 24, 24]} />
        <meshBasicMaterial color="#2acfff" transparent opacity={0.025} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[2.4, 0.75, -1.8]}>
        <sphereGeometry args={[1.2, 24, 24]} />
        <meshBasicMaterial color="#d8b76a" transparent opacity={0.022} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function SceneHud({ label }: { label: string }) {
  return (
    <Html position={[0, 0.58, -1.65]} transform occlude distanceFactor={1.65} className="pointer-events-none">
      <div className="glass-luxury w-[18rem] rounded-[1.5rem] p-4 shadow-cinematic">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-cyan-100/68">{label}</p>
        <p className="mt-3 text-sm leading-6 text-slate-100/72">Live 3D showcase with cinematic lighting, reflections, and guided focus.</p>
      </div>
    </Html>
  );
}

function CinematicCanvas({ model, room }: { model: string; room: RoomKey }) {
  const cameraConfig = roomViews[room] || roomViews.entrance;

  return (
    <Canvas
      camera={{ position: cameraConfig.position, fov: 30 }}
      dpr={[0.75, 1.45]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', failIfMajorPerformanceCaveat: false }}
      shadows
      onCreated={({ gl }) => {
        gl.setClearColor('#02040a', 0);
      }}
    >
      <color attach="background" args={['#02040a']} />
      <fog attach="fog" args={['#06101a', 4.2, 10.5]} />
      <ambientLight intensity={0.24} />
      <hemisphereLight args={['#8eeaff', '#070711', 0.55]} />
      <pointLight position={[-4.5, 2.8, -2.6]} intensity={1.4} color="#59d7ff" />
      <pointLight position={[3.8, 2.2, 2.8]} intensity={0.55} color="#d8b76a" />
      <spotLight position={[4.8, 7.2, 4.5]} angle={0.2} penumbra={0.62} intensity={2.2} color="#fff7e4" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <CameraRig target={cameraConfig.target} mouseFactor={0.55} />
      <AdaptiveDPR min={0.65} max={1.45} />
      <Suspense fallback={<ProgressiveLoader />}>
        <Environment files="/hdr/city.hdr" background={false} />
        <VolumetricVeil />
        <Sparkles count={72} scale={[7, 3.5, 7]} size={0.34} speed={0.24} color="#9fefff" opacity={0.34} />
        <SceneHud label={cameraConfig.label} />
        <ModelStage model={model} />
        <ReflectiveStage />
        <ContactShadows position={[0, -1.7, 0]} opacity={0.48} scale={12} blur={2.8} far={2.8} />
        <EffectComposer multisampling={0}>
          <Bloom luminanceThreshold={0.15} luminanceSmoothing={0.82} intensity={0.72} height={240} />
          <DepthOfField focusDistance={0.035} focalLength={0.028} bokehScale={1.65} />
          <Noise opacity={0.012} />
          <Vignette eskil={false} offset={0.18} darkness={0.52} />
        </EffectComposer>
      </Suspense>
      <OrbitControls enablePan={false} enableZoom={false} enableDamping dampingFactor={0.08} autoRotate autoRotateSpeed={0.22} rotateSpeed={0.42} maxPolarAngle={Math.PI * 0.56} minPolarAngle={Math.PI * 0.34} />
    </Canvas>
  );
}

export default function PropertyScene({ model = '/models/lantern.glb', room = 'entrance' }: { model?: string; room?: RoomKey }) {
  const webGLAvailable = useWebGLAvailable();
  const activeRoom = roomViews[room] ? room : 'entrance';

  if (!webGLAvailable) {
    return <LuxurySceneFallback label="device optimized preview" />;
  }

  return (
    <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#02040a] shadow-cinematic">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(85,214,255,0.18),transparent_34%),radial-gradient(circle_at_78%_18%,rgba(216,183,106,0.1),transparent_30%)]" />
      <SceneErrorBoundary>
        <CinematicCanvas model={model} room={activeRoom} />
      </SceneErrorBoundary>
    </div>
  );
}
