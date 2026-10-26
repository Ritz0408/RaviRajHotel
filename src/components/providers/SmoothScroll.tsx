"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

/** Scroll to an in-page anchor, through Lenis when it is running. */
export function scrollToHash(lenis: Lenis | null, hash: string) {
  const el = document.querySelector(hash);
  if (!el) return;
  if (lenis) lenis.scrollTo(el as HTMLElement, { duration: 1.8 });
  else el.scrollIntoView({ behavior: "smooth" });
}

/**
 * Lenis smooths mouse wheels only. Phones and trackpads already scroll natively at full
 * frame rate, so there it is not loaded at all (no library, no extra rAF loop).
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // The hero is a scroll-driven story — always open it from the beginning.
    if (!window.location.hash) {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    if (reduced || !mouse) return;

    let instance: Lenis | undefined;
    let raf = 0;
    let dead = false;
    import("lenis").then(({ default: LenisCtor }) => {
      if (dead) return;
      instance = new LenisCtor({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      const tick = (time: number) => {
        instance?.raf(time);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      setLenis(instance);
    });
    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      instance?.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
