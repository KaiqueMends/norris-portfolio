"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

function splitGraphemes(text: string) {
  return Array.from(text);
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(!!mql?.matches);
    update();
    mql?.addEventListener?.("change", update);
    return () => mql?.removeEventListener?.("change", update);
  }, []);

  return reduced;
}

export function AnimatedTitle({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const letters = useMemo(() => splitGraphemes(text), [text]);
  const spans = useRef<Array<HTMLSpanElement | null>>([]);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    spans.current = spans.current.slice(0, letters.length);
  }, [letters.length]);

  const playIn = () => {
    if (reducedMotion) return;
    tl.current?.kill();
    const targets = spans.current.filter(Boolean) as HTMLSpanElement[];
    tl.current = gsap
      .timeline({ defaults: { ease: "power3.out" } })
      .to(
        targets,
        {
          y: (i: number) => (i % 2 === 0 ? -8 : -4),
          rotation: (i: number) => (i % 2 === 0 ? -1.5 : 1.5),
          stagger: 0.015,
          duration: 0.28,
        },
        0,
      )
      .to(
        targets,
        {
          y: 0,
          rotation: 0,
          stagger: 0.012,
          duration: 0.42,
          ease: "elastic.out(1, 0.6)",
        },
        0.06,
      );
  };

  const reset = () => {
    if (reducedMotion) return;
    tl.current?.kill();
    const targets = spans.current.filter(Boolean) as HTMLSpanElement[];
    gsap.to(targets, { y: 0, rotation: 0, duration: 0.25, ease: "power2.out" });
  };

  return (
    <span
      className={className}
      onPointerEnter={reducedMotion ? undefined : playIn}
      onPointerLeave={reducedMotion ? undefined : reset}
    >
      {letters.map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          ref={(el) => {
            spans.current[i] = el;
          }}
          className="inline-block will-change-transform"
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

