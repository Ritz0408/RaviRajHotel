"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
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
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [active, live]);

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
          src={c.video}
          poster={c.poster}
          muted
          loop
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

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(p, "change", (v) => {
    setActive(Math.min(chapters.length - 1, Math.max(0, Math.floor(v * chapters.length * 0.999))));
  });
  const fill = useTransform(p, [0, 1], [0, 1]);

  // entrance: the red panel widens to full bleed as it rises over the hero
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const inset = useTransform(enter, [0, 1], [reduced ? 0 : 5, 0]);
  const clipPath = useTransform(inset, (v) => `inset(0% ${v}% 0% ${v}%)`);

  if (reduced) return <StoryStatic />;

  const c = chapters[active];

  return (
    <motion.section
      id="story"
      ref={ref}
      style={{ clipPath }}
      className="laterite relative z-10 h-[300vh] text-ivory md:h-[340vh]"
      aria-label={story.eyebrow}
    >
      <div className="sticky top-0 flex h-[100svh] min-h-[640px] flex-col overflow-hidden">
        {/* giant Marathi watermark */}
        <div
          lang="mr"
          aria-hidden
          className="pointer-events-none absolute -right-[4vw] bottom-[8vh] select-none whitespace-nowrap font-marathi text-[24vw] leading-none text-ivory/[0.04]"
        >
          {brand.marathi}
        </div>

        <div className="relative mx-auto flex w-full max-w-[1680px] flex-1 flex-col px-5 pb-6 pt-24 md:px-10 md:pb-10 md:pt-28">
          <SectionLabel index="02" label={story.eyebrow} className="text-sand" />

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
                <div className="absolute -right-3 -top-3 h-full w-full border border-ivory/25 md:-right-5 md:-top-5" />
                <div className="relative aspect-[4/5] max-h-[32svh] overflow-hidden bg-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] md:max-h-[64svh]">
                  {chapters.map((ch, i) => (
                    <Clip key={ch.video} c={ch} index={i} active={i === active} live={live} />
                  ))}
                  <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
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
              <motion.span style={{ scaleX: fill }} className="absolute inset-0 origin-left bg-champagne" />
            </div>
            <ol className="mt-4 grid grid-cols-4">
              {chapters.map((ch, i) => (
                <li key={ch.label} className="relative">
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
        <SectionLabel index="02" label={story.eyebrow} className="mb-16 text-sand" />
        <div className="grid gap-16 md:grid-cols-2">
          {chapters.map((c, i) => (
            <article key={c.label} className="grid grid-cols-[1fr_1.2fr] gap-6">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src={c.poster} alt={c.alt} fill sizes="25vw" className="object-cover" />
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
