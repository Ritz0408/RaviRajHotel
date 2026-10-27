"use client";

import { motion } from "framer-motion";
import RevealLines from "@/components/ui/RevealLines";
import SectionLabel from "@/components/ui/SectionLabel";
import { dining } from "@/lib/content";
import { EASE_LUXE } from "@/lib/motion";

export default function Dining() {
  return (
    <section id="dining" className="relative overflow-hidden bg-ink pb-10 pt-14 text-ivory md:pb-16 md:pt-24">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <SectionLabel index="02" label={dining.eyebrow} className="mb-14 text-sand md:mb-20" />

        <div className="grid gap-16 md:grid-cols-12 md:gap-6">
          <div className="flex flex-col justify-between gap-14 md:col-span-12">
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
          </div>
        </div>
      </div>
    </section>
  );
}
