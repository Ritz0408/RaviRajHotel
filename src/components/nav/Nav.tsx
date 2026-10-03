"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { brand, nav } from "@/lib/content";
import { EASE_LUXE } from "@/lib/motion";
import { scrollToHash, useLenis } from "@/components/providers/SmoothScroll";

export default function Nav() {
  const lenis = useLenis();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > window.innerHeight * 0.6);
      setHidden(y > 160 && y > lastY);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open, lenis]);

  const go = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToHash(lenis, hash);
  };

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,transform] duration-700 ease-[var(--ease-luxe)] ${
          solid && !open ? "border-b border-ivory/10 bg-ink/92" : "border-b border-transparent"
        } ${hidden && !open ? "-translate-y-full" : "translate-y-0"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: EASE_LUXE, delay: 1.2 }}
      >
        <nav className="mx-auto flex h-18 max-w-[1680px] items-center justify-between px-5 md:h-22 md:px-10">
          <a href="#top" onClick={go("#top")} className="group flex items-baseline gap-3" aria-label={brand.name}>
            <span className="font-serif text-[1.35rem] uppercase tracking-[0.24em] text-ivory">
              Raviraj
            </span>
            <span className="eyebrow hidden text-[0.6rem] text-sand/70 sm:inline">Hotel</span>
          </a>

          <ul className="hidden items-center gap-9 lg:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={go(item.href)}
                  className="link-line eyebrow pb-1 text-ivory/80 transition-colors hover:text-ivory"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <a
              href="#visit"
              onClick={go("#visit")}
              className="btn-ghost eyebrow hidden px-6 py-3 text-ivory md:inline-flex"
            >
              Plan a visit
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="eyebrow flex items-center gap-3 py-3 text-ivory lg:hidden"
            >
              {open ? "Close" : "Menu"}
              <span className="relative block h-3 w-6" aria-hidden>
                <span
                  className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ${open ? "top-1.5 rotate-45" : "top-0"}`}
                />
                <span
                  className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ${open ? "top-1.5 -rotate-45" : "top-3"}`}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col justify-between bg-burgundy-900 px-5 pb-10 pt-28"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="flex flex-col gap-2">
              {[...nav, { label: "Plan a visit", href: "#visit" }].map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <motion.a
                    href={item.href}
                    onClick={go(item.href)}
                    className="display block py-1 text-[clamp(2.75rem,12vw,4.5rem)] text-ivory"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.25 + i * 0.06 }}
                  >
                    {item.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <div className="flex items-end justify-between">
              <span lang="mr" className="font-marathi text-2xl text-sand/80">
                {brand.marathi}
              </span>
              <span className="eyebrow max-w-[16ch] text-right text-sand/70">{brand.tagline}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
