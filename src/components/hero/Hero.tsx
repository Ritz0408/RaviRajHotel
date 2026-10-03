"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import RevealLines from "@/components/ui/RevealLines";
import SplitLetters from "@/components/ui/SplitLetters";
import { brand, hero } from "@/lib/content";
import { EASE_LUXE } from "@/lib/motion";
import { scrollToHash, useLenis } from "@/components/providers/SmoothScroll";

const { frames, chapters } = hero;
/** Portion of the scroll that drives frames; the rest holds the finished dish. */
const SCRUB_END = 0.86;
const BG = "#120a08";
/** Chapter windows in overall scroll progress, aligned to the footage. */
const CHAPTER_RANGES: [number, number][] = [
  [0.14, 0.36], // ingredients falling
  [0.38, 0.58], // flame
  [0.6, 1.01], // finished kadai
];

type Mode = "pending" | "scrub" | "static";

/** Draw a frame: cover (desktop) or a bottom-anchored crop around the kadai (portrait). */
function drawFrame(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, w, h);

  if (w / h >= 1.3) {
    const s = Math.max(w / iw, h / ih);
    const dw = iw * s;
    const dh = ih * s;
    ctx.drawImage(img, (w - dw) * 0.85, (h - dh) * 0.5, dw, dh);
    return;
  }

  // portrait: keep the kadai whole, anchor it near the bottom, fade its top edge into the ground
  // visible slice: from just left of the kadai to just past its right handle
  const regionX = 0.355;
  const s = w / (iw * 0.625);
  const dw = iw * s;
  const dh = ih * s;
  const dy = h - dh - h * 0.05;
  ctx.drawImage(img, -iw * regionX * s, dy, dw, dh);
  const fade = ctx.createLinearGradient(0, dy, 0, dy + dh * 0.35);
  fade.addColorStop(0, BG);
  fade.addColorStop(1, "rgba(18,10,8,0)");
  ctx.fillStyle = fade;
  ctx.fillRect(0, dy - 1, w, dh * 0.35 + 1);
}

export default function Hero() {
  const lenis = useLenis();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const drawnRef = useRef(-1);
  const targetRef = useRef(0);
  const rafRef = useRef(0);

  const [mode, setMode] = useState<Mode>("pending");
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(0);
  const [phase, setPhase] = useState(-1); // -1 = brand, 0..2 = chapters

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only capability check
    setMode(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "static" : "scrub");
  }, []);

  // ---- frame loading (every 2nd frame on narrow screens) -------------------
  const render = useCallback(() => {
    rafRef.current = 0;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const list = imagesRef.current;
    if (!canvas || !ctx || !list.length) return;
    // nearest loaded frame to the target
    let idx = targetRef.current;
    for (let d = 0; d < list.length; d++) {
      if (list[idx - d]?.complete) { idx -= d; break; }
      if (list[idx + d]?.complete) { idx += d; break; }
    }
    const img = list[idx];
    if (!img?.complete || idx === drawnRef.current) return;
    drawnRef.current = idx;
    drawFrame(ctx, img, canvas.width, canvas.height);
  }, []);

  const requestDraw = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(render);
  }, [render]);

  useEffect(() => {
    if (mode !== "scrub") return;
    const narrow = window.innerWidth < 768;
    const stride = narrow ? 2 : 1;
    const indices: number[] = [];
    for (let i = 1; i <= frames.count; i += stride) indices.push(i);
    if (indices[indices.length - 1] !== frames.count) indices.push(frames.count);

    const list: (HTMLImageElement | null)[] = indices.map(() => null);
    imagesRef.current = list;
    let cancelled = false;
    let count = 0;

    // load sequentially in small parallel batches so the opening frames arrive first
    const queue = indices.map((n, i) => ({ n, i }));
    const worker = async () => {
      while (queue.length && !cancelled) {
        const { n, i } = queue.shift()!;
        const img = new window.Image();
        img.decoding = "async";
        img.src = frames.path(n);
        try {
          await img.decode();
        } catch {
          continue;
        }
        if (cancelled) return;
        list[i] = img;
        count++;
        if (i === 0) setReady(true);
        if (count % 6 === 0 || count === indices.length) setLoaded(count / indices.length);
        requestDraw();
      }
    };
    for (let k = 0; k < 6; k++) worker();
    return () => {
      cancelled = true;
    };
  }, [mode, requestDraw]);

  // ---- canvas sizing --------------------------------------------------------
  useEffect(() => {
    if (mode !== "scrub") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      drawnRef.current = -1;
      requestDraw();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [mode, requestDraw]);

  // ---- scroll → frame + chapter -------------------------------------------
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const list = imagesRef.current;
    if (list.length) {
      targetRef.current = Math.round(Math.min(1, p / SCRUB_END) * (list.length - 1));
      requestDraw();
    }
    const next = CHAPTER_RANGES.findIndex(([a, b]) => p >= a && p < b);
    setPhase(p < 0.1 ? -1 : next);
  });

  const railFill = useTransform(scrollYProgress, [0, SCRUB_END], [0, 1]);
  const veil = useTransform(scrollYProgress, [0.92, 1], [0, 0.6]);

  const go = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToHash(lenis, hash);
  };

  const showBrand = phase === -1;
  const isStatic = mode === "static";

  return (
    <section
      id="top"
      ref={sectionRef}
      className={`relative bg-[#120a08] ${isStatic ? "h-[100svh]" : "h-[340vh] md:h-[420vh]"}`}
    >
      <div className="sticky top-0 h-[100svh] min-h-[600px] w-full overflow-hidden">
        {/* First frame / static fallback (also the LCP image) */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.4, ease: EASE_LUXE }}
        >
          <Image
            src={frames.path(isStatic ? frames.count : 1)}
            alt="Chicken, red chillies, garlic and spices falling into a black iron kadai in front of a red laterite wall"
            fill
            preload
            unoptimized
            sizes="100vw"
            className={`object-cover object-[67%_100%] wide:object-[85%_50%] transition-opacity duration-700 ${
              ready && !isStatic ? "opacity-0" : "opacity-100"
            }`}
          />
          {!isStatic && <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />}
        </motion.div>

        {/* Readability: dark left field (desktop) / top field (mobile) + vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#120a08] via-[#120a08]/50 to-transparent wide:bg-gradient-to-r wide:from-[#120a08]/95 wide:via-[#120a08]/45 wide:to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,transparent_45%,rgba(14,8,7,0.65)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
        <motion.div style={{ opacity: veil }} className="pointer-events-none absolute inset-0 bg-ink" />

        {/* ---- Copy ---------------------------------------------------------- */}
        <div className="relative z-20 mx-auto flex h-full max-w-[1680px] flex-col px-5 pt-28 md:px-10 wide:justify-center wide:pt-0">
          <div className="relative min-h-[26rem] md:max-w-xl wide:w-[44%] wide:max-w-none lg:wide:w-[40%]">
            {/* Brand */}
            <AnimatePresence>
              {showBrand && (
                <motion.div
                  key="brand"
                  className="absolute inset-x-0 top-0"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -30, transition: { duration: 0.7, ease: EASE_LUXE } }}
                >
                  <motion.div
                    className="mb-6 flex items-center gap-4 md:mb-8"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.3, ease: EASE_LUXE, delay: 0.3 }}
                  >
                    <span className="h-px w-10 bg-terracotta" />
                    <span className="eyebrow text-ivory/80">{hero.eyebrow}</span>
                  </motion.div>
                  <h1 className="flex flex-col">
                    <span className="eyebrow mb-1 pl-[0.35em] text-[0.8rem] tracking-[0.75em] text-ivory/85">
                      <SplitLetters text="HOTEL" play stagger={0.07} delay={0.4} />
                    </span>
                    <SplitLetters
                      text="Raviraj"
                      play
                      delay={0.55}
                      stagger={0.07}
                      className="display -ml-[0.04em] text-[clamp(4.5rem,11vw,10.5rem)] leading-[0.85] text-ivory"
                    />
                  </h1>
                  <motion.p
                    lang="mr"
                    className="mt-4 font-marathi text-xl text-sand md:text-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.4, delay: 1.2 }}
                  >
                    {brand.marathi}
                  </motion.p>
                  <RevealLines
                    as="h2"
                    play
                    delay={1.1}
                    lines={["The Bonding of *Brother's Love*"]}
                    className="display mt-8 text-[clamp(1.75rem,2.6vw,2.6rem)] text-ivory/95"
                  />
                  <motion.div
                    className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.3, ease: EASE_LUXE, delay: 1.5 }}
                  >
                    <a href="#story" onClick={go("#story")} className="btn-primary eyebrow">
                      Explore hotel
                    </a>
                    <a href="#locations" onClick={go("#locations")} className="link-line eyebrow self-start text-ivory sm:self-auto">
                      Our locations <span aria-hidden>→</span>
                    </a>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chapters */}
            {chapters.map((c, i) => {
              const on = phase === i;
              const last = i === chapters.length - 1;
              return (
                <motion.div
                  key={c.index}
                  className="pointer-events-none absolute inset-x-0 top-0"
                  initial={false}
                  animate={{ opacity: on ? 1 : 0, y: on ? 0 : -24 }}
                  transition={{ duration: 0.8, ease: EASE_LUXE }}
                  aria-hidden={!on}
                  style={{ pointerEvents: on ? "auto" : "none" }}
                >
                  <div className="mb-6 flex items-center gap-4">
                    <span className="eyebrow tabular-nums text-terracotta">{c.index}</span>
                    <span className="h-px w-10 bg-ivory/30" />
                    <span className="eyebrow text-ivory/75">{c.label}</span>
                  </div>
                  <RevealLines
                    key={on ? "on" : "off"}
                    as="h2"
                    play={on}
                    lines={c.lines}
                    className={`display text-ivory ${
                      last ? "text-[clamp(4rem,10vw,10rem)] leading-[0.86]" : "text-[clamp(2.75rem,5.4vw,5.75rem)]"
                    }`}
                  />
                  {"marathi" in c && c.marathi && (
                    <p lang="mr" className="mt-4 font-marathi text-2xl text-sand">
                      {c.marathi}
                    </p>
                  )}
                  <motion.p
                    className="mt-7 max-w-[34ch] leading-[1.8] text-ivory/75"
                    initial={false}
                    animate={{ opacity: on ? 1 : 0 }}
                    transition={{ duration: 1, delay: on ? 0.45 : 0 }}
                  >
                    {c.copy}
                  </motion.p>
                  {last && (
                    <motion.div
                      className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8"
                      initial={false}
                      animate={{ opacity: on ? 1 : 0, y: on ? 0 : 12 }}
                      transition={{ duration: 1, ease: EASE_LUXE, delay: on ? 0.6 : 0 }}
                    >
                      <a href="#dining" onClick={go("#dining")} className="btn-primary eyebrow" tabIndex={on ? 0 : -1}>
                        Explore the menu
                      </a>
                      <a
                        href="#locations"
                        onClick={go("#locations")}
                        className="link-line eyebrow self-start text-ivory sm:self-auto"
                        tabIndex={on ? 0 : -1}
                      >
                        Our locations <span aria-hidden>→</span>
                      </a>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Chapter rail (desktop) */}
        {!isStatic && (
          <div className="absolute right-10 top-1/2 z-20 hidden -translate-y-1/2 items-stretch gap-5 lg:flex">
            <span className="relative w-px bg-ivory/15">
              <motion.span style={{ scaleY: railFill }} className="absolute inset-0 origin-top bg-terracotta" />
            </span>
            <ol className="flex flex-col justify-between gap-10 py-1">
              {chapters.map((c, i) => (
                <li
                  key={c.index}
                  className={`eyebrow flex items-center gap-3 transition-colors duration-700 ${
                    phase >= i ? "text-ivory" : "text-ivory/35"
                  }`}
                >
                  <span className="tabular-nums text-[0.6rem] text-terracotta">{c.index}</span>
                  {c.label}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Scroll cue + loading progress */}
        <AnimatePresence>
          {showBrand && (
            <motion.div
              className="absolute inset-x-0 bottom-0 z-20 border-t border-ivory/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 1.2, delay: 1.8 } }}
              exit={{ opacity: 0 }}
            >
              <div className="mx-auto flex h-16 max-w-[1680px] items-center justify-between px-5 md:h-20 md:px-10">
                <span className="eyebrow flex items-center gap-3 text-[0.6rem] text-sand/70">
                  {isStatic ? brand.kind : loaded < 1 ? `Preparing the kitchen · ${Math.round(loaded * 100)}%` : "Scroll to cook"}
                </span>
                <span className="eyebrow flex items-center gap-4 text-[0.62rem] text-ivory/60">
                  <span className="hidden sm:inline">Scroll</span>
                  <span className="relative h-10 w-px overflow-hidden bg-ivory/20">
                    <span className="absolute inset-0 bg-ivory/80 [animation:scroll-cue_2.4s_cubic-bezier(0.76,0,0.24,1)_infinite]" />
                  </span>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
