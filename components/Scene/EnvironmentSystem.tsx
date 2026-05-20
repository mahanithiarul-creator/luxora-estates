import React from 'react';
import { Environment } from '@react-three/drei';

export default function EnvironmentSystem({ hdri = '/hdr/city.hdr', background = false }: { hdri?: string; background?: boolean }) {
  return <Environment files={hdri} background={background} />;
}
