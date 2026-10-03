"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import { testimonials } from "@/lib/content";
import { EASE_LUXE } from "@/lib/motion";

const DURATION = 7;

export default function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (paused || reduced) return;
    const id = window.setTimeout(() => setI((v) => (v + 1) % testimonials.length), DURATION * 1000);
    return () => window.clearTimeout(id);
  }, [i, paused, reduced]);

  const t = testimonials[i];

  return (
    <section
      className="relative overflow-hidden bg-ink-2 py-28 text-ivory md:py-40"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <SectionLabel index="09" label="Guests" className="mb-14 text-sand md:mb-20" />

        <div className="grid gap-10 md:grid-cols-12">
          <span aria-hidden className="display text-[9rem] leading-[0.6] text-raviraj md:col-span-1 md:text-[12rem]">
            &ldquo;
          </span>
          <div className="min-h-[18rem] md:col-span-10 md:min-h-[22rem]" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.figure
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.6 } }}
              >
                <blockquote className="display text-[clamp(2rem,4.6vw,4.75rem)] leading-[1.08]">
                  {t.quote.split(" ").map((w, k) => (
                    <span key={k} className="inline-block overflow-hidden pb-[0.1em] align-top">
                      <motion.span
                        className="mr-[0.25em] inline-block"
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        transition={{ duration: 1, ease: EASE_LUXE, delay: k * 0.03 }}
                      >
                        {w}
                      </motion.span>
                    </span>
                  ))}
                </blockquote>
                <motion.figcaption
                  className="eyebrow mt-10 flex items-center gap-4 text-sand/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  <span className="h-px w-10 bg-terracotta" /> {t.name}
                </motion.figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-14 flex gap-4 md:ml-[calc(100%/12)]">
          {testimonials.map((_, k) => (
            <button
              key={k}
              type="button"
              aria-label={`Show testimonial ${k + 1}`}
              onClick={() => setI(k)}
              className="relative h-8 w-20 md:w-28"
            >
              <span className="absolute inset-x-0 top-1/2 h-px bg-ivory/15" />
              {k === i && (
                <motion.span
                  key={`${i}-${paused}`}
                  className="absolute inset-x-0 top-1/2 h-px origin-left bg-terracotta"
                  initial={{ scaleX: paused || reduced ? 1 : 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: paused || reduced ? 0 : DURATION, ease: "linear" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
