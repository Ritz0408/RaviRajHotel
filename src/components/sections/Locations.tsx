"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import RevealLines from "@/components/ui/RevealLines";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitLetters from "@/components/ui/SplitLetters";
import DirectionLinks from "@/components/ui/DirectionLinks";
import ThemeNote from "@/components/ui/ThemeNote";
import { locations } from "@/lib/content";
import { EASE_CURTAIN, EASE_LUXE } from "@/lib/motion";

type Location = (typeof locations)[number];

function ExploreCta({ loc }: { loc: Location }) {
  if (!loc.maps) {
    return <span className="eyebrow inline-flex items-center gap-3 text-sand/60">Coming soon</span>;
  }
  return (
    <DirectionLinks maps={loc.maps} appleMaps={loc.appleMaps} label="Explore location" className="btn-primary eyebrow" cursor="Open" />
  );
}

function Photo({ loc, priority }: { loc: Location; priority?: boolean }) {
  return (
    <Image
      src={loc.media.src}
      alt={loc.media.alt}
      fill
      sizes="(min-width: 1024px) 66vw, 90vw"
      preload={priority}
      style={{ objectPosition: loc.media.position }}
      className={`object-cover ${loc.comingSoon ? "grayscale-[0.6] brightness-[0.45]" : ""}`}
    />
  );
}

export default function Locations() {
  const [active, setActive] = useState(0);
  const loc = locations[active];

  // mobile swipe: the snapped card becomes active
  const railRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const cards = [...rail.children] as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(cards.indexOf(e.target as HTMLElement));
        }),
      { root: rail, threshold: 0.6 },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section id="locations" className="laterite relative overflow-hidden py-28 text-ivory md:py-40">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <SectionLabel index="03" label="Discover our locations" className="text-sand" />
        <ThemeNote className="mb-12 mt-5" />
        <div className="mb-14 flex flex-col justify-between gap-8 md:mb-20 lg:flex-row lg:items-end">
          <RevealLines
            lines={["Discover our", "*locations*."]}
            className="display text-[clamp(2.9rem,7vw,7.5rem)]"
          />
          <p className="max-w-[36ch] leading-[1.8] text-sand/80">
            One family, one welcome — across three homes in the Kolhapur countryside.
          </p>
        </div>

        {/* Desktop: dominant stage + numbered navigation */}
        <div className="hidden gap-6 lg:grid lg:grid-cols-12">
          <div className="relative col-span-8 h-[74vh] min-h-[520px] overflow-hidden bg-ink">
            <AnimatePresence initial={false}>
              <motion.div
                key={loc.id}
                className="absolute inset-0"
                initial={{ clipPath: "inset(0% 0% 0% 100%)", zIndex: 2 }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)", zIndex: 2 }}
                exit={{ zIndex: 1, opacity: 0.999, transition: { duration: 1.3 } }}
                transition={{ duration: 1.3, ease: EASE_CURTAIN }}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1.25, x: "6%" }}
                  animate={{ scale: 1.04, x: "0%" }}
                  transition={{ duration: 2.4, ease: EASE_LUXE }}
                >
                  <Photo loc={loc} priority={active === 0} />
                </motion.div>
              </motion.div>
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-ink/85 via-ink/10 to-ink/30" />

            {/* Giant numeral */}
            <div className="pointer-events-none absolute right-8 top-6 z-10 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={loc.index}
                  className="display block text-[12rem] leading-[0.9] text-ivory/85"
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.8, ease: EASE_LUXE }}
                >
                  {loc.index}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Name, address, CTA */}
            <div className="absolute inset-x-10 bottom-10 z-10 flex items-end justify-between gap-10">
              <div key={loc.id}>
                <h3 className="display text-[clamp(3.5rem,6.5vw,7rem)] leading-[0.9]">
                  <SplitLetters text={loc.place} play stagger={0.04} />
                  <br />
                  <SplitLetters text={loc.town} play delay={0.15} stagger={0.04} className="italic text-sand" />
                </h3>
                <motion.p
                  className="mt-6 max-w-[38ch] text-sand/85"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: EASE_LUXE, delay: 0.4 }}
                >
                  {loc.copy}
                </motion.p>
              </div>
              <motion.div
                key={`${loc.id}-cta`}
                className="flex shrink-0 flex-col items-end gap-5 text-right"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE_LUXE, delay: 0.55 }}
              >
                <address className="eyebrow not-italic leading-[2] text-ivory/75">
                  {loc.address.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
                <ExploreCta loc={loc} />
              </motion.div>
            </div>
          </div>

          <ul className="col-span-4 flex flex-col justify-between border-t border-ivory/15" role="tablist">
            {locations.map((l, i) => {
              const on = i === active;
              return (
                <li key={l.id} className="border-b border-ivory/15">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className="group grid w-full grid-cols-[3.5rem_1fr_auto] items-center gap-4 py-8 text-left"
                  >
                    <span className={`eyebrow tabular-nums transition-colors duration-500 ${on ? "text-terracotta" : "text-sand/50"}`}>
                      {l.index}
                    </span>
                    <span>
                      <span
                        className={`display block text-[2.6rem] leading-none transition-[color,transform] duration-700 ease-[var(--ease-luxe)] ${
                          on ? "translate-x-2 text-ivory" : "text-ivory/45 group-hover:text-ivory/75"
                        }`}
                      >
                        {l.place}
                      </span>
                      <span className={`eyebrow mt-2 block transition-colors duration-500 ${on ? "text-sand" : "text-sand/45"}`}>
                        {l.comingSoon ? "To be announced" : l.town}
                      </span>
                    </span>
                    <span className="relative h-20 w-16 overflow-hidden">
                      <span
                        className={`absolute inset-0 transition-[clip-path,opacity] duration-700 ease-[var(--ease-luxe)] ${
                          on ? "opacity-100 [clip-path:inset(0_0_0_0)]" : "opacity-60 [clip-path:inset(15%_15%_15%_15%)]"
                        }`}
                      >
                        <Photo loc={l} />
                      </span>
                    </span>
                  </button>
                  <span className="block h-px bg-ivory/10">
                    <span
                      className={`block h-px origin-left bg-terracotta transition-transform duration-1000 ease-[var(--ease-luxe)] ${
                        on ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mobile: swipe rail */}
        <div className="lg:hidden">
          <div ref={railRef} className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5" data-lenis-prevent>
            {locations.map((l) => (
              <article key={l.id} className="relative aspect-[3/4] w-[84vw] shrink-0 snap-center overflow-hidden bg-ink md:w-[60vw]">
                <Photo loc={l} />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-ink/30" />
                <span className="display absolute right-5 top-3 text-7xl text-ivory/85">{l.index}</span>
                <div className="absolute inset-x-5 bottom-6">
                  <h3 className="display text-5xl leading-[0.9]">
                    {l.place}
                    <br />
                    <em className="italic text-sand">{l.town}</em>
                  </h3>
                  <address className="eyebrow mt-4 not-italic leading-[2] text-ivory/70">
                    {l.address.join(" · ")}
                  </address>
                  <div className="mt-5">
                    <ExploreCta loc={l} />
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3">
            {locations.map((l, i) => (
              <span
                key={l.id}
                className={`h-px transition-all duration-700 ${i === active ? "w-14 bg-terracotta" : "w-6 bg-ivory/25"}`}
              />
            ))}
            <span className="eyebrow ml-auto text-[0.6rem] text-sand/60">Swipe</span>
          </div>
        </div>
      </div>
    </section>
  );
}
