"use client";

import React, { useState } from "react";
import { TopoBackground } from "./TopoBackground";

export default function Socials() {
  // Estado para saber qual carta está com o mouse em cima
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Array de imagens (você pode colocar as suas depois)
  const images = [
    "./socials/setup1.png", 
    "./socials/kaique1.jpeg", 
    "./socials/kaique2.jpeg", 
    "./socials/kaique3.jpeg", 
    "./socials/setup2.png", 
  ];

  return (
    <section className="relative w-full text-[#050505] py-24 md:py-32 overflow-hidden flex flex-col items-center border-t-4 border-[#A3FF12]">
      
      {/* Fundo Topográfico Animado */}
      <TopoBackground />

      {/* Container do Leque de Imagens */}
      <div className="relative w-full h-[350px] md:h-[550px] flex items-center justify-center mb-12 mt-10 z-10 group/deck">
        
        {images.map((img, index) => {
          // 1. A MATEMÁTICA BASE (O Leque Perfeito)
          // O centro é a carta 2. Calculamos a distância de cada carta para o centro.
          const offset = index - 2; // Resulta em: -2, -1, 0, 1, 2
          
          let translateX = offset * 75; // Posicionamento horizontal em %
          let translateY = Math.abs(offset) * 5; // Posicionamento vertical em % (as bordas descem)
          let rotate = offset * 8; // Rotação em graus
          let scale = index === 2 ? 1.1 : 1; // A do centro já começa um pouco maior
          let zIndex = 30 - Math.abs(offset) * 10; // As do centro ficam na frente
          let brightness = 1;

          // 2. A LÓGICA DE INTERAÇÃO (Quando o mouse passa em cima de alguma)
          if (hoveredIndex !== null) {
            if (hoveredIndex === index) {
              // A CARTA FOCADA: Fica reta, aumenta, vai para frente e sobe
              scale = 1.15;
              translateY = -5; // Sobe um pouquinho
              rotate = 0; // Fica reta 100%
              zIndex = 50; // Joga pra frente de todas
            } else {
              // AS OUTRAS CARTAS: Escurecem e fogem para os lados
              scale = 0.95;
              brightness = 0.5; // Dá um foco dramático na carta central
              
              if (index < hoveredIndex) {
                // Se está à esquerda da focada, empurra mais para a esquerda e tomba
                translateX -= 20;
                rotate -= 4;
              } else {
                // Se está à direita da focada, empurra mais para a direita e tomba
                translateX += 20;
                rotate += 4;
              }
            }
          }

          return (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="absolute w-[40vw] md:w-[22vw] max-w-[320px] aspect-2/3 rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer"
              style={{
                transform: `translateX(${translateX}%) translateY(${translateY}%) rotate(${rotate}deg) scale(${scale})`,
                zIndex: zIndex,
                filter: `brightness(${brightness})`,
              }}
            >
              {/* pointer-events-none na imagem garante que o hover não falhe ao passar o mouse rápido */}
              <img src={img} alt={`Social ${index}`} className="w-full h-full object-cover pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* Textos e Links no estilo Editorial */}
      <div className="relative flex flex-col items-center text-center mt-6 z-10">
        <h3 className="text-2xl md:text-5xl font-serif font-bold tracking-wide mb-10 text-gray-900">
          Acompanhe Kaique nas Redes
        </h3>

        <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-xs md:text-sm font-bold uppercase tracking-[0.15em] md:tracking-[0.25em]">
          <a href="https://github.com/kaiquemends" target="_blank" rel="noreferrer" className="hover:text-[#A3FF12] hover:scale-110 transition-all duration-300">Github</a>
          <a href="https://www.linkedin.com/in/kaique-mendes-71746523a/" target="_blank" rel="noreferrer" className="hover:text-[#A3FF12] hover:scale-110 transition-all duration-300">LinkedIn</a>
          <a href="https://instagram.com/k.cmendes" target="_blank" rel="noreferrer" className="hover:text-[#A3FF12] hover:scale-110 transition-all duration-300">Instagram</a>
        </div>
      </div>
    </section>
  );
}