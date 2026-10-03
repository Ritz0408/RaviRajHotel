"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import RevealLines from "@/components/ui/RevealLines";
import RevealImage from "@/components/ui/RevealImage";
import SectionLabel from "@/components/ui/SectionLabel";
import { dining, video } from "@/lib/content";
import { EASE_LUXE } from "@/lib/motion";

/** The evening reel, loaded only when near the viewport and looped over the dining-hall segment. */
function EveningReel() {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "200px 0px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (inView && !reduced) {
      if (v.preload !== "auto") {
        v.preload = "auto";
        v.currentTime = video.loopFrom;
      }
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [inView, reduced]);

  return (
    <video
      ref={ref}
      src={`${video.src}#t=${video.loopFrom}`}
      muted
      playsInline
      preload="metadata"
      onTimeUpdate={(e) => {
        const v = e.currentTarget;
        if (v.currentTime >= video.loopTo) v.currentTime = video.loopFrom;
      }}
      aria-label="Evening at the Hotel Raviraj dining hall"
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

export default function Dining() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const reelY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <section id="dining" ref={ref} className="relative overflow-hidden bg-ink py-28 text-ivory md:py-44">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <SectionLabel index="05" label={dining.eyebrow} className="mb-14 text-sand md:mb-20" />

        <div className="grid gap-16 md:grid-cols-12 md:gap-6">
          {/* Reel: a tall, framed portrait — honest to the phone footage */}
          <motion.div style={{ y: reelY }} className="relative md:col-span-5 lg:col-span-4">
            <motion.div
              className="relative aspect-[3/4] overflow-hidden bg-ink-2"
              initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{ duration: 1.6, ease: EASE_LUXE }}
            >
              <EveningReel />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />
              <div className="absolute inset-x-5 bottom-5 flex items-center justify-between">
                <span className="eyebrow text-[0.62rem] text-ivory/80">Evenings at Raviraj</span>
                <span className="flex items-center gap-2 eyebrow text-[0.6rem] text-ivory/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-terracotta" /> Reel
                </span>
              </div>
            </motion.div>
          </motion.div>

          <div className="flex flex-col justify-between gap-14 md:col-span-7 md:col-start-6 lg:col-span-7 lg:col-start-6">
            <RevealLines
              lines={dining.title}
              className="display text-[clamp(2.9rem,7vw,7.5rem)] text-ivory"
            />
            <div className="grid gap-12 lg:grid-cols-7">
              <motion.p
                className="leading-[1.85] text-sand/85 lg:col-span-4"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.3, ease: EASE_LUXE }}
              >
                {dining.copy}
              </motion.p>
            </div>

            <ul className="border-t border-ivory/10">
              {dining.highlights.map((h, i) => (
                <motion.li
                  key={h.name}
                  className="group relative flex items-baseline justify-between gap-6 overflow-hidden border-b border-ivory/10 py-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: EASE_LUXE, delay: i * 0.1 }}
                >
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-raviraj/25 transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:scale-y-100" />
                  <span className="relative flex items-baseline gap-5">
                    <span className="eyebrow text-[0.6rem] text-terracotta">0{i + 1}</span>
                    <span className="display text-3xl transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:translate-x-3 md:text-5xl">
                      {h.name}
                    </span>
                  </span>
                  <span className="relative hidden text-right text-sm text-sand/70 sm:block">{h.note}</span>
                </motion.li>
              ))}
            </ul>

            <RevealImage
              src={dining.image.src}
              alt={dining.image.alt}
              position={dining.image.position}
              sizes="(min-width: 768px) 55vw, 100vw"
              from="right"
              className="aspect-[16/9] w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
