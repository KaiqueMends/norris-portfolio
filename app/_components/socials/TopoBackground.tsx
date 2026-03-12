"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

class TopoMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uResolution: { value: new THREE.Vector2(0, 0) },
        uBackgroundColor: { value: new THREE.Color("#F5F5F0") },
        uLineColor: { value: new THREE.Color("#C3C5B8") },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uResolution;
        uniform vec3 uBackgroundColor;
        uniform vec3 uLineColor;

        // --- FUNÇÃO DE RUÍDO (Simplex Noise 3D) ---
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

        float snoise(vec3 v){
          const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
          const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy) );
          vec3 x0 = v - i + dot(i, C.xxx) ;
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min( g.xyz, l.zxy );
          vec3 i2 = max( g.xyz, l.zxy );
          vec3 x1 = x0 - i1 + 1.0 * C.xxx;
          vec3 x2 = x0 - i2 + 2.0 * C.xxx;
          vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
          i = mod(i, 289.0 );
          vec4 p = permute( permute( permute(
                     i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                   + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                   + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
          float n_ = 1.0/7.0;
          vec3  ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_ );
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4( x.xy, y.xy );
          vec4 b1 = vec4( x.zw, y.zw );
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
          vec3 p0 = vec3(a0.xy,h.x);
          vec3 p1 = vec3(a0.zw,h.y);
          vec3 p2 = vec3(a1.xy,h.z);
          vec3 p3 = vec3(a1.zw,h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
        }
        // --- FIM DA FUNÇÃO ---

        void main() {
          vec2 st = (vUv * 2.0 - 1.0) * (uResolution.xy / min(uResolution.x, uResolution.y));
          vec2 m = (uMouse * 2.0 - 1.0) * (uResolution.xy / min(uResolution.x, uResolution.y));

          // AJUSTES DE CLEAN DESIGN AQUI
          float scale = 0.8; // Escala do ruído reduzida (ondas mais largas)
          float time = uTime * 0.04; // Animação mais lenta e suave

          float h = snoise(vec3(st * scale, time));

          float mouseForce = 0.15; // Interação do mouse mais sutil
          float mouseRadius = 0.6;
          float dist = length(st - m);
          float d = smoothstep(mouseRadius, 0.0, dist);
          h += snoise(vec3((st + m * mouseForce) * scale * 1.5, time * 1.2)) * d * 0.4;
          
          // Quantidade de linhas drasticamente reduzida
          float linesFrequency = 4.0; 
          float h_fract = fract(h * linesFrequency);
          
          // Linha sutilmente mais espessa para não sumir
          float lineWidth = 0.02;
          float lw = 0.5 * lineWidth * linesFrequency;

          float lines = smoothstep(0.5 - lw, 0.5, h_fract) - smoothstep(0.5, 0.5 + lw, h_fract);
          lines = 1.0 - lines;

          vec3 finalColor = mix(uLineColor, uBackgroundColor, lines);

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      wireframe: false,
    });
  }
}

function TopoMesh() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const material = useMemo(() => new TopoMaterial(), []);
  
  // Pegamos as dimensões exatas do viewport da câmera para o aspecto ficar perfeito
  const { viewport } = useThree();

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.getElapsedTime();
    material.uniforms.uResolution.value.set(state.size.width, state.size.height);
    
    material.uniforms.uMouse.value.set(
      (state.mouse.x + 1) / 2,
      (state.mouse.y + 1) / 2
    );
  });

  return (
    // Escalamos o mesh para ocupar 100% da largura e altura da câmera
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]} position={[0, 0, 0]} material={material}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

export function TopoBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.5]} 
        gl={{ antialias: true }}
      >
        <TopoMesh />
      </Canvas>
    </div>
  );
}