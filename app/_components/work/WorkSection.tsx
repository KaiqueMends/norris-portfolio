"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { AnimatedTitle } from "./AnimatedTitle";
import { WORK } from "./workData";

type Pt = { x: number; y: number };

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function WorkSection() {
  const [hoverSlug, setHoverSlug] = useState<string | null>(null);
  const [focusSlug, setFocusSlug] = useState<string | null>(null);
  const [scrollSlug, setScrollSlug] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  const rootRef = useRef<HTMLElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const previewCardRef = useRef<HTMLDivElement | null>(null);
  const previewImgARef = useRef<HTMLImageElement | null>(null);
  const previewImgBRef = useRef<HTMLImageElement | null>(null);

  const featuredImgARef = useRef<HTMLImageElement | null>(null);
  const featuredImgBRef = useRef<HTMLImageElement | null>(null);

  const pointer = useRef<Pt>({ x: -9999, y: -9999 });
  const last = useRef<Pt>({ x: 0, y: 0 });
  const lastT = useRef<number>(0);
  const previewSize = useRef<{ w: number; h: number }>({ w: 320, h: 240 });
  const topLayer = useRef<"A" | "B">("A");
  const featuredTopLayer = useRef<"A" | "B">("A");

  const [srcA, setSrcA] = useState(WORK[0]?.previewSrc ?? "");
  const [srcB, setSrcB] = useState(WORK[0]?.previewSrc ?? "");
  const [top, setTop] = useState<"A" | "B">("A");

  const [featuredSrcA, setFeaturedSrcA] = useState(WORK[0]?.previewSrc ?? "");
  const [featuredSrcB, setFeaturedSrcB] = useState(WORK[0]?.previewSrc ?? "");
  const [featuredTop, setFeaturedTop] = useState<"A" | "B">("A");

  const [activeSlug, setActiveSlug] = useState<string | null>(WORK[0]?.slug ?? null);

  useEffect(() => {
    if (hoverSlug) setActiveSlug(hoverSlug);
    else if (focusSlug) setActiveSlug(focusSlug);
  }, [hoverSlug, focusSlug]);

  useEffect(() => {
    if (scrollSlug && !hoverSlug && !focusSlug) {
      setActiveSlug(scrollSlug);
    }
  }, [scrollSlug]);

  const activeItem =
    (activeSlug ? WORK.find((w) => w.slug === activeSlug) : null) ?? WORK[0] ?? null;
  const allowCursorPreview = isDesktop && !reducedMotion;
  const showPreview = allowCursorPreview && !!hoverSlug;

  useEffect(() => {
    const mql = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(!!mql?.matches);
    update();
    mql?.addEventListener?.("change", update);
    return () => mql?.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia?.("(min-width: 768px)");
    const update = () => setIsDesktop(!!mql?.matches);
    update();
    mql?.addEventListener?.("change", update);
    return () => mql?.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-work-row]");
      items.forEach((el) => {
        const slug = el.dataset.workSlug;
        if (slug) {
          ScrollTrigger.create({
            trigger: el,
            start: "top 65%",
            end: "bottom 35%",
            onEnter: () => setScrollSlug((cur) => (hoverSlug || focusSlug ? cur : slug)),
            onEnterBack: () => setScrollSlug((cur) => (hoverSlug || focusSlug ? cur : slug)),
          });
        }

        gsap.fromTo(
          el,
          { opacity: 0, y: 18, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            },
          },
        );

        gsap.to(el, {
          y: -12,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });

      const featured = document.querySelector<HTMLElement>("[data-work-featured]");
      if (featured) {
        gsap.to(featured, {
          y: -28,
          ease: "none",
          scrollTrigger: {
            trigger: featured,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion, hoverSlug, focusSlug]);

  useEffect(() => {
    if (!allowCursorPreview) return;
    const node = previewRef.current;
    if (!node) return;

    const xTo = gsap.quickTo(node, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(node, "y", { duration: 0.35, ease: "power3.out" });
    const rTo = gsap.quickTo(node, "rotation", {
      duration: 0.6,
      ease: "power3.out",
    });
    const sTo = gsap.quickTo(node, "scale", {
      duration: 0.45,
      ease: "power3.out",
    });

    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;

      const now = performance.now();
      const dtRaw = now - lastT.current;
      const dt = Math.max(16, Number.isFinite(dtRaw) ? dtRaw : 16);
      const dx = pointer.current.x - last.current.x;
      const vx = dx / dt;

      last.current.x = pointer.current.x;
      last.current.y = pointer.current.y;
      lastT.current = now;

      const { w, h } = previewSize.current;
      const pad = 16;

      const offsetX =
        pointer.current.x < window.innerWidth * 0.58 ? 26 : -(w + 26);
      const offsetY =
        pointer.current.y < window.innerHeight * 0.55 ? 26 : -(h + 26);

      const tx = clamp(pointer.current.x + offsetX, pad, window.innerWidth - w - pad);
      const ty = clamp(
        pointer.current.y + offsetY,
        pad,
        window.innerHeight - h - pad,
      );

      xTo(tx);
      yTo(ty);
      rTo(clamp(vx * 220, -10, 10));
      sTo(showPreview ? 1 : 0.96);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [allowCursorPreview, showPreview]);

  useEffect(() => {
    const measure = () => {
      const card = previewCardRef.current;
      if (!card) return;
      const r = card.getBoundingClientRect();
      previewSize.current = { w: r.width, h: r.height };
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (!allowCursorPreview) return;
    const node = previewRef.current;
    if (!node) return;
    gsap.to(node, {
      autoAlpha: showPreview ? 1 : 0,
      duration: showPreview ? 0.12 : 0.18,
      ease: "power2.out",
      overwrite: true,
    });
  }, [allowCursorPreview, showPreview]);

  useEffect(() => {
    if (!allowCursorPreview) return;
    if (!hoverSlug) return;
    const next = WORK.find((w) => w.slug === hoverSlug);
    if (!next) return;

    const imgA = previewImgARef.current;
    const imgB = previewImgBRef.current;
    if (!imgA || !imgB) return;

    const isAOnTop = topLayer.current === "A";
    const incoming = isAOnTop ? imgB : imgA;
    const outgoing = isAOnTop ? imgA : imgB;

    if (isAOnTop) setSrcB(next.previewSrc);
    else setSrcA(next.previewSrc);

    gsap.killTweensOf([incoming, outgoing]);
    gsap.set(incoming, { opacity: 0, scale: 0.985, filter: "blur(10px)", skewX: -6 });
    gsap.set(outgoing, { opacity: 1, scale: 1, filter: "blur(0px)", skewX: 0 });

    gsap
      .timeline()
      .to(outgoing, { opacity: 0, duration: 0.18, ease: "power2.out" }, 0)
      .to(
        incoming,
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          skewX: 0,
          duration: 0.22,
          ease: "power3.out",
        },
        0.04,
      )
      .add(() => {
        topLayer.current = isAOnTop ? "B" : "A";
        setTop(topLayer.current);
      }, 0.22);
  }, [allowCursorPreview, hoverSlug]);

  useEffect(() => {
    const nextSrc = activeItem?.previewSrc ?? "";
    if (!nextSrc) return;

    if (reducedMotion) {
      featuredTopLayer.current = "A";
      setFeaturedTop("A");
      setFeaturedSrcA(nextSrc);
      setFeaturedSrcB(nextSrc);
      return;
    }

    const imgA = featuredImgARef.current;
    const imgB = featuredImgBRef.current;
    if (!imgA || !imgB) return;

    const isAOnTop = featuredTopLayer.current === "A";
    const incoming = isAOnTop ? imgB : imgA;
    const outgoing = isAOnTop ? imgA : imgB;

    if (isAOnTop) setFeaturedSrcB(nextSrc);
    else setFeaturedSrcA(nextSrc);

    gsap.killTweensOf([incoming, outgoing]);
    gsap.set(incoming, { opacity: 0, scale: 1.015, filter: "blur(10px)" });
    gsap.set(outgoing, { opacity: 1, scale: 1, filter: "blur(0px)" });

    gsap
      .timeline()
      .to(outgoing, { opacity: 0, duration: 0.2, ease: "power2.out" }, 0)
      .to(
        incoming,
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.26,
          ease: "power3.out",
        },
        0.04,
      )
      .add(() => {
        featuredTopLayer.current = isAOnTop ? "B" : "A";
        setFeaturedTop(featuredTopLayer.current);
      }, 0.26);
  }, [activeItem?.previewSrc, reducedMotion]);

  return (
    <section
      id="work"
      ref={(el) => {
        rootRef.current = el;
      }}
      className="relative px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-8">
          <div>
            <p className="font-display text-xs tracking-[0.28em] text-neutral-400/90">
              WORK
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
              Seleção de projetos
            </h2>
            <p className="mt-4 max-w-2xl text-neutral-200/70">
              No desktop, passe o mouse nos títulos para ver o preview seguindo o cursor.
              No mobile, o destaque troca conforme você navega pela lista.
            </p>
          </div>

          <div
            className="hidden rounded-2xl bg-white/5 px-5 py-4 text-xs text-neutral-300 ring-1 ring-white/10 md:block"
            style={{
              clipPath:
                "polygon(0% 0%, 92% 0%, 100% 35%, 100% 100%, 8% 100%, 0% 70%)",
            }}
          >
            <p className="font-display tracking-[0.24em] text-neutral-200/80">
              CURSOR PREVIEW
            </p>
            <p className="mt-2 max-w-[28ch] leading-relaxed text-neutral-300/70">
              Inspirado em UX de alta performance. Zero lag.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <ul className="space-y-4">
              {WORK.map((item, i) => (
                <li
                  key={item.slug}
                  data-work-row
                  data-work-slug={item.slug}
                  className={[
                    "group relative rounded-2xl bg-white/[0.03] ring-1 ring-white/10",
                    "px-5 py-5 backdrop-blur",
                    "transition hover:bg-white/[0.05]",
                    i % 2 === 0 ? "md:translate-x-0" : "md:translate-x-10",
                    i % 3 === 0 ? "md:rotate-[0.15deg]" : "md:rotate-0",
                  ].join(" ")}
                  style={{
                    clipPath:
                      i % 2 === 0
                        ? "polygon(0% 0%, 96% 0%, 100% 35%, 100% 100%, 0% 100%, 0% 24%)"
                        : "polygon(0% 0%, 92% 0%, 100% 22%, 100% 100%, 4% 100%, 0% 80%)",
                  }}
                  onPointerEnter={() => setHoverSlug(item.slug)}
                  onPointerLeave={() => setHoverSlug(null)}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="min-w-0">
                      <div className="mb-3 flex items-center gap-3">
                        <span className="font-display text-xs tracking-[0.22em] text-neutral-300/60">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="h-[1px] w-10 bg-gradient-to-r from-accent/70 via-white/20 to-transparent" />
                      </div>
                      <Link
                        href={`${item.link}`}
                        data-cursor="link"
                        className={[
                          "block rounded-xl",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
                          "focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950",
                        ].join(" ")}
                        onFocus={() => setFocusSlug(item.slug)}
                        onBlur={() =>
                          setFocusSlug((cur) => (cur === item.slug ? null : cur))
                        }
                        aria-label={`Abrir projeto: ${item.title}`}
                      >
                        <AnimatedTitle
                          text={item.title}
                          className="font-display text-2xl tracking-tight text-neutral-100 md:text-3xl"
                        />
                      </Link>
                      <p className="mt-2 text-sm text-neutral-200/70">
                        {item.role}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-neutral-200/70 ring-1 ring-white/10"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="font-display text-sm tracking-[0.18em] text-neutral-300/70">
                        {item.year}
                      </p>
                      <div className="mt-3 inline-flex items-center gap-2 text-xs text-neutral-300/70">
                        <span className="h-[1px] w-8 bg-white/15" />
                        OPEN
                      </div>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute -left-24 top-10 h-24 w-24 rounded-full bg-accent/10 blur-2xl" />
                    <div className="absolute -right-24 bottom-8 h-24 w-24 rounded-full bg-[#FF6E30]/10 blur-2xl" />
                  </div>

                  <div className="pointer-events-none absolute inset-x-5 bottom-5 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-5">
            <div
              data-work-featured
              className="relative overflow-hidden rounded-3xl bg-white/[0.03] ring-1 ring-white/10"
              style={{
                clipPath:
                  "polygon(0% 0%, 100% 0%, 100% 88%, 94% 100%, 0% 100%, 0% 18%)",
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(700px_260px_at_50%_20%,rgba(163,255,18,0.12),transparent_70%)]" />
              <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:56px_56px]" />

              <div className="relative p-6">
                <p className="font-display text-xs tracking-[0.28em] text-neutral-400/90">
                  EM DESTAQUE
                </p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-200/70">
                  {activeItem
                    ? `${activeItem.title} — ${activeItem.role}`
                    : "Passe o mouse em um projeto para ver o preview seguindo o cursor."}
                </p>
                {activeItem && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {activeItem.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-neutral-200/70 ring-1 ring-white/10"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {activeItem && (
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-neutral-300/70">
                      <span>Perf</span>
                      <span className="text-accent">+</span>
                      <span>Motion</span>
                      <span className="text-accent">+</span>
                      <span>WebGL</span>
                    </div>
                    <Link
                      href={`/work/${activeItem.slug}`}
                      data-cursor="button"
                      className={[
                        "inline-flex items-center gap-2 rounded-full",
                        "bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-neutral-200/80",
                        "ring-1 ring-white/10 transition hover:bg-white/10",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
                        "focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950",
                      ].join(" ")}
                    >
                      ABRIR   <span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                )}
              </div>

              <div className="relative px-6 pb-6">
                <div className="h-[1px] w-full bg-white/10" />
                <div className="mt-5 overflow-hidden rounded-2xl bg-white/[0.02] ring-1 ring-white/10">
                  <div className="relative aspect-[4/3]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      ref={(el) => {
                        featuredImgARef.current = el;
                      }}
                      src={featuredSrcA}
                      alt={activeItem?.title ?? ""}
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{
                        zIndex: featuredTop === "A" ? 2 : 1,
                        opacity: featuredTop === "A" ? 1 : 0,
                      }}
                      draggable={false}
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      ref={(el) => {
                        featuredImgBRef.current = el;
                      }}
                      src={featuredSrcB}
                      alt={activeItem?.title ?? ""}
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{
                        zIndex: featuredTop === "B" ? 2 : 1,
                        opacity: featuredTop === "B" ? 1 : 0,
                      }}
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />
                    <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:44px_44px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={(el) => {
          previewRef.current = el;
        }}
        aria-hidden="true"
        className={[
          "pointer-events-none fixed left-0 top-0 z-[90] hidden",
          "md:block",
        ].join(" ")}
        style={{
          transform: "translate3d(-9999px,-9999px,0)",
          opacity: 0,
        }}
      >
        <div
          ref={(el) => {
            previewCardRef.current = el;
          }}
          className={[
            "w-[320px] overflow-hidden rounded-2xl bg-neutral-950/80",
            "ring-1 ring-white/15 backdrop-blur",
            "shadow-[0_18px_70px_rgba(0,0,0,0.55)]",
            "will-change-transform",
          ].join(" ")}
          style={{
            clipPath:
              "polygon(0% 0%, 92% 0%, 100% 22%, 100% 100%, 0% 100%, 0% 18%)",
          }}
        >
          <div className="relative aspect-[4/3] bg-white/[0.02]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={(el) => {
                previewImgARef.current = el;
              }}
              src={srcA}
              alt={activeItem?.title ?? ""}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ zIndex: top === "A" ? 2 : 1, opacity: top === "A" ? 1 : 0 }}
              draggable={false}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={(el) => {
                previewImgBRef.current = el;
              }}
              src={srcB}
              alt={activeItem?.title ?? ""}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ zIndex: top === "B" ? 2 : 1, opacity: top === "B" ? 1 : 0 }}
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />
            <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:44px_44px]" />
          </div>

          <div className="p-4">
            <p className="font-display text-sm tracking-tight text-neutral-100">
              {activeItem ? activeItem.title : "—"}
            </p>
            <p className="mt-1 text-xs text-neutral-300/70">
              {activeItem ? `${activeItem.year} · ${activeItem.role}` : "—"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

