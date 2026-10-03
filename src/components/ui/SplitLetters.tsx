"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_LUXE } from "@/lib/motion";

type Props = {
  text: string;
  play: boolean;
  className?: string;
  delay?: number;
  stagger?: number;
};

/** Letters rise from behind a mask, from soft focus to sharp. */
export default function SplitLetters({ text, play, className = "", delay = 0, stagger = 0.06 }: Props) {
  const reduced = useReducedMotion();
  return (
    <span className={`inline-flex overflow-hidden pb-[0.12em] -mb-[0.12em] ${className}`} aria-label={text}>
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block will-change-transform"
          initial={reduced ? { opacity: 0 } : { y: "110%", opacity: 0, filter: "blur(12px)" }}
          animate={play ? { y: "0%", opacity: 1, filter: "blur(0px)" } : undefined}
          transition={{ duration: 1.5, ease: EASE_LUXE, delay: delay + i * stagger }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}
