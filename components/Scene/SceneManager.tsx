import React, { createContext, useContext, useMemo, useState } from 'react';
import { preloadGLTF } from '../../utils/three/loaders';

type SceneManagerContext = {
  ready: boolean;
  preload: (paths: string[]) => void;
};

const SceneContext = createContext<SceneManagerContext>({ ready: true, preload: () => {} });

export function useSceneManager() {
  return useContext(SceneContext);
}

export default function SceneManager({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(true);

  const preload = (paths: string[]) => {
    setReady(false);
    Promise.all(paths.map((p) => preloadGLTF(p))).finally(() => setReady(true));
  };

  const ctx = useMemo(() => ({ ready, preload }), [ready]);

  return <SceneContext.Provider value={ctx}>{children}</SceneContext.Provider>;
}
