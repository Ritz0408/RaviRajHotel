"use client";

import { useEffect } from "react";

/**
 * One IntersectionObserver for every `[data-reveal]` element: adds `.is-in` the first time it
 * scrolls into view (CSS in globals.css does the opacity/transform transition). Also flips
 * `data-live` on `[data-live-scene]` blocks so their CSS animations pause when off screen.
 */
export default function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const reveals = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const scenes = document.querySelectorAll<HTMLElement>("[data-live-scene]");

    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveals.forEach((el) => el.classList.add("is-in"));
      return;
    }

    root.classList.add("reveal-ready");
    const once = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          once.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    reveals.forEach((el) => once.observe(el));

    const live = new IntersectionObserver(
      (entries) => {
        for (const e of entries) (e.target as HTMLElement).dataset.live = String(e.isIntersecting);
      },
      { rootMargin: "80px 0px" },
    );
    scenes.forEach((el) => {
      el.dataset.live = "false";
      live.observe(el);
    });

    return () => {
      once.disconnect();
      live.disconnect();
    };
  }, []);

  return null;
}
