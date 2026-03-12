"use client";

import React from "react";

export function Footer() {
  return (
    <footer id="footer" className="w-full bg-[#050505] text-white pt-32 pb-8 px-6 md:px-12 flex flex-col justify-between min-h-[80vh] relative overflow-hidden border-t border-white/10">
      
      {/* Seção Superior do Footer: Textos e Redes Sociais */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-b border-white/10 pb-12 z-10">
        <div className="max-w-xl">
          <h2 className="text-xl md:text-2xl font-light uppercase tracking-[0.2em] text-gray-400 mb-4">
            Tem um projeto em mente?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed">
            Estou sempre aberto a novas oportunidades para criar sistemas e experiências digitais de alta performance. Vamos transformar sua ideia em realidade.
          </p>
        </div>
        
        {/* Links de Redes Sociais */}
        <div className="flex flex-col gap-4 text-right">
          <span className="text-sm uppercase tracking-widest text-gray-500 mb-2">Socials</span>
          <a href="https://github.com/kaiquemends" target="_blank" rel="noreferrer" className="text-2xl md:text-4xl font-bold uppercase hover:text-[#A3FF12] hover:translate-x-[-10px] transition-all duration-300">
            GitHub
          </a>
          <a href="https://linkedin.com/in/kaique-mendes-71746523a/" target="_blank" rel="noreferrer" className="text-2xl md:text-4xl font-bold uppercase hover:text-[#A3FF12] hover:translate-x-[-10px] transition-all duration-300">
            LinkedIn
          </a>
          <a href="https://instagram.com/k.cmendes" target="_blank" rel="noreferrer" className="text-2xl md:text-4xl font-bold uppercase hover:text-[#A3FF12] hover:translate-x-[-10px] transition-all duration-300">
            Instagram
          </a>
        </div>
      </div>

      {/* Seção Central: Texto Massivo de Contato */}
      <div className="mt-20 mb-10 group cursor-pointer z-10 flex justify-center">
        <a href="mailto:kaique.mendesdev@gmail.com" className="flex flex-col items-center justify-center">
          <span className="text-gray-500 text-sm md:text-lg mb-2 uppercase tracking-[0.3em] group-hover:text-[#A3FF12] transition-colors duration-700 ease-out">
            Mande um e-mail
          </span>
          
          <span className="text-[15vw] font-black leading-none tracking-tighter inline-block origin-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-gradient-to-r from-[#A3FF12] to-[#050505] bg-clip-text text-white group-hover:text-transparent group-hover:-skew-x-6 group-hover:scale-[1.02]">
            LET'S TALK
          </span>
        </a>
      </div>

      {/* Copyright e Branding */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center text-xs md:text-sm text-gray-600 uppercase tracking-widest z-10 mt-10">
        <span>© {new Date().getFullYear()} KAIQUE. TODOS OS DIREITOS RESERVADOS.</span>
        <span className="mt-4 md:mt-0">Desenvolvido com Next.js & Tailwind</span>
      </div>

      {/* Efeito de Brilho no fundo (Opcional, dá um ar de WebGL) */}
      <div className="absolute bottom-[-20%] left-1/2 transform -translate-x-1/2 w-[80vw] h-[50vh] bg-[#A3FF12] opacity-[0.03] blur-[120px] rounded-full pointer-events-none"></div>
    </footer>
  );
}