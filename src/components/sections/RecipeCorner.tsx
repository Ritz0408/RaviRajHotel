"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { brand, recipes } from "@/lib/content";
import { splitEmphasis } from "@/lib/motion";

const EMBERS = Array.from({ length: 16 }, (_, i) => ({
  left: 4 + ((i * 37) % 92), // deterministic spread, no hydration mismatch
  delay: (i * 0.7) % 6,
  dur: 5 + (i % 5),
  size: 3 + (i % 3) * 2,
}));

function Flames({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-1" aria-label={`Spice level ${n} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" className={`h-3.5 w-3.5 ${i < n ? "text-terracotta" : "text-ivory/20"}`} fill="currentColor" aria-hidden>
          <path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-10z" />
        </svg>
      ))}
    </span>
  );
}

/**
 * The recipe reels as a "kitchen stories" player: one portrait video at a time with story-style
 * progress bars, auto-advancing through the four dishes, plus a sound toggle and a spice meter.
 * The file is requested only when the section is near, plays only while visible, and the
 * progress fill is written straight to the DOM (no re-render per frame).
 */
export default function RecipeCorner() {
  const items = recipes.items;
  const boxRef = useRef<HTMLDivElement>(null);
  const vref = useRef<HTMLVideoElement>(null);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rowRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [active, setActive] = useState(0);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [still, setStill] = useState(false);

  const item = items[active];

  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only capability check
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches || !!nav.connection?.saveData);
  }, []);

  useEffect(() => {
    const el = boxRef.current;
    if (!el || !("IntersectionObserver" in window)) {
      setNear(true);
      setVisible(true);
      return;
    }
    const nearIO = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "500px 0px" });
    const visIO = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 });
    nearIO.observe(el);
    visIO.observe(el);
    return () => {
      nearIO.disconnect();
      visIO.disconnect();
    };
  }, []);

  // play only while visible and not paused by the viewer
  useEffect(() => {
    const v = vref.current;
    if (!v || !near) return;
    v.muted = muted;
    if (visible && !userPaused && !still) {
      v.play().catch(() => {
        // sound can be refused without a gesture: fall back to muted playback
        v.muted = true;
        setMuted(true);
        v.play().catch(() => {});
      });
    } else v.pause();
  }, [near, visible, userPaused, still, muted, active]);

  // reset the fills when the dish changes
  useEffect(() => {
    barRefs.current.forEach((b, i) => b && (b.style.transform = `scaleX(${i < active ? 1 : 0})`));
    rowRefs.current.forEach((r) => r && (r.style.transform = "scaleX(0)"));
  }, [active]);

  const go = useCallback((i: number) => setActive((i + items.length) % items.length), [items.length]);

  const onTime = () => {
    const v = vref.current;
    if (!v) return;
    const span = item.to - item.from;
    const p = Math.min(1, Math.max(0, (v.currentTime - item.from) / span));
    const bar = barRefs.current[active];
    const row = rowRefs.current[active];
    if (bar) bar.style.transform = `scaleX(${p})`;
    if (row) row.style.transform = `scaleX(${p})`;
    if (v.currentTime >= item.to) {
      if (still) v.currentTime = item.from;
      else go(active + 1);
    }
  };

  const togglePlay = () => {
    const v = vref.current;
    if (!v) return;
    if (v.paused) {
      setUserPaused(false);
      v.play().catch(() => {});
    } else {
      setUserPaused(true);
      v.pause();
    }
  };

  return (
    <section id="recipes" className="relative overflow-hidden bg-ink py-24 text-ivory md:py-40" aria-label={recipes.eyebrow}>
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[110vw] max-h-[1000px] w-[110vw] max-w-[1000px] -translate-x-1/2 bg-[radial-gradient(circle,rgba(140,33,29,0.45),transparent_62%)]" />

      <div className="relative mx-auto max-w-[1680px] px-5 md:px-10">
        <span data-reveal className="eyebrow mb-6 flex items-center gap-4 text-terracotta">
          <span className="h-px w-10 bg-terracotta" />
          {recipes.eyebrow}
          <span lang="mr" className="font-marathi text-sm normal-case tracking-normal text-sand/80">
            {recipes.eyebrowMr}
          </span>
        </span>
        <h2 data-reveal className="display text-[clamp(2.9rem,8vw,8.5rem)]">
          {recipes.title.map((line, i) => (
            <span key={i} className="block">
              {splitEmphasis(line).map((p, j) =>
                p.em ? (
                  <em key={j} className="font-serif italic font-light text-sand">
                    {p.text}
                  </em>
                ) : (
                  <span key={j}>{p.text}</span>
                ),
              )}
            </span>
          ))}
        </h2>

        <div className="mt-14 grid items-center gap-12 md:mt-24 md:grid-cols-12 md:gap-6">
          {/* ---- dish list + details ---- */}
          <div className="order-2 md:order-1 md:col-span-6">
            <p data-reveal className="max-w-[44ch] leading-[1.85] text-sand/80">
              {recipes.copy}
            </p>

            <ol data-reveal className="mt-10 border-t border-ivory/15">
              {items.map((it, i) => {
                const on = i === active;
                return (
                  <li key={it.id} className="border-b border-ivory/15">
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-current={on}
                      className="group relative flex w-full items-center gap-4 py-5 text-left md:gap-6 md:py-6"
                    >
                      <span className={`eyebrow w-7 shrink-0 text-[0.62rem] tabular-nums ${on ? "text-terracotta" : "text-ivory/40"}`}>
                        0{i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          lang="mr"
                          className={`block font-marathi text-[1.7rem] leading-tight transition-colors duration-500 md:text-4xl ${
                            on ? "text-ivory" : "text-ivory/45 group-hover:text-ivory/80"
                          }`}
                        >
                          {it.mr}
                        </span>
                        <span className={`eyebrow mt-1 block text-[0.58rem] transition-colors duration-500 ${on ? "text-sand" : "text-ivory/35"}`}>
                          {it.en}
                        </span>
                      </span>
                      <Flames n={it.heat} />
                      <span className="absolute inset-x-0 bottom-0 h-px bg-ivory/10">
                        <span
                          ref={(el) => {
                            rowRefs.current[i] = el;
                          }}
                          className="absolute inset-0 origin-left scale-x-0 bg-terracotta"
                        />
                      </span>
                    </button>
                    {on && (
                      <p className="pb-6 pl-11 text-[0.95rem] leading-[1.75] text-ivory/70 md:pl-[3.25rem]">{it.note}</p>
                    )}
                  </li>
                );
              })}
            </ol>

            <div data-reveal className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a href="#locations" className="btn-primary eyebrow">
                Find a Raviraj near you
              </a>
              <span lang="mr" className="font-marathi text-xl text-champagne md:text-2xl">
                {brand.slogan.mr}
              </span>
            </div>
          </div>

          {/* ---- the player ---- */}
          <div ref={boxRef} className="order-1 flex justify-center md:order-2 md:col-span-6">
            <div data-live-scene data-live="false" className="live-scene relative w-[74vw] max-w-[380px] md:w-[min(100%,26rem)]">
              {/* embers drifting up behind the frame */}
              <div aria-hidden className="pointer-events-none absolute -inset-x-6 -bottom-4 top-1/3">
                {EMBERS.map((e, i) => (
                  <span
                    key={i}
                    className="ember absolute bottom-0 rounded-full bg-terracotta"
                    style={{ left: `${e.left}%`, width: e.size, height: e.size, animationDelay: `${e.delay}s`, animationDuration: `${e.dur}s` }}
                  />
                ))}
              </div>

              <div className="absolute -right-3 -top-3 h-full w-full border border-champagne/30 md:-right-5 md:-top-5" />

              <div className="relative aspect-[9/16] overflow-hidden bg-ink-2 shadow-[0_50px_90px_-30px_rgba(0,0,0,0.85)]">
                {near && (
                  <video
                    key={item.id}
                    ref={vref}
                    src={`${item.src}#t=${item.from}`}
                    autoPlay={!still}
                    muted
                    playsInline
                    preload="auto"
                    disablePictureInPicture
                    onTimeUpdate={onTime}
                    onPlaying={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    aria-label={`${item.en} being cooked in the Raviraj kitchen`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink/40" />

                {/* story bars */}
                <div className="absolute inset-x-3 top-3 z-20 flex gap-1.5">
                  {items.map((it, i) => (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => go(i)}
                      aria-label={`Play ${it.en}`}
                      className="relative h-6 flex-1"
                    >
                      <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-ivory/30">
                        <span
                          ref={(el) => {
                            barRefs.current[i] = el;
                          }}
                          className="absolute inset-0 origin-left rounded-full bg-ivory"
                          style={{ transform: `scaleX(${i < active ? 1 : 0})` }}
                        />
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pointer-events-none absolute inset-x-4 top-12 z-20 flex items-center justify-between">
                  <span className="eyebrow flex items-center gap-2 text-[0.58rem] text-ivory/90">
                    <span className={`h-1.5 w-1.5 rounded-full bg-raviraj ${playing ? "animate-pulse" : ""}`} />
                    Now cooking
                  </span>
                  <span className="eyebrow text-[0.58rem] tabular-nums text-ivory/70">
                    0{active + 1} / 0{items.length}
                  </span>
                </div>

                {/* tap the picture to pause / play */}
                <button type="button" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} className="absolute inset-0 z-10" />

                <div className="absolute inset-x-4 bottom-4 z-20 flex items-end justify-between">
                  <span lang="mr" className="pointer-events-none max-w-[60%] font-marathi text-lg leading-tight text-ivory drop-shadow">
                    {item.mr}
                  </span>
                  <span className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMuted((m) => !m)}
                      aria-label={muted ? "Turn sound on" : "Turn sound off"}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/40 bg-ink/50 text-ivory transition-colors active:bg-raviraj md:hover:bg-raviraj"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M4 9v6h4l5 4V5L8 9z" />
                        {muted ? <path d="M17 9l5 6M22 9l-5 6" /> : <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />}
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => go(active + 1)}
                      aria-label="Next recipe"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/40 bg-ink/50 text-ivory transition-colors active:bg-raviraj md:hover:bg-raviraj"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M5 5l9 7-9 7zM19 5v14" />
                      </svg>
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
