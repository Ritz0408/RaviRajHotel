"use client";

import { useEffect, useRef, useState } from "react";
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
/** Mirrors the `wide` Tailwind variant: landscape screens use the full-frame set, everything else the phone crop. */
const WIDE_QUERY = "(min-aspect-ratio: 13/10) and (min-width: 768px)";
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

/** Paint one frame: cover (desktop) or a bottom-anchored crop around the kadai (portrait). */
function paint(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number, portrait: boolean) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!portrait) {
    const s = Math.max(w / iw, h / ih);
    const dw = iw * s;
    const dh = ih * s;
    ctx.drawImage(img, (w - dw) * 0.85, (h - dh) * 0.5, dw, dh);
    return;
  }
  // the phone frames are already cropped around the kadai — fit to width, anchor near the bottom
  const dh = ih * (w / iw);
  ctx.drawImage(img, 0, h - dh - h * 0.05, w, dh);
}

/** Draw frame `a`, cross-faded into `b` by `t` — turns 8–12 fps footage into smooth playback. */
function drawFrame(ctx: CanvasRenderingContext2D, a: HTMLImageElement, b: HTMLImageElement | null, t: number, w: number, h: number) {
  const portrait = w / h < 1.3;
  ctx.globalAlpha = 1;
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, w, h);
  paint(ctx, a, w, h, portrait);
  if (b && b !== a && t > 0.02) {
    ctx.globalAlpha = t;
    paint(ctx, b, w, h, portrait);
    ctx.globalAlpha = 1;
  }
  if (portrait) {
    // fade the frame's top edge into the ground
    const dh = a.naturalHeight * (w / a.naturalWidth);
    const dy = h - dh - h * 0.05;
    const fade = ctx.createLinearGradient(0, dy, 0, dy + dh * 0.35);
    fade.addColorStop(0, BG);
    fade.addColorStop(1, "rgba(18,10,8,0)");
    ctx.fillStyle = fade;
    ctx.fillRect(0, dy - 1, w, dh * 0.35 + 1);
  }
}
export default function Hero() {
  const lenis = useLenis();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);

  const [mode, setMode] = useState<Mode>("pending");
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(0);
  const [phase, setPhase] = useState(-1); // -1 = brand, 0..2 = chapters

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  useEffect(() => {
    // Reduced motion, data-saver and very low-memory phones get the still hero instead of a frame scrub.
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const still =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !!nav.connection?.saveData ||
      (nav.deviceMemory !== undefined && nav.deviceMemory <= 1);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only capability check
    setMode(still ? "static" : "scrub");
  }, []);

  useEffect(() => {
    if (mode !== "scrub") return;
    const set = window.matchMedia(WIDE_QUERY).matches ? frames.desktop : frames.mobile;
    const list: (HTMLImageElement | null)[] = Array.from({ length: set.count }, () => null);
    imagesRef.current = list;
    let cancelled = false;
    let count = 0;

    // Load in order with a few parallel workers so the opening frames arrive first.
    // Start after the intro animation has had a moment, so decoding never competes with it.
    const queue = list.map((_, i) => i);
    const worker = async () => {
      while (queue.length && !cancelled) {
        const i = queue.shift()!;
        const img = new window.Image();
        img.decoding = "async";
        img.src = set.path(i + 1);
        try {
          await img.decode();
        } catch {
          continue;
        }
        if (cancelled) return;
        list[i] = img;
        count++;
        if (i === 0) setReady(true);
        if (count % 8 === 0 || count === list.length) setLoaded(count / list.length);
      }
    };
    const start = window.setTimeout(() => {
      for (let k = 0; k < 3; k++) worker();
    }, 500);
    return () => {
      cancelled = true;
      window.clearTimeout(start);
    };
  }, [mode]);

  // ---- canvas sizing --------------------------------------------------------
  useEffect(() => {
    if (mode !== "scrub") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [mode]);

  // ---- continuous playback: the footage loops by itself, scrolling only changes the copy ----
  useEffect(() => {
    if (mode !== "scrub") return;
    const fps = window.matchMedia(WIDE_QUERY).matches ? 12 : 8; // ~real time for each frame set
    let raf = 0;
    let last = 0;
    let pos = 0;
    let hold = 0;
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(t - last, 100);
      last = t;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const list = imagesRef.current;
      if (!canvas || !ctx || scrollYProgress.get() >= 0.995) return; // hero scrolled away: stop drawing
      let n = 0;
      while (n < list.length && list[n]) n++;
      if (n < list.length * 0.4) return; // wait for enough frames for a smooth loop
      if (hold > 0) {
        hold -= dt;
        if (hold <= 0) pos = 0;
      } else {
        pos += (dt / 1000) * fps;
        if (pos >= n - 1) {
          pos = n - 1;
          hold = 1500; // linger on the finished dish before the next pass
        }
      }
      const i = Math.floor(pos);
      drawFrame(ctx, list[i]!, list[Math.min(i + 1, n - 1)], pos - i, canvas.width, canvas.height);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode, scrollYProgress]);

  // ---- scroll → chapter copy ----------------------------------------------
  useMotionValueEvent(scrollYProgress, "change", (p) => {    const next = CHAPTER_RANGES.findIndex(([a, b]) => p >= a && p < b);
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
      className={`relative bg-[#120a08] ${isStatic ? "h-[100svh]" : "h-[190vh] md:h-[240vh]"}`}
    >
      <div className="sticky top-0 h-[100svh] min-h-[600px] w-full overflow-hidden">
        {/* First frame / static fallback (also the LCP image). Fade-in only: scaling a full-screen layer janks phones. */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        >
          <picture>
            <source
              media={WIDE_QUERY}
              srcSet={frames.desktop.path(isStatic ? frames.desktop.count : 1)}
            />
            <img
              src={frames.mobile.path(isStatic ? frames.mobile.count : 1)}
              alt="Chicken, red chillies, garlic and spices falling into a black iron kadai in front of a red laterite wall"
              fetchPriority="high"
              decoding="async"
              width={640}
              height={529}
              className={`absolute inset-x-0 bottom-[5%] h-auto w-full wide:inset-0 wide:bottom-0 wide:h-full wide:object-cover wide:object-[85%_50%] transition-opacity duration-500 ${
                ready && !isStatic ? "opacity-0" : "opacity-100"
              }`}
            />
          </picture>
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
