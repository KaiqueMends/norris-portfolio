"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function AnimatedWave() {
  const containerRef = useRef<HTMLDivElement>(null);
  // 1. Criamos uma referência direta para o SVG (Melhor prática no React)
  const waveRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Verificação de segurança
      if (!containerRef.current || !waveRef.current) return;

      gsap.fromTo(
        waveRef.current, // Usamos a ref diretamente aqui
        { 
          xPercent: 0, // gsap prefere xPercent para lidar com %
          scaleY: 1 
        },
        {
          xPercent: -35, // Desliza 35% do próprio tamanho para a esquerda
          scaleY: 3.5, // Cresce 3.5x
          transformOrigin: "bottom center",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom", // Começa quando o topo da div toca o fundo da tela
            end: "top 20%", // Termina quando a onda chega perto do topo da tela
            scrub: 1, // Suavidade do delay (1 segundo)
          },
        }
      );
    }, containerRef);

    return () => ctx.revert(); 
  }, []);

  return (
    <div 
      ref={containerRef} 
      // 2. REMOVIDO o overflow-hidden para permitir que a onda cresça para fora da div
      className="absolute top-0 left-0 w-full overflow-x-clip leading-none -translate-y-[99%] pointer-events-none"
    >
      <svg
        ref={waveRef} // Passamos a ref para o SVG
        className="relative block w-[250%] h-[60px] md:h-[140px]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z"
          fill="#050505"
        />
      </svg>
      
      {/* O Fade */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#050505] opacity-50 mix-blend-multiply"></div>
    </div>
  );
} 