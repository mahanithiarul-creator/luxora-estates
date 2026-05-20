import React from 'react';
import { EffectComposer, Bloom, DepthOfField, Vignette, Noise, SSAO } from '@react-three/postprocessing';

export default function PostProcessingPipeline({ children }: { children?: React.ReactNode }) {
  return (
    <EffectComposer multisampling={4}>
      <SSAO 
        radius={0.9}
        intensity={0.25}
        luminanceInfluence={0.15}
        color="#000000"
      />
      <Bloom luminanceThreshold={0.14} luminanceSmoothing={0.88} intensity={0.54} height={280} />
      <DepthOfField focusDistance={0.021} focalLength={0.028} bokehScale={1.8} />
      <Noise opacity={0.014} />
      <Vignette eskil={false} offset={0.1} darkness={0.44} />
      {children}
    </EffectComposer>
  );
}
