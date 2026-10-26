"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { EASE_LUXE } from "@/lib/motion";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  /** Parallax travel as a fraction of the frame height (0 disables). */
  parallax?: number;
  from?: "bottom" | "top" | "left" | "right";
  delay?: number;
  preload?: boolean;
  quality?: number;
  /** CSS object-position focal point. */
  position?: string;
};

const CLIP_FROM = {
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/**
 * Image frame that opens with a clip-path wipe while the photograph settles
 * from a slight zoom, then drifts with an optional scroll parallax.
 */
export default function RevealImage({
  src,
  alt,
  sizes,
  className = "",
  parallax = 0.08,
  from = "bottom",
  delay = 0,
  preload,
  quality = 75,
  position,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  // Native lazy-loading can miss images that start clipped, so load explicitly when near.
  const near = useInView(ref, { once: true, margin: "600px 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Parallax only where there is room and a pointer-class GPU; phones just get the reveal.
  const [roomy, setRoomy] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only capability check
    setRoomy(window.matchMedia("(min-width: 768px)").matches);
  }, []);
  const travel = reduced || !roomy ? 0 : parallax * 100;
  const y = useTransform(scrollYProgress, [0, 1], [`-${travel}%`, `${travel}%`]);

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden bg-ink-2 ${className}`}
      initial={reduced ? { opacity: 0 } : { clipPath: CLIP_FROM[from] }}
      animate={
        inView ? (reduced ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }) : undefined
      }
      transition={{ duration: 1.6, ease: EASE_LUXE, delay }}
    >
      <motion.div
        className="absolute inset-x-0 will-change-transform"
        style={{
          y,
          top: `-${travel}%`,
          bottom: `-${travel}%`,
        }}
      >
        <motion.div
          className="absolute inset-0"
          initial={reduced ? false : { scale: 1.1 }}
          animate={inView ? { scale: 1 } : undefined}
          transition={{ duration: 1.6, ease: EASE_LUXE, delay }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            quality={quality}
            preload={preload}
            loading={preload || near ? "eager" : "lazy"}
            style={{ objectPosition: position }}
            className="object-cover"
          />
          {/* warm grade as a flat overlay — cheaper than a CSS filter on a moving image */}
          <div className="absolute inset-0 bg-[#3a1a0c]/[0.12] mix-blend-multiply" />
        </motion.div>
      </motion.div>
      {/* gentle vignette so daylight photographs sit in the dusk palette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_55%,rgba(14,8,7,0.35)_100%)]" />
    </motion.div>
  );
}
