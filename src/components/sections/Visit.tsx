"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import RevealLines from "@/components/ui/RevealLines";
import DirectionLinks from "@/components/ui/DirectionLinks";
import { locations, visit } from "@/lib/content";
import { EASE_LUXE } from "@/lib/motion";

export default function Visit() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.3, 1]);
  const inset = useTransform(scrollYProgress, [0, 0.6], reduced ? [0, 0] : [8, 0]);
  const clipPath = useTransform(inset, (v) => `inset(${v}% ${v}% 0% ${v}%)`);
  const open = locations.filter((l) => !l.comingSoon);

  return (
    <section id="visit" ref={ref} className="relative bg-ink text-ivory">
      <motion.div style={{ clipPath }} className="relative min-h-[100svh] overflow-hidden">
        <motion.div style={{ scale }} className="absolute inset-0">
          <Image
            src={visit.image.src}
            alt={visit.image.alt}
            fill
            sizes="100vw"
            quality={85}
            style={{ objectPosition: visit.image.position }}
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-ink/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/50" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-[1680px] flex-col justify-between px-5 py-24 md:px-10 md:py-28">
          <span className="eyebrow flex items-center gap-4 text-sand">
            <span className="h-px w-10 bg-terracotta" /> 05 — {visit.eyebrow}
          </span>

          <div>
            <RevealLines
              lines={visit.title}
              className="display text-[clamp(3.5rem,12vw,13rem)] leading-[0.86]"
              stagger={0.15}
            />
            <div className="mt-12 grid gap-12 md:grid-cols-12">
              <motion.p
                className="max-w-[38ch] text-lg leading-[1.8] text-ivory/80 md:col-span-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.3, ease: EASE_LUXE }}
              >
                {visit.copy}
              </motion.p>
              <div className="grid gap-10 sm:grid-cols-2 md:col-span-7 md:col-start-6">
                {open.map((l, i) => (
                  <motion.div
                    key={l.id}
                    className="border-t border-ivory/20 pt-6"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: EASE_LUXE, delay: 0.15 + i * 0.12 }}
                  >
                    <span className="eyebrow text-[0.6rem] text-terracotta">{l.index}</span>
                    <h3 className="display mt-3 text-4xl">
                      {l.place} <em className="italic text-sand">{l.town}</em>
                    </h3>
                    <address className="mt-3 not-italic leading-[1.8] text-ivory/70">
                      {l.address.join(", ")}
                    </address>
                    {l.maps && (
                      <div className="mt-7">
                        <DirectionLinks
                          maps={l.maps}
                          appleMaps={l.appleMaps}
                          label="Get directions"
                          className={`${i === 0 ? "btn-primary" : "btn-ghost"} eyebrow`}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
