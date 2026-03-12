"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

const INTERACTIVE_SELECTOR =
  "a,button,[role='button'],[data-cursor='link'],[data-cursor='button']";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(!!mql.matches);
    onChange();
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}

function useIsCoarsePointer() {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(pointer: coarse)");
    const onChange = () => setCoarse(!!mql.matches);
    onChange();
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  return coarse;
}

export function ClientChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();
  const coarsePointer = useIsCoarsePointer();
  const cursorEnabled = !coarsePointer;

  const x = useMotionValue(-999);
  const y = useMotionValue(-999);

  const xSpring = useSpring(x, { stiffness: 600, damping: 45, mass: 0.6 });
  const ySpring = useSpring(y, { stiffness: 600, damping: 45, mass: 0.6 });

  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);

  const lensSize = useMemo(() => {
    if (isPointerDown) return 92;
    if (isHoveringInteractive) return 84;
    return 56;
  }, [isHoveringInteractive, isPointerDown]);

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      syncTouch: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!cursorEnabled) return;

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const onDown = () => setIsPointerDown(true);
    const onUp = () => setIsPointerDown(false);

    const onOver = (e: Event) => {
      const target = e.target as HTMLElement | null;
      const hit = target?.closest?.(INTERACTIVE_SELECTOR);
      setIsHoveringInteractive(!!hit);
    };

    const onOut = (e: Event) => {
      const target = e.target as HTMLElement | null;
      const hit = target?.closest?.(INTERACTIVE_SELECTOR);
      if (hit) setIsHoveringInteractive(false);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [cursorEnabled, x, y]);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {cursorEnabled && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
          style={{
            translateX: xSpring,
            translateY: ySpring,
            x: "-50%",
            y: "-50%",
          }}
        >
          <motion.div
            className={[
              "grid place-items-center rounded-full",
              "bg-white/90",
              "ring-1 ring-white/40",
            ].join(" ")}
            animate={{
              width: lensSize,
              height: lensSize,
            }}
            transition={{
              type: "spring",
              stiffness: 700,
              damping: 45,
              mass: 0.5,
            }}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-neutral-950/90" />
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

