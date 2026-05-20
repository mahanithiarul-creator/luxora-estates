import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, useGLTF, Html } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from '@react-three/postprocessing';
import ProgressiveLoader from '../Scene/ProgressiveLoader';
import AdaptiveDPR from '../Scene/AdaptiveDPR';
import CameraRig from '../Scene/CameraRig';

function ModelStage({ model }: { model: string }) {
  const { scene } = useGLTF(model as any, true) as any;

  return (
    <primitive
      object={scene.clone()}
      position={[0, -1.45, 0]}
      rotation={[0, Math.PI * 0.04, 0]}
      scale={0.9}
      dispose={null}
    />
  );
}

const roomViews = {
  entrance: {
    position: [0, 1.2, 4.8],
    target: [0, -1.25, 0],
  },
  lounge: {
    position: [0.2, 1.4, 4.2],
    target: [0, -1.05, 0],
  },
  terrace: {
    position: [0.8, 1.6, 3.8],
    target: [0, -1.2, -0.4],
  },
};

export default function PropertyScene({ model = '/models/lantern.glb', room = 'entrance' }: { model?: string; room?: keyof typeof roomViews }) {
  const cameraConfig = useMemo(() => roomViews[room] || roomViews.entrance, [room]);

  return (
    <div className="rounded-[32px] overflow-hidden h-full shadow-2xl border border-white/10 bg-[#020711] transition-all duration-500">
      <Canvas camera={{ position: cameraConfig.position, fov: 30 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.35} />
        <pointLight position={[-4, 3.2, -2.2]} intensity={1.1} color="#68e0ff" />
        <spotLight position={[5, 8, 4]} angle={0.19} penumbra={0.48} intensity={1.9} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <CameraRig target={cameraConfig.target} />
        <AdaptiveDPR />
        <Suspense fallback={<ProgressiveLoader />}>
          <Environment files="/hdr/city.hdr" background={false} />
          <Html position={[0, 0.35, -1.4]} transform occlude distanceFactor={1.5} className="pointer-events-none">
            <div className="glass rounded-3xl border border-white/10 px-4 py-3 text-sm text-slate-100/85 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.26)]">
              <p className="uppercase tracking-[0.3em] text-cyan-200/70">Live preview</p>
              <p className="mt-2 text-sm opacity-75">Interactive 3D showroom with cinematic room focus.</p>
            </div>
          </Html>
          <ModelStage model={model} />
          <ContactShadows position={[0, -1.75, 0]} opacity={0.55} scale={12} blur={2.2} far={2.6} />
          <EffectComposer multisampling={4}>
            <Bloom luminanceThreshold={0.14} luminanceSmoothing={0.85} intensity={0.42} height={270} />
            <DepthOfField focusDistance={0.025} focalLength={0.03} bokehScale={1.8} />
            <Noise opacity={0.018} />
            <Vignette eskil={false} offset={0.1} darkness={0.35} />
          </EffectComposer>
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.42} rotateSpeed={0.55} />
      </Canvas>
    </div>
  );
}
