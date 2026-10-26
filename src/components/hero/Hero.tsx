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

const { video, chapters } = hero;
/** Portion of the scroll over which the progress rail fills. */
const SCRUB_END = 0.86;
/** Chapter windows in overall scroll progress. */
const CHAPTER_RANGES: [number, number][] = [
  [0.14, 0.36],
  [0.38, 0.58],
  [0.6, 1.01],
];

export default function Hero() {
  const lenis = useLenis();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isStatic, setIsStatic] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState(-1); // -1 = brand, 0..2 = chapters

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  useEffect(() => {
    // Reduced motion and data-saver visitors get the first frame instead of autoplaying video.
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only capability check
    setIsStatic(window.matchMedia("(prefers-reduced-motion: reduce)").matches || !!nav.connection?.saveData);
  }, []);

  // keep the loop inside the clean part of the footage (before its end card)
  const onTime = () => {
    const v = videoRef.current;
    if (v && v.currentTime >= video.to) v.currentTime = video.from;
  };

  // play only while the hero is on screen
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const v = videoRef.current;
    if (v && !isStatic) {
      if (p >= 0.995) v.pause();
      else if (v.paused) v.play().catch(() => {});
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

  return (
    <section
      id="top"
      ref={sectionRef}
      className={`relative bg-[#120a08] ${isStatic ? "h-[100svh]" : "h-[170vh] md:h-[200vh]"}`}
    >
      <div className="sticky top-0 h-[100svh] min-h-[600px] w-full overflow-hidden">
        {/* Background video: full-bleed on phones, right-hand panel on landscape screens */}
        <motion.div
          className="absolute inset-0 wide:left-[38%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        >
          <video
            ref={videoRef}
            src={`${video.src}#t=${video.from + 0.1}`}
            autoPlay={!isStatic}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            onTimeUpdate={onTime}
            onPlaying={() => setPlaying(true)}
            aria-label="Sizzling spices and slow-cooked dishes from the Raviraj kitchen"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              playing || isStatic ? "opacity-100" : "opacity-90"
            }`}
          />
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
                  {isStatic ? brand.kind : "Scroll to explore"}
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