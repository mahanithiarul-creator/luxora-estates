import type { JSX as FiberJSX } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements extends FiberJSX.IntrinsicElements {}
  }
}
