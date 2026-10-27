"use client";

import { motion } from "framer-motion";
import RevealLines from "@/components/ui/RevealLines";
import Reel from "@/components/ui/Reel";
import SectionLabel from "@/components/ui/SectionLabel";
import PatternRule from "@/components/ui/PatternRule";
import { culture } from "@/lib/content";
import { EASE_LUXE } from "@/lib/motion";

export default function Culture() {
  return (
    <section className="relative overflow-hidden bg-offwhite py-28 text-ink md:py-44">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <SectionLabel index="08" label={culture.eyebrow} className="mb-14 text-raviraj md:mb-20" />

        <div className="grid gap-16 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-6">
            <RevealLines lines={culture.title} className="display text-[clamp(2.9rem,7.5vw,8rem)] text-burgundy" />
            <motion.p
              className="mt-10 max-w-[44ch] leading-[1.85] text-ink/70"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.3, ease: EASE_LUXE }}
            >
              {culture.copy}
            </motion.p>

            <dl className="mt-14 border-t border-ink/15">
              {culture.details.map((d, i) => (
                <motion.div
                  key={d.term}
                  className="group grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-ink/15 py-6 md:grid-cols-[3rem_14rem_1fr]"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: EASE_LUXE, delay: i * 0.1 }}
                >
                  <span className="eyebrow pt-2 text-[0.6rem] text-terracotta">0{i + 1}</span>
                  <dt className="display text-3xl text-burgundy transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:translate-x-2">
                    {d.term}
                  </dt>
                  <dd className="col-start-2 mt-2 text-sm leading-[1.7] text-ink/60 md:col-start-3 md:mt-0 md:pt-2">
                    {d.text}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>

          <div className="relative md:col-span-5 md:col-start-8">
            <div data-reveal="scale" className="relative">
              <Reel
                src={culture.video.src}
                from={culture.video.from}
                to={culture.video.to}
                label={culture.video.label}
                className="aspect-[3/4] w-full"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
              <span className="eyebrow pointer-events-none absolute bottom-4 left-5 text-[0.6rem] text-ivory/85">
                The hall · every evening
              </span>
            </div>
            <div className="mt-6 text-raviraj">
              <PatternRule className="opacity-60" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
