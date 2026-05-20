import * as THREE from 'three';

export function createHologramMaterial() {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#00e6ff') },
      uIntensity: { value: 1.2 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uIntensity;
      varying vec2 vUv;
      void main(){
        float lines = smoothstep(0.02,0.18,fract(vUv.y*20.0 + uTime*0.5));
        vec3 col = uColor * (0.2 + 0.8*lines) * uIntensity;
        float alpha = 0.6 * lines;
        gl_FragColor = vec4(col, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  return mat;
}
