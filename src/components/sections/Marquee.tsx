"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { marquee } from "@/lib/content";

/** Two counter-drifting lines of words, driven by scroll — no autoplay. */
export default function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);
  const row = [...marquee, ...marquee, ...marquee];

  return (
    <div ref={ref} aria-hidden className="overflow-hidden border-y border-ivory/10 bg-ink py-10 text-ivory md:py-14">
      <motion.div style={{ x: x1 }} className="flex w-max items-center gap-10 whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="display text-[clamp(3rem,8vw,8rem)] italic">{w}</span>
            <span className="h-2 w-2 rotate-45 bg-terracotta" />
          </span>
        ))}
      </motion.div>
      <motion.div style={{ x: x2 }} className="mt-2 flex w-max items-center gap-10 whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="display text-[clamp(3rem,8vw,8rem)] text-transparent [-webkit-text-stroke:1px_rgba(243,235,223,0.35)]">
              {w}
            </span>
            <span className="h-2 w-2 rotate-45 border border-sand/40" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
