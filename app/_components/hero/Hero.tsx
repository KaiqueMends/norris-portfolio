"use client";

import { motion } from "framer-motion";
import { HeroCanvas } from "./HeroCanvas";

export function Hero() {
  return (
    <section className="relative min-h-dvh overflow-hidden sticky top-0 h-screen z-0">
      <div className="pointer-events-none absolute inset-0">
        <HeroCanvas />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(1100px_600px_at_70%_40%,rgba(163,255,18,0.10),transparent_60%),radial-gradient(900px_500px_at_30%_70%,rgba(255,110,48,0.10),transparent_62%)]" />
      <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:64px_64px]" />

      <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col justify-center px-6 pb-16 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex w-fit items-center gap-3 rounded-full bg-white/5 px-4 py-2 ring-1 ring-white/10 backdrop-blur"
          style={{
            clipPath:
              "polygon(0% 0%, 94% 0%, 100% 50%, 94% 100%, 0% 100%, 2.5% 50%)",
          }}
        >
          <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_18px_rgba(163,255,18,0.85)]" />
          <p className="font-display text-[11px] tracking-[0.28em] text-neutral-200/90">
            HIGH PERFORMANCE DEVELOPER
          </p>
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
          }}
          className="mt-6 font-display text-[clamp(3.2rem,6.4vw,6.8rem)] leading-[0.86] tracking-[-0.04em]"
        >
          {["KAIQUE", "COSTA", "MENDES"].map((word) => (
            <motion.span
              key={word}
              className="block"
              variants={{
                hidden: { opacity: 0, y: 22, filter: "blur(10px)" },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              {word === "MENDES" ? (
                <>
                  <span className="text-neutral-100"
                  style={{
                    color: "#fff", // Cor da letra branca para o centro do brilho
                    textShadow: `
                      0 0 7px #ffffff,          /* Brilho interno branco */
                      0 0 10px #A3FF12,      /* Primeira camada de cor (o seu verde neon) */
                      0 0 21px #A3FF12,      /* Segunda camada (aura média) */
                      0 0 34px #A3FF12,      /* Terceira camada (aura grande) */
                      0 0 40px #A3FF12       /* Quarta camada (dissipação de luz) */
                    `,

                  }}>MENDES</span>

                </>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 max-w-xl text-base leading-relaxed text-neutral-200/80 md:text-lg"
        >
          Olá! Sou desenvolvedor de sistemas com formação técnica e atualmente graduando em Engenharia de Software. Unindo a base sólida da academia com a experiência prática em projetos reais, foco em entregar soluções web modernas, escaláveis e centradas na experiência do usuário.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a
            href="#work"
            onClick={(e) => {
              e.preventDefault(); // Impede o pulo seco padrão
              document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
            }}
            data-cursor="link"
            className="group relative inline-flex items-center gap-3 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-neutral-100 ring-1 ring-white/10 backdrop-blur transition hover:bg-white/15"
          >
            Ver projetos
            <span className="relative grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
              <span className="absolute inset-0 translate-x-[-120%] bg-accent/70 transition-transform duration-300 ease-out group-hover:translate-x-0" />
              <span className="relative text-neutral-100 group-hover:text-neutral-950">
                →
              </span>
            </span>
          </a>
          <a
            href="#footer"
            onClick={(e) => {
              e.preventDefault(); // Impede o pulo seco padrão
              document.querySelector('#footer')?.scrollIntoView({ behavior: 'smooth' });
            }}
            data-cursor="link"
            className="group relative inline-flex items-center gap-3 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-neutral-100 ring-1 ring-white/10 backdrop-blur transition hover:bg-white/15"
            style={{
              clipPath:
                "polygon(0% 0%, 92% 0%, 100% 50%, 92% 100%, 0% 100%, 3% 50%)",
            }}
          >
            Contato
          </a>
        </motion.div>

        <div className="pointer-events-none mt-14 flex items-center gap-3 text-xs tracking-[0.22em] text-neutral-400/80">
          <span className="h-[1px] w-10 bg-white/15" />
          SCROLL
        </div>
      </div>
    </section>
  );
}

