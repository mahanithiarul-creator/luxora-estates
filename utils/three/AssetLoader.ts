import { GLTF } from 'three-stdlib';
import { useEffect, useState } from 'react';
import { createGLTFLoader } from './loaders';

const cache = new Map<string, any>();

export function useGLTFAsset(url?: string) {
  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!url) return;
    if (cache.has(url)) {
      setAsset(cache.get(url));
      return;
    }
    setLoading(true);
    const loader = createGLTFLoader();
    // load with streaming / DRACO / meshopt support when available
    loader.load(
      url,
      (gltf: GLTF) => {
        cache.set(url, gltf);
        setAsset(gltf);
        setLoading(false);
      },
      (xhr: ProgressEvent<EventTarget>) => {
        // progress handler - could surface progress
      },
      (err: any) => {
        console.error('Failed to load GLTF', url, err);
        setLoading(false);
      }
    );
  }, [url]);
  return { asset, loading };
}

export function clearAssetCache() {
  cache.clear();
}
