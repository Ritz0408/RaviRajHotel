"use client";

import { useRef, type ElementType } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { EASE_LUXE, splitEmphasis } from "@/lib/motion";

type Props = {
  lines: string[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** When provided, the reveal is driven externally instead of by viewport entry. */
  play?: boolean;
};

/**
 * Each line slides up from behind its own mask. `*word*` renders italic.
 */
export default function RevealLines({
  lines,
  as: Tag = "h2",
  className,
  lineClassName = "",
  delay = 0,
  stagger = 0.11,
  play,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduced = useReducedMotion();
  const shown = play ?? inView;

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className={`block will-change-transform ${lineClassName}`}
            initial={reduced ? { opacity: 0 } : { y: "105%", rotate: 1.5 }}
            animate={
              shown ? (reduced ? { opacity: 1 } : { y: "0%", rotate: 0 }) : undefined
            }
            transition={{ duration: 1.3, ease: EASE_LUXE, delay: delay + i * stagger }}
          >
            {splitEmphasis(line).map((part, j) =>
              part.em ? (
                <em key={j} className="font-serif italic font-light">
                  {part.text}
                </em>
              ) : (
                <span key={j}>{part.text}</span>
              ),
            )}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
