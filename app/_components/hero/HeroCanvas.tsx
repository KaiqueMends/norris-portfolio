"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, useGLTF } from "@react-three/drei"; 
import * as THREE from "three";

type PointerNdc = { x: number; y: number };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function Scene({ pointer }: { pointer: React.MutableRefObject<PointerNdc> }) {
  const group = useRef<THREE.Group>(null);
  
  // Carrega o modelo 3D da pasta public do Next.js usando o useGLTF
  const { scene } = useGLTF("/need_some_space.glb");

  useFrame((state) => {
    const m = group.current;
    if (!m) return;

    const t = state.clock.getElapsedTime();
    const px = pointer.current.x;
    const py = pointer.current.y;

    const targetX = px * 0.15;
    const targetY = py * 0.35 - 2;

    m.position.x = lerp(m.position.x, targetX, 0.06);
    m.position.y = lerp(m.position.y, targetY, 0.06);

    m.rotation.y = lerp(m.rotation.y, px * 0.65 + t * 0.25, 0.05);
    m.rotation.x = lerp(m.rotation.x, -py * 0.45 + Math.sin(t * 0.7) * 0.08, 0.05);

    // Exemplo para diminuir pela metade: const s = 0.5 + Math.sin...
    const s = 1.5 + Math.sin(t * 1.2) * 0.02;
    m.scale.setScalar(lerp(m.scale.x, s, 0.06));

    const light = state.scene.getObjectByName("keyLight") as THREE.DirectionalLight | null;
    if (light) {
      light.position.x = lerp(light.position.x, 2 + px * 1.8, 0.06);
      light.position.y = lerp(light.position.y, 2 + py * 1.2, 0.06);
    }
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight
        name="keyLight"
        position={[2.2, 2.1, 2.8]}
        intensity={2.2}
        color={"#ffffff"}
      />
      <pointLight position={[-3.2, -1.2, -2]} intensity={0.8} color={"#ff6e30"} />

      <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.25}>
        <group ref={group} position={[1.5, 0, 0]}>
          <primitive object={scene} />
        </group>
      </Float>
    </>
  );
}

// Pré-carrega o modelo para evitar telas em branco enquanto ele baixa
useGLTF.preload("/need_some_space.glb");

export function HeroCanvas() {
  const pointer = useRef<PointerNdc>({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      pointer.current.x = nx;
      pointer.current.y = ny;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <fog attach="fog" args={["#050505", 6, 14]} />
        <Scene pointer={pointer} />
      </Canvas>
    </div>
  );
}