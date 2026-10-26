"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { brand, brotherhood } from "@/lib/content";

/**
 * A tall scroll-scene with a sticky stage:
 *  1. A small framed photograph of the cricketers widens to full bleed
 *     while the statement grows behind it.
 *  2. The passage lights up word by word.
 *  3. The four pillars settle in.
 */
export default function Brotherhood() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const clip = useTransform(p, [0, 0.32], reduced ? [0, 0] : [26, 0]);
  const clipX = useTransform(p, [0, 0.32], reduced ? [0, 0] : [34, 0]);
  const clipPath = useTransform([clip, clipX], ([y, x]) => `inset(${y}% ${x}% ${y}% ${x}%)`);
  const imgScale = useTransform(p, [0, 0.4], reduced ? [1, 1] : [1.35, 1.05]);
  const dim = useTransform(p, [0.25, 0.45], [0, 0.72]);

  const titleScale = useTransform(p, [0, 0.32], reduced ? [1, 1] : [0.82, 1]);
  const titleOpacity = useTransform(p, [0.3, 0.42], [1, 0]);
  const titleY = useTransform(p, [0.3, 0.42], ["0%", "-30%"]);

  const passageOpacity = useTransform(p, [0.38, 0.46], [0, 1]);
  const pillarsOpacity = useTransform(p, [0.82, 0.92], [0, 1]);
  const pillarsY = useTransform(p, [0.82, 0.92], [30, 0]);

  const words = brotherhood.passage.split(" ");
  const start = 0.46;
  const end = 0.82;
  const step = (end - start) / words.length;

  // one scroll handler lights the words (instead of ~60 separate motion values)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lit = useRef(-1);
  useMotionValueEvent(p, "change", (v) => {
    const n = Math.max(-1, Math.min(words.length - 1, Math.floor((v - start) / step)));
    if (n === lit.current) return;
    lit.current = n;
    wordRefs.current.forEach((el, i) => {
      if (el) el.style.opacity = i <= n ? "1" : "0.14";
    });
  });

  return (
    <section ref={ref} className="relative h-[260vh] bg-burgundy-900 md:h-[340vh] text-ivory" aria-label="Brotherhood">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Statement laid over the frame */}
        <motion.div
          style={{ scale: titleScale, opacity: titleOpacity, y: titleY }}
          className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-5 text-center"
        >
          <span className="eyebrow mb-6 text-terracotta">04 — {brotherhood.eyebrow}</span>
          <h2 className="display text-[clamp(3rem,10vw,11rem)] leading-[0.88]">
            Where <em className="italic text-sand">brotherhood</em>
            <br />
            becomes a tradition.
          </h2>
        </motion.div>

        {/* Framed photograph widening to full bleed */}
        <motion.div style={{ clipPath }} className="absolute inset-0 z-10">
          <motion.div style={{ scale: imgScale }} className="absolute inset-0">
            <Image
              src={brotherhood.image.src}
              alt={brotherhood.image.alt}
              fill
              sizes="100vw"
              quality={85}
              style={{ objectPosition: brotherhood.image.position }}
              className="object-cover saturate-[0.9]"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink/60" />
          <motion.div style={{ opacity: dim }} className="absolute inset-0 bg-burgundy-900" />
        </motion.div>

        {/* Passage lit word by word */}
        <motion.div
          style={{ opacity: passageOpacity }}
          className="absolute inset-0 z-20 mx-auto flex max-w-[1680px] flex-col justify-center px-5 md:px-10"
        >
          <span lang="mr" className="mb-8 font-marathi text-xl text-sand/80">
            {brand.marathi} — बंधुप्रेम
          </span>
          <p className="display max-w-[24ch] text-[clamp(1.55rem,4.2vw,4.4rem)] leading-[1.15]">
            {words.map((w, i) => (
              <span
                key={i}
                ref={(el) => {
                  wordRefs.current[i] = el;
                }}
                style={{ opacity: 0.14 }}
                className="mr-[0.28em] inline-block transition-opacity duration-300"
              >
                {w}
              </span>
            ))}
          </p>
          <motion.ul
            style={{ opacity: pillarsOpacity, y: pillarsY }}
            className="mt-14 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-4 border-t border-ivory/15 pt-8 md:grid-cols-4"
          >
            {brotherhood.pillars.map((pillar, i) => (
              <li key={pillar} className="flex items-baseline gap-3">
                <span className="eyebrow text-[0.6rem] text-terracotta">0{i + 1}</span>
                <span className="font-serif text-2xl italic">{pillar}</span>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
