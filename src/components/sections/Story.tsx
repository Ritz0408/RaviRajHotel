"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import RevealLines from "@/components/ui/RevealLines";
import SectionLabel from "@/components/ui/SectionLabel";
import PatternRule from "@/components/ui/PatternRule";
import { brand, story } from "@/lib/content";
import { EASE_CURTAIN, EASE_LUXE } from "@/lib/motion";

const chapters = story.chapters;
type Chapter = (typeof chapters)[number];

/** Counts up to `to` whenever it becomes active. */
function CountUp({ to, active }: { to: number; active: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!active) {
      el.textContent = "00";
      return;
    }
    const controls = animate(0, to, {
      duration: 1.4,
      ease: EASE_LUXE,
      onUpdate: (v) => (el.textContent = String(Math.round(v)).padStart(2, "0")),
    });
    return () => controls.stop();
  }, [to, active]);
  return <span ref={ref}>00</span>;
}

/** One clip in the stacked frame — wipes up when active and only plays while visible. */
function Clip({ c, active, live, index }: { c: Chapter; active: boolean; live: boolean; index: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active && live) {
      v.preload = "auto";
      if (c.segment && (v.currentTime < c.segment.from || v.currentTime >= c.segment.to)) v.currentTime = c.segment.from;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [active, live, c.segment]);

  return (
    <motion.div
      className="absolute inset-0"
      initial={false}
      animate={{
        clipPath: active ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
        zIndex: active ? 2 : 1,
      }}
      transition={{ duration: 1.2, ease: EASE_CURTAIN }}
    >
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ scale: active ? 1 : 1.18 }}
        transition={{ duration: 1.8, ease: EASE_LUXE }}
      >
        <video
          ref={ref}
          src={c.segment ? `${c.video}#t=${c.segment.from}` : c.video}
          poster={c.poster}
          muted
          loop={!c.segment}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (c.segment && v.currentTime >= c.segment.to) v.currentTime = c.segment.from;
          }}
          playsInline
          preload={index === 0 ? "metadata" : "none"}
          aria-label={c.alt}
          className="h-full w-full object-cover"
        />
      </motion.div>
    </motion.div>
  );
}

export default function Story() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const live = useInView(ref, { margin: "0px 0px -20% 0px" });

  const timer = useRef<number | undefined>(undefined);

  // chapters advance on their own while the section is on screen — no scroll-jacking
  const startTimer = () => {
    window.clearInterval(timer.current);
    timer.current = window.setInterval(() => setActive((a) => (a + 1) % chapters.length), 6000);
  };
  useEffect(() => {
    if (!live || reduced) return;
    startTimer();
    return () => window.clearInterval(timer.current);
  }, [live, reduced]);
  const pick = (i: number) => {
    setActive(i);
    startTimer();
  };
  const fill = (active + 1) / chapters.length;
  if (reduced) return <StoryStatic />;

  const c = chapters[active];

  return (
    <motion.section
      id="story"
      ref={ref}
      className="laterite relative z-10 text-ivory"
      aria-label={story.eyebrow}
    >
      <div className="relative flex min-h-[100svh] flex-col overflow-hidden">
        {/* giant Marathi watermark */}
        <div
          lang="mr"
          aria-hidden
          className="pointer-events-none absolute -right-[4vw] bottom-[8vh] select-none whitespace-nowrap font-marathi text-[24vw] leading-none text-ivory/[0.04]"
        >
          {brand.marathi}
        </div>

        <div className="relative mx-auto flex w-full max-w-[1680px] flex-1 flex-col px-5 pb-6 pt-24 md:px-10 md:pb-10 md:pt-28">
          <SectionLabel index="07" label={story.eyebrow} className="text-sand" />

          <div className="mt-6 grid flex-1 items-center gap-6 md:mt-10 md:grid-cols-12 md:gap-6">
            {/* ---- Copy ---- */}
            <div className="order-2 md:order-1 md:col-span-6 lg:col-span-5">
              <div className="flex items-end gap-5">
                <span className="display relative overflow-hidden text-[clamp(4.5rem,11vw,10rem)] leading-[0.8] text-transparent [-webkit-text-stroke:1px_rgba(243,235,223,0.45)]">
                  <motion.span
                    key={active}
                    className="block"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 1, ease: EASE_LUXE }}
                  >
                    {String(active + 1).padStart(2, "0")}
                  </motion.span>
                </span>
                <div className="pb-2">
                  <motion.span
                    key={`l${active}`}
                    className="eyebrow block text-sand"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.1 }}
                  >
                    {c.label}
                  </motion.span>
                  <span className="eyebrow mt-1 block text-[0.6rem] text-ivory/45">
                    of {String(chapters.length).padStart(2, "0")}
                  </span>
                </div>
              </div>

              <RevealLines
                key={`t${active}`}
                as="h2"
                play
                delay={0.15}
                lines={c.lines}
                className="display mt-6 text-[clamp(2.6rem,5.6vw,6rem)] text-ivory md:mt-10"
              />

              <motion.div
                key={`c${active}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: EASE_LUXE, delay: 0.45 }}
              >
                <p className="mt-5 max-w-[40ch] text-[0.95rem] leading-[1.8] text-ivory/80 md:mt-8 md:text-[1.05rem]">
                  {c.copy}
                </p>
                <div className="mt-6 flex items-center gap-8 md:mt-10">
                  {"stat" in c && c.stat && (
                    <div className="flex items-baseline gap-3 border-r border-ivory/20 pr-8">
                      <span className="display text-5xl text-ivory md:text-6xl">
                        <CountUp to={c.stat.value} active />
                      </span>
                      <span className="eyebrow text-[0.6rem] text-sand">{c.stat.label}</span>
                    </div>
                  )}
                  <span lang="mr" className="font-marathi text-2xl text-sand md:text-3xl">
                    {c.marathi}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* ---- Frame ---- */}
            <div className="order-1 flex justify-center md:order-2 md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
              <div className="relative w-[50vw] max-w-[440px] md:w-full">
                {/* offset hairline frame */}
                <div className="absolute -right-3 -top-3 h-full w-full border border-champagne/60 md:-right-5 md:-top-5" />
                <div className="relative aspect-[4/5] max-h-[42svh] overflow-hidden bg-ink shadow-[0_0_0_1px_rgba(196,165,115,0.55),0_40px_80px_-30px_rgba(0,0,0,0.7)] md:max-h-[64svh]">
                  {chapters.map((ch, i) => (
                    <Clip key={ch.video} c={ch} index={i} active={i === active} live={live} />
                  ))}
                  <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                  {/* owners spotlight: this section is only about the two brothers */}
                  <span className="eyebrow absolute left-3 top-3 z-10 flex items-center gap-2 border border-champagne/70 bg-ink/60 px-3 py-2 text-[0.55rem] text-champagne">
                    <span className="h-1.5 w-1.5 rounded-full bg-champagne" />
                    The owners
                  </span>
                  <span className="eyebrow absolute bottom-4 left-4 z-10 text-[0.58rem] text-ivory/80">
                    Raviraj · {c.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ---- Timeline ---- */}
          <div className="mt-6 md:mt-8">
            <div className="relative h-px bg-ivory/20">
              <span style={{ transform: `scaleX(${fill})` }} className="absolute inset-0 origin-left bg-champagne transition-transform duration-700 ease-[var(--ease-luxe)]" />
            </div>
            <ol className="mt-4 grid" style={{ gridTemplateColumns: `repeat(${chapters.length}, minmax(0, 1fr))` }}>
              {chapters.map((ch, i) => (
                <li key={ch.label} className="relative"><button type="button" onClick={() => pick(i)} aria-label={ch.label} className="absolute -top-8 left-0 right-0 h-10" />
                  <span
                    className={`absolute -top-[1.32rem] left-0 h-2.5 w-2.5 rotate-45 border transition-colors duration-500 ${
                      i <= active ? "border-champagne bg-champagne" : "border-ivory/40 bg-[#6a1c15]"
                    }`}
                  />
                  <span
                    className={`eyebrow block text-[0.55rem] transition-colors duration-500 md:text-[0.65rem] ${
                      i === active ? "text-ivory" : "text-ivory/45"
                    }`}
                  >
                    <span className="mr-2 tabular-nums text-sand">{String(i + 1).padStart(2, "0")}</span>
                    <span className="hidden sm:inline">{ch.label}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="text-ivory/30">
          <PatternRule />
        </div>
      </div>
    </motion.section>
  );
}

/** Reduced motion: the same story as a simple vertical list with stills. */
function StoryStatic() {
  return (
    <section id="story" className="laterite relative z-10 py-24 text-ivory md:py-36">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <SectionLabel index="07" label={story.eyebrow} className="mb-16 text-sand" />
        <div className="grid gap-16 md:grid-cols-2">
          {chapters.map((c, i) => (
            <article key={c.label} className="grid grid-cols-[1fr_1.2fr] gap-6">
              <div className="relative aspect-[4/5] overflow-hidden">
                {c.poster ? (<Image src={c.poster} alt={c.alt} fill sizes="25vw" className="object-cover" />) : (<video src={`${c.video}#t=${c.segment?.from ?? 0.1}`} muted playsInline preload="metadata" aria-label={c.alt} className="absolute inset-0 h-full w-full object-cover" />)}
              </div>
              <div>
                <span className="eyebrow text-sand">
                  {String(i + 1).padStart(2, "0")} — {c.label}
                </span>
                <RevealLines lines={c.lines} className="display mt-4 text-4xl md:text-5xl" />
                <p className="mt-4 leading-[1.8] text-ivory/80">{c.copy}</p>
                <p lang="mr" className="mt-4 font-marathi text-2xl text-sand">
                  {c.marathi}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
