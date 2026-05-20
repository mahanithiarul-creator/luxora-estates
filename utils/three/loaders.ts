import { DRACOLoader } from 'three-stdlib';
import { GLTFLoader } from 'three-stdlib';
import { KTX2Loader } from 'three-stdlib';
import { MeshoptDecoder } from 'three-stdlib';
import { useMemo } from 'react';
import * as THREE from 'three';

// Helper to configure and return a GLTFLoader with DRACO and KTX2 support
export function createGLTFLoader(renderer?: THREE.WebGLRenderer) {
  const loader = new GLTFLoader();

  // DRACO
  try {
    const draco = new DRACOLoader();
    // Place draco decoder in public/draco/
    draco.setDecoderPath('/draco/');
    loader.setDRACOLoader(draco as any);
  } catch (e) {
    // DRACO optional
    // console.warn('DRACO not available', e);
  }

  // KTX2 / Basis for texture compression
  try {
    if (renderer) {
      const ktx2Loader = new KTX2Loader().setTranscoderPath('/basis/');
      ktx2Loader.detectSupport(renderer);
      loader.setKTX2Loader(ktx2Loader as any);
    }
  } catch (e) {
    // optional
  }

  // Meshopt decoder (optional but recommended)
  try {
    (MeshoptDecoder as any).ready.then(() => {
      (GLTFLoader as any).setMeshoptDecoder(MeshoptDecoder);
    }).catch(() => {});
  } catch (e) {}

  return loader;
}

// Preload GLTF assets via three's internal cache
export function preloadGLTF(url: string, renderer?: THREE.WebGLRenderer) {
  const loader = createGLTFLoader(renderer);
  loader.load(
    url,
    () => {},
    () => {},
    (error) => {
      console.warn('Failed to preload GLTF', url, error);
    }
  );
}
